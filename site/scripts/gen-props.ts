/**
 * gen-props.ts — extract component prop tables from the YunUI source.
 *
 * Parses the YunUI `../src` tsx tree with react-docgen-typescript, pulling each exported
 * component's props + the JSDoc descriptions the library already carries, and
 * writes the result to `site/.props.json`. The <PropsTable name="Button" /> MDX
 * component reads that file at build time.
 *
 * Run with:  pnpm --filter yunui-site gen:props   (or: pnpm tsx scripts/gen-props.ts)
 *
 * This is best-effort: if a component can't be parsed (or react-docgen chokes
 * on the toolchain), the PropsTable component falls back to whatever entries it
 * already has and renders an empty-but-labelled table, so the docs build never
 * breaks on prop extraction.
 */
import { writeFileSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as docgen from "react-docgen-typescript";

/** Recursively collect *.tsx files under `dir`, skipping __tests__ folders. */
function walkTsx(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "__tests__" || entry === "node_modules") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkTsx(full, acc);
    else if (entry.endsWith(".tsx")) acc.push(full);
  }
  return acc;
}

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = resolve(here, "..", "..", "src");
const outPath = resolve(here, "..", ".props.json");

type PropEntry = {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string | null;
  description: string;
};
type PropsMap = Record<string, PropEntry[]>;

// Props inherited from intrinsic DOM elements are noise in a component table —
// we only want the component's own documented props. react-docgen flags these
// via the declaration file path (node_modules / lib.dom.d.ts).
function isOwnProp(prop: docgen.PropItem): boolean {
  const fileName = prop.declarations?.[0]?.fileName ?? "";
  if (!fileName) return true;
  if (fileName.includes("node_modules")) return false;
  if (fileName.includes("lib.dom") || fileName.includes("typescript/lib")) return false;
  return true;
}

/**
 * Render a readable type string. For unions react-docgen reports `name: "enum"`
 * with the literal members under `type.value` — expand those into a `'a' | 'b'`
 * string so the props table shows the real options, not a bare "enum".
 */
function renderType(type: docgen.PropItemType | undefined): string {
  if (!type) return "unknown";
  if (type.name === "enum" && Array.isArray(type.value)) {
    const members = type.value
      .map((v: { value?: string }) => String(v.value))
      .filter((v) => v !== "undefined");
    if (members.length > 0 && members.length <= 12) return members.join(" | ");
  }
  return type.name;
}

/** Strip a trailing `@defaultValue ...` JSDoc tag — it duplicates the Default column. */
function cleanDescription(desc: string): string {
  return desc.replace(/\n?@defaultValue[^\n]*$/m, "").trim();
}

function main() {
  const files = walkTsx(srcRoot);

  const parser = docgen.withCompilerOptions(
    { esModuleInterop: true, jsx: 4 /* react-jsx */, skipLibCheck: true },
    {
      savePropValueAsString: true,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => isOwnProp(prop),
    },
  );

  const out: PropsMap = {};
  let parsed = 0;

  for (const file of files) {
    let docs: docgen.ComponentDoc[] = [];
    try {
      docs = parser.parse(file);
    } catch {
      continue;
    }
    for (const doc of docs) {
      const props = Object.values(doc.props)
        .filter((p) => isOwnProp(p))
        .map<PropEntry>((p) => ({
          name: p.name,
          type: renderType(p.type),
          required: p.required,
          defaultValue: p.defaultValue?.value ?? null,
          description: cleanDescription(p.description ?? ""),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      if (props.length === 0) continue;
      // Last definition wins; components are uniquely named across the lib.
      out[doc.displayName] = props;
      parsed += 1;
    }
  }

  writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
  console.log(
    `gen-props: parsed ${parsed} components from ${files.length} files → ${outPath}`,
  );
}

main();
