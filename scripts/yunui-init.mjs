import { readFile, writeFile, mkdir, lstat, realpath } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const libraryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageName = "@yuhuanowo/yunui";
const start = "<!-- yunui:managed:start -->";
const end = "<!-- yunui:managed:end -->";
const hash = text => createHash("sha256").update(text).digest("hex");
const posix = value => value.split(path.sep).join("/");

async function optionalRead(file) {
  try { return await readFile(file, "utf8"); }
  catch (error) { if (error.code === "ENOENT") return null; throw error; }
}

function mergeGuide(existing, block) {
  const begins = existing.split(start).length - 1;
  const ends = existing.split(end).length - 1;
  if (begins !== ends || begins > 1) throw new Error("Ambiguous YunUI instruction markers; repair the existing file before initializing.");
  if (!begins) return existing.trimEnd() + (existing.trim() ? "\n\n" : "") + block + "\n";
  const from = existing.indexOf(start);
  const to = existing.indexOf(end, from) + end.length;
  if (to < from) throw new Error("Invalid YunUI instruction marker order.");
  return existing.slice(0, from) + block + existing.slice(to);
}

async function assertOwnedPath(root, relative) {
  const destination = path.resolve(root, relative);
  if (!destination.startsWith(root + path.sep)) throw new Error(`Destination leaves project: ${relative}`);
  let current = root;
  for (const part of path.relative(root, destination).split(path.sep)) {
    current = path.join(current, part);
    try {
      if ((await lstat(current)).isSymbolicLink()) throw new Error(`Refusing to write through a symlink: ${current}`);
    } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  return destination;
}

async function resolveModule(root, manifest) {
  const dependencies = { ...manifest.dependencies, ...manifest.devDependencies, ...manifest.peerDependencies, ...manifest.optionalDependencies };
  const candidates = [packageName, ...Object.entries(dependencies).filter(([, spec]) => typeof spec === "string" &&
    (spec.includes(packageName) || /yuhuanstudio\/yunui/i.test(spec) || /^(file|link|workspace):/.test(spec))).map(([name]) => name)];
  let directory = root;
  while (true) {
    for (const name of new Set(candidates)) {
      const moduleRoot = path.join(directory, "node_modules", name);
      const raw = await optionalRead(path.join(moduleRoot, "package.json"));
      if (raw) {
        const pkg = JSON.parse(raw);
        if (pkg.name === packageName) return { name, moduleRoot, version: pkg.version, installed: true };
      }
    }
    const parent = path.dirname(directory);
    if (parent === directory) break;
    directory = parent;
  }
  const declared = candidates.find(name => Object.hasOwn(dependencies, name)) ?? packageName;
  return { name: declared, moduleRoot: path.join(root, "node_modules", declared), version: null, installed: false };
}

/** Opt-in project integration. No network installs or global configuration edits. */
export async function runInit({ cwd = process.cwd(), agent = "both", css } = {}) {
  if (!["both", "codex", "claude"].includes(agent)) throw new Error("--agent must be both, codex or claude");
  const root = await realpath(path.resolve(cwd));
  const raw = await optionalRead(path.join(root, "package.json"));
  if (!raw) throw new Error("Run init at an existing React project's package.json directory.");
  const manifest = JSON.parse(raw);
  if (manifest.name === packageName) throw new Error("init is for consumer projects; the YunUI library uses its own AGENTS.md.");
  const module = await resolveModule(root, manifest);
  await assertOwnedPath(root, ".yunui/install-state.json");
  const previous = JSON.parse(await optionalRead(path.join(root, ".yunui/install-state.json")) ?? '{"files":{}}');
  const planned = new Map();
  const skill = (await readFile(path.join(libraryRoot, "agent/skills/yunui/SKILL.md"), "utf8")).replaceAll(packageName, module.name);
  const selected = agent === "both" ? ["codex", "claude"] : [agent];
  for (const target of selected) {
    const skillPath = `${target === "codex" ? ".agents" : ".claude"}/skills/yunui/SKILL.md`;
    planned.set(skillPath, { content: skill, owned: true });
    const override = target === "codex" ? await optionalRead(path.join(root, "AGENTS.override.md")) : null;
    const instructionFile = target === "codex" ? (override?.trim() ? "AGENTS.override.md" : "AGENTS.md") : "CLAUDE.md";
    const block = `${start}\n## Use YunUI\n\nFor requests to build with YunUI, read \`${skillPath}\` before writing UI.\nImport and compose the installed components; use the catalogue and packaged\nrecipes identified in \`.yunui/context.json\`. Run \`yunui doctor --strict\`\nand repair setup failures instead of approximating the design with new controls.\nUser instructions and this project's existing constraints take precedence.\n${end}`;
    planned.set(instructionFile, { content: mergeGuide(await optionalRead(path.join(root, instructionFile)) ?? "", block), owned: false });
  }
  const setupPath = ".yunui/setup.css";
  const dist = posix(path.relative(path.join(root, ".yunui"), path.join(module.moduleRoot, "dist")));
  planned.set(setupPath, { content: `/* YunUI component scanning is relative to this file, including npm aliases. */\n@import "${module.name}/css";\n@source "${dist}";\n`, owned: true });
  const context = {
    package: packageName, module: module.name, lastInitializedWithVersion: module.version,
    libraryRoot: posix(path.relative(root, module.moduleRoot)),
    catalogue: posix(path.relative(root, path.join(module.moduleRoot, "agent/catalog.generated.json"))),
    recipes: posix(path.relative(root, path.join(module.moduleRoot, "agent/recipes"))),
    setupStylesheet: setupPath,
  };
  planned.set(".yunui/context.json", { content: JSON.stringify(context, null, 2) + "\n", owned: true });
  if (css) {
    const relative = posix(path.relative(root, path.resolve(root, css)));
    const destination = await assertOwnedPath(root, relative);
    const existing = await optionalRead(destination);
    if (existing === null) throw new Error(`Stylesheet does not exist: ${relative}`);
    const begins = existing.split("/* yunui:styles:start */").length - 1;
    const ends = existing.split("/* yunui:styles:end */").length - 1;
    if (begins !== ends || begins > 1) throw new Error(`Ambiguous managed stylesheet markers in ${relative}`);
    const clean = existing.replace(/\r?\n?\/\* yunui:styles:start \*\/[\s\S]*?\/\* yunui:styles:end \*\/\r?\n?/g, "");
    const masked = clean.replace(/\/\*[\s\S]*?\*\//g, comment => " ".repeat(comment.length));
    const tailwind = /@import\s+(?:url\(\s*)?["']tailwindcss["']\s*\)?(?:\s+[^;]+)?;/.exec(masked);
    if (!tailwind) throw new Error(`Import tailwindcss in ${relative} first, then run init with --css again.`);
    let importPath = posix(path.relative(path.dirname(destination), path.join(root, setupPath)));
    if (!importPath.startsWith(".")) importPath = "./" + importPath;
    const insertion = `\n/* yunui:styles:start */\n@import "${importPath}";\n/* yunui:styles:end */\n`;
    const at = tailwind.index + tailwind[0].length;
    planned.set(relative, { content: clean.slice(0, at) + insertion + clean.slice(at), owned: false });
  }
  // Preflight every destination before making any changes. Preserve manual assets.
  for (const [relative, record] of planned) {
    const destination = await assertOwnedPath(root, relative);
    const existing = await optionalRead(destination);
    if (record.owned && existing !== null && existing !== record.content && hash(existing) !== previous.files?.[relative]) {
      throw new Error(`Preserving edited file ${relative}; move it aside or reconcile it before reinitializing.`);
    }
  }
  const state = { files: { ...previous.files } };
  for (const [relative, record] of planned) {
    const destination = path.join(root, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, record.content);
    if (record.owned) state.files[relative] = hash(record.content);
  }
  await writeFile(path.join(root, ".yunui/install-state.json"), JSON.stringify(state, null, 2) + "\n");
  return {
    project: root, module: module.name, installed: module.installed,
    files: [...planned.keys()], cssIntegrated: css ?? null,
    next: module.installed
      ? [css ? "Run yunui doctor --strict." : "Import .yunui/setup.css after tailwindcss in your global CSS, or rerun init with --css <file>."]
      : [`Install ${packageName} in this project before running yunui doctor --strict.`],
  };
}
