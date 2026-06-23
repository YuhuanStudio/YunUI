/**
 * remark-demo-source — single source of truth for documented examples.
 *
 * For every `<ComponentPreview>` in an MDX doc, derive its `code` string from
 * the ACTUAL JSX children that get rendered (sliced verbatim from the MDX
 * source), and overwrite any hand-written `code` prop with it. This makes the
 * "Code" tab provably identical to the live preview — the demo/code drift class
 * (e.g. a code string showing 5 buttons while 7 render) becomes impossible, with
 * zero per-file maintenance: authors just write the children; the code follows.
 *
 * Zero dependencies (manual tree walk + raw-source slice) so the Turbopack MDX
 * loader doesn't have to resolve any plugin imports.
 */

const TARGET = "ComponentPreview";

export default function remarkDemoSource() {
  return (tree, file) => {
    const source = String(file.value ?? "");
    if (!source) return;

    const walk = (node) => {
      if (!node || !Array.isArray(node.children)) return;
      for (const child of node.children) {
        if (child.type === "mdxJsxFlowElement" && child.name === TARGET) {
          injectCode(child, source);
        }
        walk(child);
      }
    };
    walk(tree);
  };
}

function injectCode(node, source) {
  // Meaningful children = JSX elements / expressions, skipping whitespace-only text.
  const kids = (node.children ?? []).filter(
    (c) =>
      c.position &&
      c.position.start &&
      c.position.end &&
      !(c.type === "text" && !String(c.value).trim())
  );
  if (kids.length === 0) return;

  const firstOffset = kids[0].position.start.offset;
  const lastOffset = kids[kids.length - 1].position.end.offset;
  if (firstOffset == null || lastOffset == null) return;

  // Back up to the start of the first child's line so every line carries its
  // original indentation, then dedent uniformly.
  const lineStart = source.lastIndexOf("\n", firstOffset - 1) + 1;
  const body = dedent(source.slice(lineStart, lastOffset));
  if (!body) return;

  const attrs = node.attributes ?? (node.attributes = []);
  const existing = attrs.find(
    (a) => a.type === "mdxJsxAttribute" && a.name === "code"
  );

  // Preserve any leading `import` lines from the author's original `code` prop —
  // they're contextual metadata (how to import the component) that doesn't exist
  // in the rendered children, and can't drift. The JSX body, which CAN drift, is
  // always replaced with the children source so the Code tab matches the preview.
  const imports = leadingImports(existing);
  const code = imports ? `${imports}\n\n${body}` : body;

  // A plain string `value` becomes a literal `code="..."` attribute; MDX handles
  // escaping. This replaces any hand-written (and possibly stale) expression.
  if (existing) existing.value = code;
  else attrs.push({ type: "mdxJsxAttribute", name: "code", value: code });
}

/** Pull the contiguous leading `import …` lines out of an existing `code` prop. */
function leadingImports(attr) {
  if (!attr) return "";
  const raw =
    typeof attr.value === "string" ? attr.value : String(attr.value?.value ?? "");
  // Strip a surrounding template-literal/quote pair if present.
  const inner = raw.replace(/^\s*[`'"]/, "").replace(/[`'"]\s*$/, "");
  const out = [];
  for (const line of inner.split("\n")) {
    if (/^\s*import\s/.test(line)) out.push(line.trim());
    else if (line.trim() === "") continue; // tolerate blank lines around imports
    else break; // first real (non-import) line ends the prefix
  }
  return out.join("\n");
}

function dedent(text) {
  const lines = text.replace(/\s+$/, "").split("\n");
  const indents = lines
    .filter((l) => l.trim())
    .map((l) => (l.match(/^[ \t]*/)?.[0].length ?? 0));
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min)).join("\n").trimEnd();
}
