#!/usr/bin/env node

import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const entries = [
  { entry: ".", source: "src/index.ts", docsGroup: "components" },
  { entry: "./adapters", source: "src/adapters/index.ts", docsGroup: null },
  { entry: "./patterns", source: "src/patterns/index.ts", docsGroup: "patterns" },
  { entry: "./ai", source: "src/ai/index.ts", docsGroup: "ai" },
  { entry: "./content", source: "src/content/index.ts", docsGroup: "content" },
  { entry: "./chat", source: "src/chat/index.ts", docsGroup: "chat" },
];

const compilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  esModuleInterop: true,
  skipLibCheck: true,
  allowSyntheticDefaultImports: true,
};
const program = ts.createProgram(entries.map((item) => path.join(root, item.source)), compilerOptions);
const checker = program.getTypeChecker();
const typeValueFlags = ts.SymbolFlags.Value;

function moduleExports(entry) {
  const sourceFile = program.getSourceFile(path.join(root, entry.source));
  if (!sourceFile) throw new Error(`TypeScript source not found: ${entry.source}`);
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) throw new Error(`Could not resolve exports for ${entry.source}`);
  return checker.getExportsOfModule(moduleSymbol);
}

function targetSymbol(symbol) {
  return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
}

function isTypeOnly(symbol, target) {
  return (target.flags & typeValueFlags) === 0;
}

function declarationFor(symbol) {
  const declarations = symbol.getDeclarations() ?? [];
  return declarations.find((item) => !ts.isExportSpecifier(item)) ?? declarations[0];
}

function sourcePath(symbol) {
  const declaration = declarationFor(symbol);
  if (!declaration) return null;
  const filename = path.relative(root, declaration.getSourceFile().fileName);
  return filename.split(path.sep).join("/");
}

function docsText(symbol, declaration) {
  const docs = symbol.getDocumentationComment(checker);
  const text = ts.displayPartsToString(docs).trim();
  if (text) return text;
  if (declaration) {
    const comment = ts.getJSDocCommentsAndTags(declaration)
      .filter((item) => ts.isJSDoc(item))
      .map((item) => item.comment)
      .filter((value) => typeof value === "string")
      .join("\n")
      .trim();
    if (comment) return comment;
  }
  return "";
}

function typeText(type, location) {
  return checker.typeToString(
    type,
    location,
    ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
  );
}

function isPackageSource(declaration) {
  const relative = path.relative(root, declaration.getSourceFile().fileName).split(path.sep).join("/");
  return relative.startsWith("src/");
}

function propertyFields(type, location) {
  const fields = [];
  let inheritsExternalProps = false;
  for (const property of checker.getPropertiesOfType(type)) {
    const declarations = property.getDeclarations() ?? [];
    const ownDeclaration = declarations.find(isPackageSource);
    if (!ownDeclaration) {
      if (declarations.length) inheritsExternalProps = true;
      continue;
    }
    const propertyType = checker.getTypeOfSymbolAtLocation(property, ownDeclaration ?? location);
    const tags = property.getJsDocTags(checker);
    const defaultTag = tags.find((tag) => tag.name === "defaultValue" || tag.name === "default");
    const defaultValue = defaultTag ? ts.displayPartsToString(defaultTag.text ?? []).trim() : "";
    const field = {
      name: property.name,
      required: !(property.flags & ts.SymbolFlags.Optional),
      type: typeText(propertyType, ownDeclaration),
      description: ts.displayPartsToString(property.getDocumentationComment(checker)).trim(),
      source: path.relative(root, ownDeclaration.getSourceFile().fileName).split(path.sep).join("/"),
    };
    if (defaultValue) field.default = defaultValue;
    fields.push(field);
  }
  fields.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  return { fields, inheritsExternalProps };
}

function classify(name, typeOnly, symbol, declaration) {
  if (typeOnly) return "type";
  if (/^use[A-Z0-9]/.test(name)) return "hook";
  const valueType = declaration
    ? checker.getTypeOfSymbolAtLocation(symbol, declaration)
    : undefined;
  const calls = valueType ? checker.getSignaturesOfType(valueType, ts.SignatureKind.Call) : [];
  if (/^[A-Z]/.test(name) && calls.length) return "component";
  if (calls.length) return "function";
  if (symbol.flags & ts.SymbolFlags.Enum) return "enum";
  if (symbol.flags & ts.SymbolFlags.Class) return "class";
  if (symbol.flags & ts.SymbolFlags.Namespace) return "namespace";
  return "constant";
}

function signaturesFor(symbol, declaration, kind) {
  if (!declaration) return {};
  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const signature = checker.getSignaturesOfType(type, ts.SignatureKind.Call)[0];
  if (!signature) return {};
  const result = {
    signature: checker.signatureToString(
      signature,
      declaration,
      ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
      ts.SignatureKind.Call,
    ),
  };
  if (kind === "component" && signature.getParameters().length) {
    const props = signature.getParameters()[0];
    const propsType = checker.getTypeOfSymbolAtLocation(props, declaration);
    result.props = typeText(propsType, declaration);
    const metadata = propertyFields(propsType, declaration);
    if (metadata.fields.length) result.propsFields = metadata.fields;
    if (metadata.inheritsExternalProps) result.inheritsExternalProps = true;
  }
  return result;
}

function typeFieldsFor(symbol, declaration, typeOnly) {
  if (!typeOnly || !declaration) return {};
  const declaredType = checker.getDeclaredTypeOfSymbol(symbol);
  const metadata = propertyFields(declaredType, declaration);
  return {
    ...(metadata.fields.length ? { propsFields: metadata.fields } : {}),
    ...(metadata.inheritsExternalProps ? { inheritsExternalProps: true } : {}),
  };
}

function kebabCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

async function getDocs(entry, name, typeOnly) {
  const group = entry.docsGroup;
  const groupOverview = group ? `site/content/docs/${group}/index.mdx` : null;
  let overviewFile = "site/content/docs/index.mdx";
  let overviewRoute = "/docs";
  if (groupOverview) {
    try {
      await access(path.join(root, groupOverview));
      overviewFile = groupOverview;
      overviewRoute = `/docs/${group}`;
    } catch {
      // Fall back to the verified docs root when this entry has no index page.
    }
  }
  let component = null;
  if (group && !typeOnly) {
    const candidate = `site/content/docs/${group}/${kebabCase(name)}.mdx`;
    try {
      await access(path.join(root, candidate));
      component = { path: candidate, route: `/docs/${group}/${kebabCase(name)}` };
    } catch {
      // Only link to docs pages that exist in this checkout.
    }
  }
  return { overview: { path: overviewFile, route: overviewRoute }, ...(component ? { component } : {}) };
}

const exports = [];
for (const entry of entries) {
  const specifier = entry.entry === "."
    ? packageJson.name
    : `${packageJson.name}/${entry.entry.slice(2)}`;
  for (const exportedSymbol of moduleExports(entry)) {
    if (exportedSymbol.name === "default" || exportedSymbol.name.startsWith("__")) continue;
    const target = targetSymbol(exportedSymbol);
    const declaration = declarationFor(target);
    const typeOnly = isTypeOnly(exportedSymbol, target);
    const kind = classify(exportedSymbol.name, typeOnly, target, declaration);
    const symbolDescription = docsText(exportedSymbol, declaration) || docsText(target, declaration);
    const signatures = typeOnly ? {} : signaturesFor(target, declaration, kind);
    const publicTypeShape = typeFieldsFor(target, declaration, typeOnly);
    const item = {
      entry: entry.entry,
      name: exportedSymbol.name,
      kind,
      typeOnly,
      source: sourcePath(target),
      declarationFile: `dist/${entry.entry === "." ? "index" : entry.entry.slice(2)}.d.ts`,
      import: typeOnly
        ? `import type { ${exportedSymbol.name} } from "${specifier}";`
        : `import { ${exportedSymbol.name} } from "${specifier}";`,
      description: symbolDescription,
      docs: await getDocs(entry, exportedSymbol.name, typeOnly),
      ...(signatures.signature ? { signature: signatures.signature } : {}),
      ...(signatures.props ? { props: signatures.props } : {}),
      ...(signatures.propsFields ? { propsFields: signatures.propsFields } : publicTypeShape),
      ...((signatures.inheritsExternalProps ?? publicTypeShape.inheritsExternalProps)
        ? { inheritsExternalProps: true }
        : {}),
    };
    exports.push(item);
  }
}

exports.sort((a, b) => a.entry < b.entry ? -1 : a.entry > b.entry ? 1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

const resources = [
  {
    entry: "./package.json",
    kind: "package-manifest",
    source: "package.json",
    import: `import manifest from "${packageJson.name}/package.json" assert { type: "json" };`,
    description: "Published package manifest metadata.",
  },
  {
    entry: "./css",
    kind: "stylesheet",
    source: "styles/yunui.css",
    import: `@import "${packageJson.name}/css";`,
    description: "Design tokens, theme mappings, component classes, and animation styles.",
  },
  {
    entry: "./content.css",
    kind: "stylesheet",
    source: "styles/content.css",
    import: `@import "${packageJson.name}/content.css";`,
    description: "Styles for the content rendering entry point.",
  },
];

const catalog = {
  schemaVersion: 1,
  package: packageJson.name,
  version: packageJson.version,
  generator: "scripts/gen-agent-catalog.mjs",
  generatedFrom: entries.map(({ entry, source }) => ({ entry, source })),
  guides: [
    { purpose: "agent-setup-and-adoption", path: "agent/skills/yunui/SKILL.md" },
    { purpose: "consumer-import-recipes", path: "agent/recipes" },
    { purpose: "package-setup", path: "README.md" },
  ],
  resources,
  exports,
};

const output = path.join(root, "agent/catalog.generated.json");
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(catalog, null, 2)}\n`);
process.stdout.write(`Generated ${path.relative(root, output)} (${exports.length} named exports across ${entries.length} TS entries).\n`);
