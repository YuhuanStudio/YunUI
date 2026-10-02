import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const scriptRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(scriptRoot, "agent/catalog.generated.json");
const excludedDirectories = new Set([
  ".git", ".next", ".turbo", ".yarn", "node_modules", "dist", "build", "coverage",
  "reference", "references", "vendor", "generated", "__tests__", "tests", "test",
]);
const sourceExtensions = new Set([".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"]);

async function nearestPackage(cwd) {
  let directory = path.resolve(cwd);
  while (true) {
    try {
      const filename = path.join(directory, "package.json");
      return { root: directory, manifest: JSON.parse(await readFile(filename, "utf8")), filename };
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
    const parent = path.dirname(directory);
    if (parent === directory) return null;
    directory = parent;
  }
}

function dependenciesOf(manifest) {
  return Object.assign({}, manifest.dependencies, manifest.devDependencies, manifest.peerDependencies, manifest.optionalDependencies);
}

function packageBases(manifest, packageName) {
  const bases = new Set([packageName]);
  for (const [name, spec] of Object.entries(dependenciesOf(manifest))) {
    if (typeof spec === "string" && (
      name === packageName || spec.startsWith(`npm:${packageName}`) ||
      spec.startsWith("workspace:") || spec.startsWith("file:") || spec.startsWith("link:") ||
      spec.startsWith("github:") || spec.startsWith("git+") || spec.startsWith("git:") ||
      /^https?:\/\//.test(spec)
    )) bases.add(name);
  }
  return [...bases];
}

function packageEntry(specifier, bases, catalog) {
  for (const base of bases) {
    if (specifier === base) return catalog.generatedFrom.some((entry) => entry.entry === ".") ? "." : null;
    if (!specifier.startsWith(`${base}/`)) continue;
    const suffix = `./${specifier.slice(base.length + 1)}`;
    if (catalog.generatedFrom.some((entry) => entry.entry === suffix)) return suffix;
  }
  return null;
}

async function collectSources(root) {
  const files = [];
  async function visit(directory) {
    let entries;
    try { entries = await readdir(directory, { withFileTypes: true }); }
    catch { return; }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (excludedDirectories.has(entry.name)) continue;
        const relativeDirectory = path.relative(root, path.join(directory, entry.name)).split(path.sep).join("/");
        if ([".yunui/recipes", "agent/recipes"].includes(relativeDirectory) || relativeDirectory.startsWith(".yunui/recipes/") || relativeDirectory.startsWith("agent/recipes/")) continue;
        await visit(path.join(directory, entry.name));
        continue;
      }
      if (!entry.isFile() || !sourceExtensions.has(path.extname(entry.name).toLowerCase())) continue;
      const filename = path.join(directory, entry.name);
      const relative = path.relative(root, filename).split(path.sep).join("/");
      if (relative.startsWith(".yunui/recipes/") || relative.startsWith("agent/recipes/")) continue;
      if (/(^|[._-])(test|spec|stories)([._-]|$)/i.test(entry.name)) continue;
      if (/\.generated\.[cm]?[jt]sx?$/i.test(entry.name) || /\.recipe\.[cm]?[jt]sx?$/i.test(entry.name)) continue;
      files.push(filename);
    }
  }
  await visit(root);
  return files.sort();
}

function scriptKind(ts, filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".tsx") return ts.ScriptKind.TSX;
  if (ext === ".jsx") return ts.ScriptKind.JSX;
  if ([".ts", ".mts", ".cts"].includes(ext)) return ts.ScriptKind.TS;
  return ts.ScriptKind.JS;
}

function getLine(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

function attributeString(ts, opening, name, sourceFile) {
  for (const property of opening.attributes.properties) {
    if (!ts.isJsxAttribute(property) || property.name.getText(sourceFile) !== name) continue;
    if (property.initializer && ts.isStringLiteral(property.initializer)) return property.initializer.text;
    if (property.initializer && ts.isJsxExpression(property.initializer) && property.initializer.expression && ts.isStringLiteral(property.initializer.expression)) {
      return property.initializer.expression.text;
    }
  }
  return null;
}

function isHiddenInput(ts, opening, sourceFile) {
  return (attributeString(ts, opening, "type", sourceFile) ?? "").toLowerCase() === "hidden";
}

function jsxTagName(ts, tagName, sourceFile) {
  if (ts.isIdentifier(tagName)) return tagName.text;
  if (ts.isPropertyAccessExpression(tagName)) return tagName.name.text;
  return tagName.getText(sourceFile);
}

function findPackageExport(catalog, entry, name) {
  return catalog.exports.find((item) => item.entry === entry && item.name === name) ?? null;
}

function posix(value) {
  return value.split(path.sep).join("/");
}

function declarationCandidates(catalog, names) {
  const wanted = new Set(names);
  return catalog.exports
    .filter((item) => item.kind === "component" && wanted.has(item.name))
    .map((item) => ({ name: item.name, entry: item.entry, import: item.import, description: item.description }));
}

function rawControlKind(ts, opening, sourceFile) {
  const tag = jsxTagName(ts, opening.tagName, sourceFile);
  if (tag === "input" && isHiddenInput(ts, opening, sourceFile)) return null;
  const candidates = {
    button: ["Button", "IconButton"],
    input: ["Input", "NumberInput", "SearchInput", "PasswordInput", "Checkbox", "RadioGroup", "Slider", "FileDropzone", "AvatarUploader"],
    select: ["Select", "CustomSelect", "SegmentedSelect", "Combobox"],
    textarea: ["Textarea"],
    table: ["Table", "TableHeader", "TableBody", "TableFooter", "TableHead", "TableRow", "TableCell", "TableCaption"],
  };
  if (!Object.hasOwn(candidates, tag)) return null;
  const lower = tag;
  if (lower === "input") {
    const type = (attributeString(ts, opening, "type", sourceFile) ?? "").toLowerCase();
    if (type === "checkbox") return { tag, candidates: ["Checkbox", "Switch"] };
    if (type === "radio") return { tag, candidates: ["RadioGroup", "RadioGroupItem"] };
    if (type === "range") return { tag, candidates: ["Slider"] };
    if (type === "file") return { tag, candidates: ["FileDropzone", "AvatarUploader"] };
  }
  return { tag, candidates: candidates[lower] };
}

function containsRawControl(ts, node, sourceFile) {
  let found = false;
  function visit(current) {
    if (found) return;
    if ((ts.isJsxOpeningElement(current) || ts.isJsxSelfClosingElement(current)) && rawControlKind(ts, current, sourceFile)) {
      found = true;
      return;
    }
    ts.forEachChild(current, visit);
  }
  visit(node);
  return found;
}

function functionLikeInitializer(ts, node) {
  if (!node) return false;
  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return true;
  if (ts.isCallExpression(node)) return node.arguments.some((argument) => functionLikeInitializer(ts, argument));
  return false;
}

function stringChildren(ts, node) {
  const values = [];
  function visit(current) {
    if (ts.isJsxText(current)) {
      const value = current.getText().trim();
      if (value) values.push(value);
      return;
    }
    if (ts.isJsxExpression(current) && current.expression && ts.isStringLiteral(current.expression)) {
      values.push(current.expression.text);
      return;
    }
    ts.forEachChild(current, visit);
  }
  visit(node);
  return values.join(" ");
}

function directStringChildren(ts, jsxElement) {
  return jsxElement.children.map((child) => {
    if (ts.isJsxText(child)) return child.getText().trim();
    if (ts.isJsxExpression(child) && child.expression && ts.isStringLiteral(child.expression)) return child.expression.text;
    return "";
  }).filter(Boolean).join(" ");
}

function staticAttributes(ts, opening, sourceFile) {
  const values = {};
  for (const property of opening.attributes.properties) {
    if (!ts.isJsxAttribute(property)) continue;
    const value = attributeString(ts, opening, property.name.getText(sourceFile), sourceFile);
    if (value !== null) values[property.name.getText(sourceFile)] = value;
  }
  return values;
}

function loadTypeScript(root) {
  const require = createRequire(path.join(root, "package.json"));
  try {
    return require("typescript");
  } catch (error) {
    if (error?.code === "MODULE_NOT_FOUND" || error?.code === "ERR_PACKAGE_PATH_NOT_EXPORTED") return null;
    throw error;
  }
}

function makeModuleResolver(ts, root, sourceMap) {
  let options = {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler ?? ts.ModuleResolutionKind.NodeNext,
    jsx: ts.JsxEmit.ReactJSX,
    allowJs: true,
    baseUrl: root,
  };
  const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");
  if (configPath) {
    const config = ts.readConfigFile(configPath, ts.sys.readFile);
    if (!config.error) options = { ...options, ...ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configPath)).options };
  }
  return (fromFile, specifier) => {
    const resolved = ts.resolveModuleName(specifier, fromFile, options, ts.sys).resolvedModule?.resolvedFileName;
    if (resolved && sourceMap.has(path.resolve(resolved))) return path.resolve(resolved);
    const base = path.resolve(path.dirname(fromFile), specifier);
    const candidates = [base, ...[".tsx", ".ts", ".jsx", ".js", ".mts", ".cts", ".mjs", ".cjs", ".d.ts"].map((extension) => `${base}${extension}`), ...["index.tsx", "index.ts", "index.jsx", "index.js"].map((name) => path.join(base, name))];
    return candidates.find((candidate) => sourceMap.has(path.resolve(candidate))) ?? null;
  };
}

function createExportResolver(ts, catalog, bases, sourceMap, moduleResolver) {
  const cache = new Map();

  function resolvePackageBinding(specifier, importedName) {
    const entry = packageEntry(specifier, bases, catalog);
    if (entry === null) return null;
    if (importedName === "*") return { namespaceEntry: entry };
    const item = findPackageExport(catalog, entry, importedName);
    return item ? { entry, name: item.name, item } : null;
  }

  function resolveImport(file, localName, visiting = new Set()) {
    const sourceFile = sourceMap.get(path.resolve(file));
    if (!sourceFile) return null;
    const visitKey = `${path.resolve(file)}::import::${localName}`;
    if (visiting.has(visitKey)) return null;
    visiting.add(visitKey);
    for (const statement of sourceFile.statements) {
      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
      const specifier = statement.moduleSpecifier.text;
      const clause = statement.importClause;
      if (!clause) continue;
      const bindings = clause.namedBindings;
      if (!bindings) continue;
      if (ts.isNamespaceImport(bindings) && bindings.name.text === localName) {
        const direct = resolvePackageBinding(specifier, "*");
        if (direct) return { ...direct, typeOnly: Boolean(clause.isTypeOnly) };
        return (() => {
          const resolvedFile = moduleResolver(file, specifier);
          return resolvedFile ? { namespaceFile: resolvedFile, typeOnly: Boolean(clause.isTypeOnly) } : null;
        })();
      }
      if (ts.isNamedImports(bindings)) {
        for (const element of bindings.elements) {
          if (element.name.text !== localName) continue;
          const imported = (element.propertyName ?? element.name).text;
          return resolvePackageBinding(specifier, imported) ?? (() => {
            const resolvedFile = moduleResolver(file, specifier);
            return resolvedFile ? resolveExport(resolvedFile, imported, visiting) : null;
          })();
        }
      }
    }
    return null;
  }

  function resolveExport(file, exportedName, visiting = new Set()) {
    const key = `${path.resolve(file)}::export::${exportedName}`;
    if (cache.has(key)) return cache.get(key);
    if (visiting.has(key)) return null;
    visiting.add(key);
    const sourceFile = sourceMap.get(path.resolve(file));
    if (!sourceFile) return null;

    for (const statement of sourceFile.statements) {
      if (!ts.isExportDeclaration(statement)) continue;
      const specifier = statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)
        ? statement.moduleSpecifier.text
        : null;
      const clause = statement.exportClause;
      if (clause && ts.isNamespaceExport(clause) && clause.name.text === exportedName && specifier) {
        const direct = resolvePackageBinding(specifier, "*");
        if (direct) { cache.set(key, direct); return direct; }
        const target = moduleResolver(file, specifier);
        if (target) { const result = { namespaceFile: target }; cache.set(key, result); return result; }
      }
      if (clause && ts.isNamedExports(clause)) {
        for (const element of clause.elements) {
          if (element.name.text !== exportedName) continue;
          const imported = (element.propertyName ?? element.name).text;
          let result = null;
          if (specifier) {
            result = resolvePackageBinding(specifier, imported);
            if (!result) {
              const target = moduleResolver(file, specifier);
              if (target) result = resolveExport(target, imported, visiting);
            }
          } else {
            result = resolveImport(file, imported, visiting);
            if (!result) result = resolveExport(file, imported, visiting);
          }
          if (result) { cache.set(key, result); return result; }
        }
      } else if (!clause && specifier) {
        const direct = resolvePackageBinding(specifier, exportedName);
        if (direct) { cache.set(key, direct); return direct; }
        const target = moduleResolver(file, specifier);
        if (target) {
          const result = resolveExport(target, exportedName, visiting);
          if (result) { cache.set(key, result); return result; }
        }
      }
    }
    const local = resolveImport(file, exportedName, visiting);
    if (local) { cache.set(key, local); return local; }
    cache.set(key, null);
    return null;
  }

  function resolveBinding(file, localName) {
    return resolveImport(file, localName) ?? resolveExport(file, localName);
  }

  function resolveJsx(file, tagName, sourceFile) {
    if (ts.isIdentifier(tagName)) {
      const result = resolveBinding(file, tagName.text);
      return result?.item?.kind === "component" ? result : null;
    }
    if (ts.isPropertyAccessExpression(tagName) && ts.isIdentifier(tagName.expression)) {
      const namespace = resolveBinding(file, tagName.expression.text);
      if (namespace?.namespaceEntry && !namespace.typeOnly) {
        const item = findPackageExport(catalog, namespace.namespaceEntry, tagName.name.text);
        return item?.kind === "component" ? { entry: item.entry, name: item.name, item } : null;
      }
      if (namespace?.namespaceFile) {
        const result = resolveExport(namespace.namespaceFile, tagName.name.text);
        return result?.item?.kind === "component" ? result : null;
      }
    }
    return null;
  }

  return { resolveBinding, resolveExport, resolveJsx, resolvePackageBinding };
}

function lineInfo(sourceFile, node, root) {
  return {
    file: posix(path.relative(root, sourceFile.fileName)),
    line: getLine(sourceFile, node),
  };
}

export async function runAudit({ cwd = process.cwd(), strict = false, json = false } = {}) {
  const project = await nearestPackage(cwd);
  if (!project) throw new Error(`No package.json found at or above ${cwd}`);
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  const files = await collectSources(project.root);
  const resultBase = {
    cwd: project.root,
    filesScanned: files.length,
    imports: [],
    usedExports: [],
    definiteIssues: [],
    candidates: [],
    unknown: [],
    reviewPolicy: {
      candidatesAreHeuristicAndNonBlocking: true,
      note: "A candidate is not proof of copied design. Review it against available exports and this project's actual design-review requirements.",
    },
    strict: { enabled: Boolean(strict), ok: null, failures: [] },
  };

  let ts;
  try { ts = loadTypeScript(project.root); }
  catch (error) {
    resultBase.unknown.push({ code: "typescript-load-failed", message: error.message });
  }
  if (!ts) {
    resultBase.status = "unknown";
    resultBase.unknown.push({
      code: "typescript-unavailable",
      message: "TypeScript is not resolvable from this consumer project, so JSX/API references could not be audited. Install it as a project dev dependency to enable AST auditing.",
    });
    resultBase.strict = strict
      ? { enabled: true, ok: false, failures: ["typescript-unavailable"] }
      : { enabled: false };
    if (json) process.stdout.write(`${JSON.stringify(resultBase, null, 2)}\n`);
    else {
      process.stdout.write(`YunUI adoption audit — ${project.root}\n`);
      process.stdout.write(`[UNKNOWN] ${resultBase.unknown[0].message}\n`);
      if (strict) process.stdout.write("Strict audit failed because the TypeScript AST parser is unavailable.\n");
    }
    return resultBase;
  }

  const sourceMap = new Map();
  for (const filename of files) {
    const text = await readFile(filename, "utf8").catch(() => "");
    const sourceFile = ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true, scriptKind(ts, filename));
    sourceMap.set(path.resolve(filename), sourceFile);
    for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
      const start = diagnostic.start ?? 0;
      const pos = sourceFile.getLineAndCharacterOfPosition(start);
      resultBase.unknown.push({
        code: "typescript-parse-error",
        file: posix(path.relative(project.root, filename)),
        line: pos.line + 1,
        message: ts.flattenDiagnosticMessageText(diagnostic.messageText, " "),
      });
    }
  }

  const bases = packageBases(project.manifest, catalog.package);
  const moduleResolver = makeModuleResolver(ts, project.root, sourceMap);
  const resolver = createExportResolver(ts, catalog, bases, sourceMap, moduleResolver);
  const importKeys = new Set();
  const usedMap = new Map();
  const publicComponents = new Set(catalog.exports.filter((item) => item.kind === "component").map((item) => item.name));
  const candidateCache = new Map();

  function candidateList(names) {
    const key = names.join("|");
    if (!candidateCache.has(key)) candidateCache.set(key, declarationCandidates(catalog, names));
    return candidateCache.get(key);
  }

  for (const [filename, sourceFile] of sourceMap) {
    function visit(node) {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const clause = node.importClause;
        if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
          for (const element of clause.namedBindings.elements) {
            const resolved = resolver.resolveBinding(filename, element.name.text);
            if (!resolved?.item) continue;
            const record = {
              action: "import",
              entry: resolved.item.entry,
              name: resolved.item.name,
              local: element.name.text,
              module: node.moduleSpecifier.text,
              typeOnly: Boolean(clause.isTypeOnly || element.isTypeOnly || resolved.item.typeOnly),
              ...lineInfo(sourceFile, element, project.root),
            };
            const key = `${record.file}:${record.line}:${record.entry}:${record.name}:${record.local}`;
            if (!importKeys.has(key)) { importKeys.add(key); resultBase.imports.push(record); }
          }
        } else if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
          const resolved = resolver.resolveBinding(filename, clause.namedBindings.name.text);
          if (resolved?.namespaceEntry) {
            resultBase.imports.push({
              action: "namespace-import",
              entry: resolved.namespaceEntry,
              name: "*",
              local: clause.namedBindings.name.text,
              module: node.moduleSpecifier.text,
              typeOnly: Boolean(clause.isTypeOnly),
              ...lineInfo(sourceFile, clause.namedBindings, project.root),
            });
          }
        }
      }

      if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        const entry = packageEntry(node.moduleSpecifier.text, bases, catalog);
        if (entry !== null) {
          if (node.exportClause && ts.isNamedExports(node.exportClause)) {
            for (const element of node.exportClause.elements) {
              const importedName = (element.propertyName ?? element.name).text;
              const item = catalog.exports.find((value) => value.entry === entry && value.name === importedName);
              if (item) resultBase.imports.push({
                action: "re-export",
                entry,
                name: importedName,
                exportedAs: element.name.text,
                module: node.moduleSpecifier.text,
                typeOnly: Boolean(node.isTypeOnly || element.isTypeOnly || item.typeOnly),
                ...lineInfo(sourceFile, element, project.root),
              });
            }
          } else if (!node.exportClause) {
            resultBase.imports.push({ action: "star-re-export", entry, name: "*", module: node.moduleSpecifier.text, ...lineInfo(sourceFile, node, project.root) });
          } else if (ts.isNamespaceExport(node.exportClause)) {
            resultBase.imports.push({ action: "namespace-re-export", entry, name: "*", exportedAs: node.exportClause.name.text, module: node.moduleSpecifier.text, ...lineInfo(sourceFile, node, project.root) });
          }
        }
      }

      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = jsxTagName(ts, node.tagName, sourceFile);
        const imported = resolver.resolveJsx(filename, node.tagName, sourceFile);
        if (imported?.item) {
          const key = `${imported.item.entry}/${imported.item.name}`;
          if (!usedMap.has(key)) usedMap.set(key, { entry: imported.item.entry, name: imported.item.name, kind: imported.item.kind, import: imported.item.import, source: imported.item.source, uses: [] });
          usedMap.get(key).uses.push({ ...lineInfo(sourceFile, node, project.root), local: tag });
        }

        const raw = rawControlKind(ts, node, sourceFile);
        if (raw) {
          resultBase.definiteIssues.push({
            code: "raw-library-control",
            severity: "error",
            message: `Raw <${raw.tag}> UI control; review the listed YunUI exports and compose their props/slots.`,
            candidates: candidateList(raw.candidates),
            ...lineInfo(sourceFile, node, project.root),
          });
        }

        const attrs = staticAttributes(ts, node, sourceFile);
        const childText = ts.isJsxOpeningElement(node) ? stringChildren(ts, node.parent) : "";
        const label = attrs["aria-label"] ?? "";
        const className = attrs.className ?? "";
        const isAvatarCandidate = /avatar|profile[- ]?(?:image|picture|photo)/i.test(label) ||
          /\b(?:avatar|profile-avatar)\b/i.test(className) ||
          (tag === "div" && /\brounded-full\b/.test(className) && /^[A-Z0-9]{1,3}$/.test(childText.trim()));
        if (isAvatarCandidate) {
          resultBase.candidates.push({
            category: "avatar-like-markup",
            reviewRequired: true,
            message: "This markup resembles a profile/avatar treatment. Consider YunUI's Avatar exports; this is a review candidate, not a ban on branded logos or custom product details.",
            candidates: candidateList(["Avatar", "AvatarFallback", "AvatarImage", "AvatarGroup"]),
            ...lineInfo(sourceFile, node, project.root),
          });
        }
      }

      if (ts.isJsxElement(node)) {
        const text = directStringChildren(ts, node);
        const phrase = /\b(?:no\s+(?:items?|results?|data|messages?|files?|records?|notifications?|sessions?|entries?|matches?)(?:\s+(?:yet|found|available))?|nothing\s+(?:here|to\s+show|found)|empty\s+state|start\s+by\s+adding)\b/i.test(text);
        if (phrase) {
          const line = lineInfo(sourceFile, node.openingElement, project.root).line;
          const duplicate = resultBase.candidates.some((item) => item.category === "handbuilt-empty-state" && item.file === posix(path.relative(project.root, filename)) && item.line === line);
          if (!duplicate) resultBase.candidates.push({
            category: "handbuilt-empty-state",
            reviewRequired: true,
            message: "This branch contains empty-state copy. Review YunUI's EmptyState/PageEmptyState/FeatureLockedState exports before building a custom state block.",
            candidates: candidateList(["EmptyState", "PageEmptyState", "FeatureLockedState"]),
            ...lineInfo(sourceFile, node.openingElement, project.root),
          });
        }
      }

      ts.forEachChild(node, visit);
    }
    visit(sourceFile);

    for (const statement of sourceFile.statements) {
      let name = null;
      let body = null;
      if (ts.isFunctionDeclaration(statement) && statement.name) {
        name = statement.name.text;
        body = statement.body;
      } else if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (!ts.isIdentifier(declaration.name) || !functionLikeInitializer(ts, declaration.initializer)) continue;
          if (!publicComponents.has(declaration.name.text) || !declaration.initializer) continue;
          if (containsRawControl(ts, declaration.initializer, sourceFile)) {
            resultBase.definiteIssues.push({
              code: "shadowed-library-widget",
              severity: "error",
              message: `Local ${declaration.name.text} duplicates a public YunUI widget name and renders raw UI controls instead of delegating to the export.`,
              candidates: candidateList([declaration.name.text]),
              ...lineInfo(sourceFile, declaration, project.root),
            });
          }
        }
      } else if (ts.isClassDeclaration(statement) && statement.name && publicComponents.has(statement.name.text)) {
        const renderMethod = statement.members.find((member) =>
          ts.isMethodDeclaration(member) && member.name?.getText(sourceFile) === "render",
        );
        if (renderMethod?.body && containsRawControl(ts, renderMethod.body, sourceFile)) {
          resultBase.definiteIssues.push({
            code: "shadowed-library-widget",
            severity: "error",
            message: `Local ${statement.name.text} duplicates a public YunUI widget name and renders raw UI controls instead of delegating to the export.`,
            candidates: candidateList([statement.name.text]),
            ...lineInfo(sourceFile, statement, project.root),
          });
        }
      }
      if (name && body && publicComponents.has(name) && containsRawControl(ts, body, sourceFile)) {
        resultBase.definiteIssues.push({
          code: "shadowed-library-widget",
          severity: "error",
          message: `Local ${name} duplicates a public YunUI widget name and renders raw UI controls instead of delegating to the export.`,
          candidates: candidateList([name]),
          ...lineInfo(sourceFile, statement, project.root),
        });
      }
    }
  }

  const uniqueIssues = new Map();
  for (const issue of resultBase.definiteIssues) {
    const key = `${issue.code}:${issue.file}:${issue.line}:${issue.message}`;
    if (!uniqueIssues.has(key)) uniqueIssues.set(key, issue);
  }
  resultBase.definiteIssues = [...uniqueIssues.values()];
  resultBase.imports.sort((a, b) => a.file < b.file ? -1 : a.file > b.file ? 1 : a.line - b.line || a.name.localeCompare(b.name));
  resultBase.usedExports = [...usedMap.values()].sort((a, b) => a.entry < b.entry ? -1 : a.entry > b.entry ? 1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  resultBase.status = resultBase.unknown.length ? "unknown" : resultBase.definiteIssues.length ? "issues" : "ok";
  resultBase.strict = strict
    ? { enabled: true, ok: resultBase.unknown.length === 0 && resultBase.definiteIssues.length === 0, failures: [
      ...(resultBase.unknown.length ? ["typescript-ast-unknown"] : []),
      ...(resultBase.definiteIssues.length ? ["raw-library-controls"] : []),
    ] }
    : { enabled: false };

  if (json) process.stdout.write(`${JSON.stringify(resultBase, null, 2)}\n`);
  else {
    process.stdout.write(`YunUI adoption audit — ${project.root}\n`);
    process.stdout.write(`Status: ${resultBase.status}; scanned ${files.length} source files.\n`);
    process.stdout.write(`Imports: ${resultBase.imports.length}; exports used in JSX: ${resultBase.usedExports.length}.\n`);
    if (resultBase.imports.length) {
      process.stdout.write("Imported/re-exported YunUI exports:\n");
      for (const item of resultBase.imports) {
        const label = item.name === "*" ? `* as ${item.local ?? item.exportedAs ?? "namespace"}` : item.name;
        process.stdout.write(`  ${item.file}:${item.line} ${label} from ${item.entry}${item.typeOnly ? " (type-only)" : ""}${item.action === "re-export" ? ` as ${item.exportedAs}` : ""}\n`);
      }
    }
    if (resultBase.usedExports.length) {
      process.stdout.write("Exports used in JSX:\n");
      for (const item of resultBase.usedExports) {
        const uses = item.uses.map((use) => `${use.file}:${use.line}`).join(", ");
        process.stdout.write(`  ${item.entry}/${item.name}: ${uses}\n`);
      }
    }
    for (const issue of resultBase.definiteIssues) {
      process.stdout.write(`[ERROR] ${issue.file}:${issue.line} ${issue.message}\n`);
      for (const candidate of issue.candidates) process.stdout.write(`  Candidate: ${candidate.import}\n`);
    }
    for (const candidate of resultBase.candidates) {
      process.stdout.write(`[REVIEW] ${candidate.file}:${candidate.line} ${candidate.category}: ${candidate.message}\n`);
      for (const item of candidate.candidates) process.stdout.write(`  Candidate: ${item.import}\n`);
    }
    for (const unknown of resultBase.unknown) process.stdout.write(`[UNKNOWN] ${unknown.file ? `${unknown.file}:${unknown.line} ` : ""}${unknown.message}\n`);
    process.stdout.write("Visual candidates are heuristic review prompts, not definite errors. Resolve them against the available exports and this project's actual requirements.\n");
    if (strict) process.stdout.write(resultBase.strict.ok ? "Strict audit passed.\n" : `Strict audit failed: ${resultBase.strict.failures.join(", ")}\n`);
    process.stdout.write("Imported/used exports and their source locations are included in --json output.\n");
  }
  return resultBase;
}
