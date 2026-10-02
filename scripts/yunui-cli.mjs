#!/usr/bin/env node

import { readFile, readdir, realpath } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(here, "../agent/catalog.generated.json");
const usage = `YunUI consumer CLI

Commands:
  yunui list [--entry <entry>] [--json]       List public exports
  yunui find <query> [--json]                 Search names and descriptions
  yunui info <name|entry/name> [--json]       Show exact import and API details
  yunui doctor [--cwd <project>] [--json] [--strict]
                                                Read-only consumer setup checks
  yunui audit [--cwd <project>] [--json] [--strict]
                                                AST audit for raw controls and library reuse
  yunui init [--cwd <project>] [--agent both|codex|claude] [--css <global.css>] [--json]
                                                Add local agent guidance (opt-in)

Entry names are the package subpaths: ., ./adapters, ./patterns, ./ai,
./content, and ./chat. The exact import examples and docs links come from the
generated catalogue. See agent/skills/yunui/SKILL.md for critical reuse policy
and the recipes in agent/recipes for concrete imports.
`;

function requiredValue(args, index, flag) {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
  return value;
}

function parseArgs(args) {
  const positional = [];
  const options = { json: false, cwd: process.cwd(), agent: "both", strict: false, agentSpecified: false };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--json") options.json = true;
    else if (arg === "--strict") options.strict = true;
    else if (arg === "--cwd") options.cwd = path.resolve(requiredValue(args, i++, "--cwd"));
    else if (arg.startsWith("--cwd=")) {
      if (!arg.slice(6)) throw new Error("--cwd requires a path");
      options.cwd = path.resolve(arg.slice(6));
    }
    else if (arg === "--entry") options.entry = requiredValue(args, i++, "--entry");
    else if (arg.startsWith("--entry=")) {
      if (!arg.slice(8)) throw new Error("--entry requires a value");
      options.entry = arg.slice(8);
    }
    else if (arg === "--agent") { options.agent = requiredValue(args, i++, "--agent"); options.agentSpecified = true; }
    else if (arg.startsWith("--agent=")) {
      if (!arg.slice(8)) throw new Error("--agent requires a value");
      options.agent = arg.slice(8);
      options.agentSpecified = true;
    }
    else if (arg === "--css") options.css = requiredValue(args, i++, "--css");
    else if (arg.startsWith("--css=")) {
      if (!arg.slice(6)) throw new Error("--css requires a path");
      options.css = arg.slice(6);
    }
    else if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg.startsWith("--")) throw new Error(`Unsupported flag: ${arg}`);
    else positional.push(arg);
  }
  return { positional, options };
}

function validateCommandOptions(command, options) {
  if (options.strict && !["doctor", "audit"].includes(command)) throw new Error("--strict is only supported by doctor and audit");
  if (options.css !== undefined && command !== "init") throw new Error("--css is only supported by init");
  if (options.agentSpecified && command !== "init") throw new Error("--agent is only supported by init");
  if (options.entry !== undefined && command !== "list") throw new Error("--entry is only supported by list");
  if (options.json && !["list", "find", "info", "doctor", "audit", "init"].includes(command)) throw new Error(`--json is not supported by ${command}`);
}

async function readCatalog() {
  try {
    return JSON.parse(await readFile(catalogPath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(`Catalogue not found at ${catalogPath}. Run node scripts/gen-agent-catalog.mjs in the YunUI repository.`);
    }
    throw error;
  }
}

function normalizeEntry(value) {
  if (!value || value === "root") return ".";
  if (value === ".") return value;
  const normalized = value.startsWith("./") ? value : `./${value}`;
  return normalized.replace(/\/$/, "");
}

function exportSelector(value) {
  const raw = value.trim();
  if (!raw) return { name: "" };
  const colon = raw.match(/^(.+):([^/:]+)$/);
  if (colon) return { entry: normalizeEntry(colon[1]), name: colon[2] };
  const slash = raw.lastIndexOf("/");
  if (slash >= 0) {
    const prefix = raw.slice(0, slash);
    const name = raw.slice(slash + 1);
    if (prefix === "." || prefix.startsWith("./") || ["adapters", "patterns", "ai", "content", "chat"].includes(prefix)) {
      return { entry: normalizeEntry(prefix), name };
    }
  }
  return { name: raw };
}

function describeLine(value) {
  return (value ?? "").split(/\r?\n/, 1)[0].trim();
}

function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function renderList(catalog, options) {
  const entryFilter = options.entry ? normalizeEntry(options.entry) : null;
  if (entryFilter && !catalog.exports.some((item) => item.entry === entryFilter)) {
    throw new Error(`Unknown entry ${entryFilter}. Use "yunui list" to see available entries.`);
  }
  const results = catalog.exports.filter((item) => !entryFilter || item.entry === entryFilter);
  if (options.json) return writeJson(results);
  const groups = new Map();
  for (const item of results) {
    if (!groups.has(item.entry)) groups.set(item.entry, []);
    groups.get(item.entry).push(item);
  }
  for (const [entry, items] of groups) {
    process.stdout.write(`${entry} (${items.length})\n`);
    for (const item of items) {
      const note = describeLine(item.description);
      process.stdout.write(`  ${item.name} [${item.kind}]${note ? ` — ${note}` : ""}\n`);
    }
  }
  process.stdout.write(`\n${results.length} exports. Use "yunui info <name>" for the exact import and API signature.\n`);
}

function renderFind(catalog, query, options) {
  if (!query.trim()) throw new Error("Provide a search term. Example: yunui find dialog");
  const needle = query.toLowerCase();
  const results = catalog.exports.filter((item) =>
    [item.name, item.entry, item.description, item.source, item.import]
      .some((value) => value?.toLowerCase().includes(needle)),
  );
  if (options.json) return writeJson(results);
  if (!results.length) {
    process.stdout.write(`No exports match “${query}”.\n`);
    return;
  }
  for (const item of results) {
    process.stdout.write(`${item.entry}/${item.name} [${item.kind}]\n  ${item.import}\n`);
    const summary = describeLine(item.description);
    if (summary) process.stdout.write(`  ${summary}\n`);
  }
  process.stdout.write(`\n${results.length} match(es).\n`);
}

async function renderInfo(catalog, selector, options) {
  const selected = exportSelector(selector);
  if (!selected.name) throw new Error("Provide an export name. Example: yunui info ./content/MarkdownRenderer");
  const results = catalog.exports.filter((item) =>
    item.name === selected.name && (!selected.entry || item.entry === selected.entry),
  );
  if (!results.length) throw new Error(`No public export named ${selected.name} was found.`);
  let installedAlias = catalog.package;
  const project = await nearestPackage(options.cwd);
  if (project) {
    const aliases = likelyAliases(allDependencies(project.manifest), catalog.package);
    const installed = await findInstalledPackage(options.cwd, aliases, catalog.package);
    if (installed.root) installedAlias = installed.alias;
  }
  if (options.json) {
    return writeJson(results.map((item) => ({
      ...item,
      ...(installedAlias !== catalog.package
        ? { installAlias: installedAlias, consumerImport: item.import.replaceAll(catalog.package, installedAlias) }
        : {}),
    })));
  }
  for (const item of results) {
    process.stdout.write(`${item.name} — ${item.entry} (${item.kind}${item.typeOnly ? ", type-only" : ""})\n`);
    process.stdout.write(`${item.import}\n`);
    if (installedAlias !== catalog.package) {
      process.stdout.write(`For this install: ${item.import.replaceAll(catalog.package, installedAlias)}\n`);
    }
    if (item.props) process.stdout.write(`Props: ${item.props}\n`);
    if (item.propsFields?.length) {
      process.stdout.write("Props defined by YunUI:\n");
      for (const field of item.propsFields) {
        const optional = field.required ? "" : "?";
        process.stdout.write(`  ${field.name}${optional}: ${field.type}${field.default ? ` (default: ${field.default})` : ""}\n`);
        if (field.description) process.stdout.write(`    ${describeLine(field.description)}\n`);
      }
    }
    if (item.inheritsExternalProps) {
      process.stdout.write("Additional inherited HTML/ARIA or external props are available.\n");
    }
    if (item.signature) process.stdout.write(`Signature: ${item.signature}\n`);
    if (item.source) process.stdout.write(`Source: ${item.source}\n`);
    process.stdout.write(`Installed declaration: node_modules/${installedAlias}/${item.declarationFile}\n`);
    if (item.description) process.stdout.write(`\n${item.description}\n`);
    process.stdout.write(`\nDocs: ${item.docs.overview.route}`);
    if (item.docs.component) process.stdout.write(` · ${item.docs.component.route}`);
    process.stdout.write("\n\n");
  }
  if (results.length > 1 && !selected.entry) process.stdout.write("Specify an entry to disambiguate, e.g. yunui info ./content/CodeBlock.\n");
}

async function nearestPackage(cwd) {
  let directory = path.resolve(cwd);
  while (true) {
    try {
      const manifestPath = path.join(directory, "package.json");
      const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
      return { directory, manifest, manifestPath };
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
    const parent = path.dirname(directory);
    if (parent === directory) return null;
    directory = parent;
  }
}

function allDependencies(manifest) {
  return Object.assign(
    {},
    manifest.dependencies,
    manifest.devDependencies,
    manifest.peerDependencies,
    manifest.optionalDependencies,
  );
}

function likelyAliases(dependencies, packageName) {
  const aliases = new Set([packageName]);
  for (const [name, spec] of Object.entries(dependencies)) {
    if (typeof spec === "string" && (
      name === packageName ||
      spec.startsWith(`npm:${packageName}@`) ||
      spec === `npm:${packageName}` ||
      spec.startsWith("workspace:") ||
      spec.startsWith("file:") ||
      spec.startsWith("link:") ||
      spec.startsWith("github:") ||
      spec.startsWith("git+") ||
      spec.startsWith("git:") ||
      /^https?:\/\//.test(spec)
    )) {
      aliases.add(name);
    }
  }
  return [...aliases];
}

async function findInstalledPackage(cwd, aliases, packageName) {
  let current = path.resolve(cwd);
  const searched = [];
  while (true) {
    for (const alias of aliases) {
      const manifestPath = path.join(current, "node_modules", ...alias.split("/"), "package.json");
      searched.push(manifestPath);
      try {
        const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
        if (manifest.name === packageName) {
          return { root: path.dirname(manifestPath), manifest, manifestPath, alias };
        }
      } catch (error) {
        if (error?.code !== "ENOENT") continue;
      }
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return { searched };
}

const sourceExtensions = new Set([".css", ".pcss", ".scss", ".sass", ".less", ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".mts", ".cts", ".html", ".htm"]);
const ignoredDirectories = new Set([
  ".git", ".next", ".turbo", ".yarn", "node_modules", "dist", "build", "coverage", "vendor", ".cache",
  "__tests__", "__mocks__", "tests", "test", "e2e", "stories", "storybook", "generated", "fixtures",
  "reference", "references", "research",
]);

function isNonRuntimeSource(filename, root) {
  const relative = path.relative(root, filename).split(path.sep).join("/");
  const basename = path.basename(filename);
  if (relative.startsWith(".yunui/recipes/") || relative.startsWith("agent/recipes/")) return true;
  if (basename.endsWith(".d.ts")) return true;
  if (/(^|[._-])(test|spec|stories|story)([._-]|$)/i.test(basename)) return true;
  if (/\.generated\.[cm]?[jt]sx?$/i.test(basename) || /\.gen\.[cm]?[jt]sx?$/i.test(basename)) return true;
  return false;
}

async function projectFiles(root) {
  const files = [];
  async function visit(directory) {
    let entries;
    try { entries = await readdir(directory, { withFileTypes: true }); }
    catch { return; }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name)) await visit(path.join(directory, entry.name));
      } else if (entry.isFile() && sourceExtensions.has(path.extname(entry.name).toLowerCase())) {
        const filename = path.join(directory, entry.name);
        if (!isNonRuntimeSource(filename, root)) files.push(filename);
      }
    }
  }
  await visit(root);
  return files;
}

function moduleReferences(source) {
  const tokens = [];
  const identifierStart = /[A-Za-z_$]/;
  const identifierPart = /[A-Za-z0-9_$]/;
  let index = 0;

  function readString(quote) {
    index += 1;
    let value = "";
    while (index < source.length) {
      const char = source[index++];
      if (char === quote) break;
      if (char === "\\" && index < source.length) {
        const escaped = source[index++];
        const simple = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", v: "\v", "0": "\0" };
        value += simple[escaped] ?? escaped;
      } else value += char;
    }
    tokens.push({ kind: "string", value });
  }

  function canStartRegex() {
    const previous = tokens.at(-1);
    if (!previous) return true;
    if (previous.kind === "punct") return ["(", "[", "{", ",", ":", "=", "!", "?", ";", "=>", "&&", "||", "return"].includes(previous.value);
    return previous.kind === "identifier" && ["return", "case", "throw", "typeof", "void", "delete", "yield", "await", "else"].includes(previous.value);
  }

  function skipRegex() {
    index += 1;
    let inClass = false;
    while (index < source.length) {
      const char = source[index++];
      if (char === "\\") { index += 1; continue; }
      if (char === "[") inClass = true;
      else if (char === "]") inClass = false;
      else if (char === "/" && !inClass) break;
      else if (char === "\n" || char === "\r") break;
    }
    while (/[A-Za-z]/.test(source[index] ?? "")) index += 1;
  }

  while (index < source.length) {
    const char = source[index];
    if (/\s/.test(char)) { index += 1; continue; }
    if (char === "/" && source[index + 1] === "/") {
      index += 2;
      while (index < source.length && source[index] !== "\n" && source[index] !== "\r") index += 1;
      continue;
    }
    if (char === "/" && source[index + 1] === "*") {
      index += 2;
      const end = source.indexOf("*/", index);
      index = end < 0 ? source.length : end + 2;
      continue;
    }
    if (char === "'" || char === '"') { readString(char); continue; }
    if (char === "`") {
      index += 1;
      while (index < source.length) {
        const current = source[index++];
        if (current === "\\") index += 1;
        else if (current === "`") break;
      }
      tokens.push({ kind: "template", value: "" });
      continue;
    }
    if (char === "/" && canStartRegex()) { skipRegex(); tokens.push({ kind: "regex", value: "" }); continue; }
    if (identifierStart.test(char)) {
      const start = index++;
      while (index < source.length && identifierPart.test(source[index])) index += 1;
      tokens.push({ kind: "identifier", value: source.slice(start, index) });
      continue;
    }
    const operator = ["=>", "?.", "&&", "||", "??", "==", "===", "!=", "!==", "..."].find((item) => source.startsWith(item, index));
    if (operator) { tokens.push({ kind: "punct", value: operator }); index += operator.length; }
    else { tokens.push({ kind: "punct", value: char }); index += 1; }
  }

  const specs = [];
  function findFromString(start) {
    for (let cursor = start; cursor < tokens.length; cursor += 1) {
      const token = tokens[cursor];
      if (token.kind === "punct" && token.value === ";") return null;
      if (token.kind === "identifier" && token.value === "from" && tokens[cursor + 1]?.kind === "string") {
        return { specifier: tokens[cursor + 1].value, fromIndex: cursor };
      }
      if (cursor > start && token.kind === "identifier" && (token.value === "import" || token.value === "export")) return null;
    }
    return null;
  }
  function allTypeOnlySpecifiers(start, fromIndex) {
    if (tokens[start]?.kind === "identifier" && tokens[start].value === "type") return true;
    let openIndex = -1;
    for (let cursor = start; cursor < fromIndex; cursor += 1) {
      if (tokens[cursor].kind === "punct" && tokens[cursor].value === "{") { openIndex = cursor; break; }
    }
    if (openIndex < 0) return false;
    // A default or namespace binding before the braces is runtime even when
    // every named specifier is type-only.
    if (tokens.slice(start, openIndex).some((token) => token.kind === "identifier" && token.value !== "type")) return false;
    const segments = [];
    let segmentStart = openIndex + 1;
    let depth = 0;
    for (let cursor = openIndex + 1; cursor < fromIndex; cursor += 1) {
      const token = tokens[cursor];
      if (token.kind === "punct" && token.value === "{") depth += 1;
      else if (token.kind === "punct" && token.value === "}") {
        if (depth === 0) { segments.push(tokens.slice(segmentStart, cursor)); break; }
        depth -= 1;
      } else if (token.kind === "punct" && token.value === "," && depth === 0) {
        segments.push(tokens.slice(segmentStart, cursor));
        segmentStart = cursor + 1;
      }
    }
    const nonempty = segments.filter((segment) => segment.length);
    return nonempty.length > 0 && nonempty.every((segment) => segment[0].kind === "identifier" && segment[0].value === "type");
  }
  for (let cursor = 0; cursor < tokens.length; cursor += 1) {
    const token = tokens[cursor];
    if (token.kind === "identifier" && token.value === "import") {
      const next = tokens[cursor + 1];
      if (next?.kind === "string") { specs.push({ specifier: next.value, typeOnly: false }); continue; }
      if (next?.kind === "punct" && next.value === "(") {
        if (tokens[cursor + 2]?.kind === "string") specs.push({ specifier: tokens[cursor + 2].value, typeOnly: false });
        continue;
      }
      const found = findFromString(cursor + 1);
      if (found) specs.push({ specifier: found.specifier, typeOnly: allTypeOnlySpecifiers(cursor + 1, found.fromIndex) });
    } else if (token.kind === "identifier" && token.value === "export") {
      let start = cursor + 1;
      if (tokens[start]?.kind === "identifier" && tokens[start].value === "type") start += 1;
      if (tokens[start]?.kind === "punct" && ["*", "{"].includes(tokens[start].value)) {
        const found = findFromString(start + 1);
        if (found) specs.push({ specifier: found.specifier, typeOnly: allTypeOnlySpecifiers(cursor + 1, found.fromIndex) });
      }
    }
  }
  return specs;
}

function cssSourceArguments(cssText) {
  const uncommented = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  return [...uncommented.matchAll(/@source\s+(?:"([^"]+)"|'([^']+)'|([^;]+))\s*;/g)]
    .map((match) => (match[1] ?? match[2] ?? match[3] ?? "").trim())
    .filter((value) => value && !value.startsWith("inline("));
}

function cssImportSpecifiers(cssText) {
  const uncommented = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  return [...uncommented.matchAll(/@(?:import|use|forward)\s+(?:url\(\s*)?["']([^"']+)["']/g)]
    .map((match) => match[1]);
}

function localStylesheetPath(projectRoot, importer, specifier, knownFiles) {
  if (!specifier.startsWith(".") && !path.isAbsolute(specifier)) return null;
  const clean = specifier.split(/[?#]/, 1)[0];
  const resolved = clean.startsWith("/")
    ? path.resolve(projectRoot, `.${clean}`)
    : path.resolve(path.dirname(importer), clean);
  const ext = path.extname(resolved);
  const candidates = ext ? [resolved] : [resolved, ...[...sourceExtensions].filter((value) => [".css", ".pcss", ".scss", ".sass", ".less"].includes(value)).map((value) => resolved + value)];
  return candidates.find((candidate) => knownFiles.has(path.resolve(candidate))) ?? null;
}

function htmlStylesheetImports(source) {
  const markup = source
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
  const specs = [];
  for (const [, tag] of markup.matchAll(/<link\b([^>]*)>/gi)) {
    const rel = /\brel\s*=\s*["']?([^\s"'>]+)/i.exec(tag)?.[1];
    const href = /\bhref\s*=\s*["']([^"']+)/i.exec(tag)?.[1];
    if (rel?.toLowerCase().split(/\s+/).includes("stylesheet") && href) specs.push(href);
  }
  return specs;
}

function activeStylesheets(projectRoot, codeFiles, cssFiles) {
  const knownFiles = new Set(cssFiles.map(({ file }) => path.resolve(file)));
  const cssByPath = new Map(cssFiles.map(({ file, source }) => [path.resolve(file), { file, source }]));
  const edges = new Map();
  for (const { file, source } of cssFiles) {
    edges.set(path.resolve(file), cssImportSpecifiers(source)
      .map((specifier) => localStylesheetPath(projectRoot, file, specifier, knownFiles))
      .filter(Boolean)
      .map((target) => path.resolve(target)));
  }

  const roots = [];
  for (const { file, source } of codeFiles) {
    const ext = path.extname(file).toLowerCase();
    const specs = [
      ...([".html", ".htm"].includes(ext) ? [] : moduleReferences(source).filter((reference) => !reference.typeOnly).map((reference) => reference.specifier).filter((specifier) => specifier.startsWith(".") || path.isAbsolute(specifier))),
      ...([".html", ".htm"].includes(ext) ? htmlStylesheetImports(source) : []),
    ];
    for (const specifier of specs) {
      const target = localStylesheetPath(projectRoot, file, specifier, knownFiles);
      if (target) roots.push(path.resolve(target));
    }
  }

  const active = new Set();
  const pending = [...roots];
  while (pending.length) {
    const current = pending.pop();
    if (active.has(current) || !cssByPath.has(current)) continue;
    active.add(current);
    pending.push(...(edges.get(current) ?? []));
  }
  return { active, hasRoot: roots.length > 0 };
}

async function resolvesIntoDist(cssFile, sourceArg, packageRoot) {
  const wildcardAt = sourceArg.search(/[?*[{]/);
  const stablePart = wildcardAt >= 0 ? sourceArg.slice(0, wildcardAt) : sourceArg;
  const resolved = path.resolve(path.dirname(cssFile), stablePart.replace(/[\\/]+$/, ""));
  try {
    const [sourceReal, distReal] = await Promise.all([
      realpath(resolved),
      realpath(path.join(packageRoot, "dist")),
    ]);
    return sourceReal === distReal || sourceReal.startsWith(`${distReal}${path.sep}`);
  } catch {
    return false;
  }
}

function packageExportTarget(manifest, subpath) {
  const entry = manifest?.exports?.[subpath];
  if (typeof entry === "string") return entry;
  if (Array.isArray(entry)) return entry.map((item) => packageExportTarget({ exports: { [subpath]: item } }, subpath)).find(Boolean) ?? null;
  if (entry && typeof entry === "object") {
    for (const key of ["style", "browser", "import", "default", "require"]) {
      const target = entry[key];
      if (typeof target === "string") return target;
      if (target && typeof target === "object") {
        const nested = packageExportTarget({ exports: { [subpath]: target } }, subpath);
        if (nested) return nested;
      }
    }
  }
  return null;
}

async function publishedResource(installed, subpath) {
  if (!installed.root) return { status: "unknown", target: null, path: null };
  const target = packageExportTarget(installed.manifest, subpath);
  if (!target || !target.startsWith("./") || !target.toLowerCase().endsWith(".css")) {
    return { status: "missing", target, path: null };
  }
  try {
    const [targetReal, rootReal] = await Promise.all([
      realpath(path.resolve(installed.root, target)),
      realpath(installed.root),
    ]);
    if (targetReal !== rootReal && !targetReal.startsWith(`${rootReal}${path.sep}`)) {
      return { status: "missing", target, path: targetReal };
    }
    return { status: "ok", target, path: targetReal };
  } catch {
    return { status: "missing", target, path: null };
  }
}

async function doctor(cwd, options) {
  const project = await nearestPackage(cwd);
  if (!project) throw new Error(`No package.json found at or above ${cwd}`);
  const dependencies = allDependencies(project.manifest);
  const aliases = likelyAliases(dependencies, "@yuhuanowo/yunui");
  const installed = await findInstalledPackage(cwd, aliases, "@yuhuanowo/yunui");
  const files = await projectFiles(project.directory);
  const checks = [];
  const add = (id, status, message, details = {}) => checks.push({ id, status, message, ...details });

  if (installed.root) {
    add("package", "ok", `Resolved @yuhuanowo/yunui ${installed.manifest.version ?? "(version unknown)"}${installed.alias !== "@yuhuanowo/yunui" ? ` through alias "${installed.alias}"` : ""}.`, {
      path: path.relative(project.directory, installed.root) || ".",
      packageName: installed.manifest.name,
      alias: installed.alias,
    });
  } else if (/yarn@(?:[234]|[3-9])/.test(project.manifest.packageManager ?? "")) {
    add("package", "unknown", "Yarn Plug'n'Play may not expose node_modules paths to this read-only check.");
  } else if (aliases.some((alias) => Object.hasOwn(dependencies, alias))) {
    add("package", "warn", "YunUI is declared in the project manifest but its installed package could not be resolved.", {
      aliases: aliases.filter((alias) => Object.hasOwn(dependencies, alias)),
    });
  } else {
    add("package", "missing", "No installed @yuhuanowo/yunui package or npm alias was found.");
  }

  const baseCssResource = await publishedResource(installed, "./css");
  add("package-css-export", baseCssResource.status,
    baseCssResource.status === "ok"
      ? `The installed package exports ./css to ${baseCssResource.target}, inside its own package files.`
      : baseCssResource.status === "unknown"
        ? "Cannot verify the published ./css export until YunUI resolves from this project."
        : "The installed package does not expose an existing ./css file inside its own package root.",
    { target: baseCssResource.target, path: baseCssResource.path },
  );

  const aliasesPresent = aliases.filter((alias) => Object.hasOwn(dependencies, alias));
  // If installed under an npm alias, CSS and JS imports must resolve through
  // that alias. Accepting the scoped name would falsely pass when only the
  // alias path exists in node_modules.
  const importBases = installed.root
    ? [installed.alias]
    : [...new Set(["@yuhuanowo/yunui", ...aliasesPresent])];
  const contentUses = new Set();
  const packageUses = new Set();
  const codeFiles = [];
  const cssFiles = [];
  for (const file of files) {
    const source = await readFile(file, "utf8").catch(() => "");
    const ext = path.extname(file).toLowerCase();
    if ([".css", ".pcss", ".scss", ".sass", ".less"].includes(ext)) {
      cssFiles.push({ file, source });
    } else {
      const relativeParts = path.relative(project.directory, file).split(path.sep);
      if (relativeParts[0] === ".yunui" && relativeParts[1] === "recipes") continue;
      codeFiles.push({ file, source });
      const extension = path.extname(file).toLowerCase();
      if ([".html", ".htm"].includes(extension)) continue;
      for (const { specifier, typeOnly } of moduleReferences(source)) {
        if (typeOnly) continue;
        if (importBases.some((base) => specifier === base || specifier.startsWith(`${base}/`))) {
          packageUses.add(specifier);
          if (importBases.some((base) => specifier === `${base}/content`)) contentUses.add(specifier);
        }
      }
    }
  }

  const cssImports = new Set();
  const sourceDirectives = [];
  const tailwindImports = [];
  const activeCss = activeStylesheets(project.directory, codeFiles, cssFiles);
  for (const { file, source } of cssFiles) {
    if (!activeCss.active.has(path.resolve(file))) continue;
    const clean = source.replace(/\/\*[\s\S]*?\*\//g, "");
    for (const match of clean.matchAll(/@import\s+(?:url\()?\s*["']?([^"')\s;]+)["']?\s*\)?\s*;/g)) {
      if (importBases.some((base) => match[1] === `${base}/css` || match[1] === `${base}/content.css`)) cssImports.add(match[1]);
      if (match[1] === "tailwindcss") tailwindImports.push(file);
    }
    for (const sourceArg of cssSourceArguments(source)) sourceDirectives.push({ file, sourceArg });
  }
  for (const { source } of codeFiles) {
    for (const { specifier, typeOnly } of moduleReferences(source)) {
      if (typeOnly) continue;
      if (importBases.some((base) => specifier === `${base}/css` || specifier === `${base}/content.css`)) cssImports.add(specifier);
    }
  }

  const baseCssPresent = [...cssImports].some((item) => importBases.some((base) => item === `${base}/css`));
  if (baseCssPresent) add("styles", "ok", "Found an import of the YunUI design-system stylesheet.", { imports: [...cssImports].filter((item) => item.endsWith("/css")) });
  else if (!activeCss.hasRoot) add("styles", "unknown", "CSS files were found, but no stylesheet entry imported by app code or HTML could be identified for checking.", { expected: `${installed.alias ?? "@yuhuanowo/yunui"}/css` });
  else add("styles", "warn", "No resolvable YunUI design-system stylesheet import was found in active CSS or JS/TS files.", { expected: `${installed.alias ?? "@yuhuanowo/yunui"}/css` });

  if (contentUses.size) {
    const contentCssPresent = [...cssImports].some((item) => importBases.some((base) => item === `${base}/content.css`));
    const contentCssResource = await publishedResource(installed, "./content.css");
    add("content-styles", contentCssPresent ? "ok" : activeCss.hasRoot ? "warn" : "unknown",
      contentCssPresent
        ? "Content entry usage and content stylesheet import were both found."
        : activeCss.hasRoot
          ? "A YunUI content entry import was found; add the content stylesheet when using its rendered content styles."
          : "A content entry import was found, but no active application stylesheet could be identified to verify content styles.",
      {
        contentImports: [...contentUses],
        stylesheetImports: [...cssImports].filter((item) => item.endsWith("/content.css")),
        exportStatus: contentCssResource.status,
        exportTarget: contentCssResource.target,
      },
    );
    const katexCss = codeFiles.some(({ source }) => moduleReferences(source).some((reference) => !reference.typeOnly && reference.specifier === "katex/dist/katex.min.css")) ||
      cssFiles.some(({ source }) => /@import\s+["']katex\/dist\/katex\.min\.css["']/.test(source));
    add("katex-styles", katexCss ? "ok" : "note",
      katexCss ? "Found KaTeX stylesheet import." : "If using Markdown math, also import katex/dist/katex.min.css.");
  } else {
    add("content-styles", "note", "No content entry import detected; content.css is only needed for the content entry.");
  }

  const tailwindPresent = Boolean(dependencies.tailwindcss) || tailwindImports.length > 0;
  if (tailwindPresent && !activeCss.hasRoot) {
    add("tailwind-source", "unknown", "Tailwind was detected, but no stylesheet entry imported by app code or HTML could be identified for checking @source.");
  } else if (tailwindPresent && installed.root) {
    const matchingSources = [];
    for (const directive of sourceDirectives) {
      if (await resolvesIntoDist(directive.file, directive.sourceArg, installed.root)) matchingSources.push(directive);
    }
    if (matchingSources.length) {
      add("tailwind-source", "ok", "Found a Tailwind @source path that resolves inside the installed YunUI dist directory.", {
        paths: matchingSources.map(({ file, sourceArg }) => ({
          stylesheet: path.relative(project.directory, file), source: sourceArg,
        })),
      });
    } else {
      add("tailwind-source", "warn", "Tailwind is present, but no @source directive resolving into the installed YunUI dist directory was found. Adjust the path relative to the stylesheet that declares it.", {
        stylesheetCandidates: cssFiles.map(({ file }) => path.relative(project.directory, file)),
      });
    }
  } else if (tailwindPresent) {
    add("tailwind-source", "unknown", "Tailwind was detected, but its YunUI @source path cannot be checked until the package resolves.");
  } else {
    add("tailwind-source", "note", "Tailwind setup was not detected; this check only applies when using Tailwind CSS.");
  }

  const hasFontSetup = codeFiles.some(({ source }) =>
    /(?:Geist|JetBrains\s+Mono)/i.test(source) && /(?:@font-face|next\/font|fonts\.googleapis\.com)/i.test(source),
  ) || cssFiles.some(({ source }) =>
    /(?:Geist|JetBrains\s+Mono)/i.test(source) && /(?:@font-face|fonts\.googleapis\.com|@import\s+url)/i.test(source),
  );
  add("fonts", hasFontSetup ? "ok" : "note",
    hasFontSetup
      ? "Found consumer font setup for a YunUI font family."
      : "YunUI does not bundle Geist or JetBrains Mono; load them in the app if you use those font tokens.");

  const usesFrameworkEntries = [...packageUses].some((specifier) =>
    importBases.some((base) => specifier === `${base}/patterns` || specifier === `${base}/ai`),
  );
  const hasProvider = codeFiles.some(({ source }) => /\bYunUIProvider\b/.test(source));
  if (usesFrameworkEntries) {
    add("adapters", hasProvider ? "ok" : "note",
      hasProvider
        ? "Found YunUIProvider usage alongside patterns/AI entry imports."
        : "Patterns/AI imports were found without a YunUIProvider identifier. Defaults are available; inject Link, Image, routing, or translations only where the app needs them.");
  } else {
    add("adapters", "note", "No patterns/AI entry import detected; YunUI adapters may be unnecessary for this project.");
  }

  const contentCssResource = await publishedResource(installed, "./content.css");
  if (!contentUses.size) {
    add("package-content-css-export", contentCssResource.status === "unknown" ? "unknown" : "note",
      contentCssResource.status === "unknown"
        ? "Cannot verify the optional ./content.css export until YunUI resolves from this project."
        : "The optional ./content.css export is only needed by projects using the content entry.",
      { target: contentCssResource.target, path: contentCssResource.path },
    );
  } else {
    add("package-content-css-export", contentCssResource.status,
      contentCssResource.status === "ok"
        ? `The installed package exports ./content.css to ${contentCssResource.target}, inside its own package files.`
        : contentCssResource.status === "unknown"
          ? "Cannot verify the ./content.css export until YunUI resolves from this project."
          : "The installed package does not expose an existing ./content.css file inside its own package root.",
      { target: contentCssResource.target, path: contentCssResource.path },
    );
  }

  const result = {
    cwd: project.directory,
    manifest: path.relative(project.directory, project.manifestPath),
    package: installed.root ? { name: installed.manifest.name, version: installed.manifest.version ?? null, path: installed.root } : null,
    scannedFiles: files.length,
    checks,
  };
  const strictRequiredIds = ["package", "package-css-export", "styles"];
  if (tailwindPresent) strictRequiredIds.push("tailwind-source");
  if (contentUses.size) strictRequiredIds.push("content-styles", "package-content-css-export");
  const strictFailures = checks
    .filter((check) => strictRequiredIds.includes(check.id) && check.status !== "ok")
    .map((check) => check.id);
  result.strict = options.strict
    ? { enabled: true, ok: strictFailures.length === 0, failures: strictFailures }
    : { enabled: false };
  if (options.json) writeJson(result);
  else {
    process.stdout.write(`YunUI setup check — ${project.directory}\n`);
    for (const check of checks) {
      process.stdout.write(`[${check.status.toUpperCase()}] ${check.message}\n`);
      if (check.paths) for (const item of check.paths) process.stdout.write(`  ${item.stylesheet}: @source ${item.source}\n`);
    }
    if (options.strict) {
      process.stdout.write(strictFailures.length
        ? `Strict setup gate failed: ${strictFailures.join(", ")}\n`
        : "Strict setup gate passed.\n");
    }
    process.stdout.write(`Scanned ${files.length} source/style files. This check is read-only; review any “note” against the features you use.\n`);
  }
  if (checks.some((check) => check.id === "package" && check.status === "missing") || (options.strict && strictFailures.length)) process.exitCode = 1;
}

async function runInit(options) {
  if (!["both", "codex", "claude"].includes(options.agent)) {
    throw new Error("--agent must be one of: both, codex, claude");
  }
  try {
    const { runInit: initialize } = await import("./yunui-init.mjs");
    const result = await initialize({ cwd: options.cwd, agent: options.agent, css: options.css });
    if (options.json) writeJson(result);
    else {
      process.stdout.write(`Initialized YunUI guidance in ${result.project}\nModule binding: ${result.module}\n`);
      for (const file of result.files) process.stdout.write(`  ${file}\n`);
      for (const next of result.next) process.stdout.write(`Next: ${next}\n`);
    }
    return result;
  } catch (error) {
    if (error?.code === "ERR_MODULE_NOT_FOUND" && error.message.includes("yunui-init.mjs")) {
      throw new Error("The optional init helper is not installed in this package yet. Use `yunui doctor` for read-only setup checks.");
    }
    throw error;
  }
}

async function main() {
  const [command = "help", ...rest] = process.argv.slice(2);
  const { positional, options } = parseArgs(rest);
  if (options.help || command === "help" || command === "--help") {
    process.stdout.write(usage);
    return;
  }

  validateCommandOptions(command, options);
  if (["doctor", "audit", "init", "list"].includes(command) && positional.length) {
    throw new Error(`${command} does not accept positional arguments`);
  }

  if (command === "init") {
    await runInit(options);
    return;
  }

  const catalog = await readCatalog();
  if (command === "list") return renderList(catalog, options);
  if (command === "find") return renderFind(catalog, positional.join(" "), options);
  if (command === "info") return renderInfo(catalog, positional.join(" "), options);
  if (command === "doctor") return doctor(options.cwd, options);
  if (command === "audit") {
    const { runAudit } = await import("./yunui-audit.mjs");
    const report = await runAudit({ cwd: options.cwd, strict: options.strict, json: options.json });
    if (options.strict && !report.strict.ok) process.exitCode = 1;
    return;
  }
  throw new Error(`Unknown command: ${command}\n\n${usage}`);
}

main().catch((error) => {
  process.stderr.write(`${error.message ?? error}\n`);
  process.exitCode = 2;
});
