import rehypeSanitize, { defaultSchema, type Options } from "rehype-sanitize";

const schema: Options = {
  ...defaultSchema,
  clobberPrefix: "user-content-",
  tagNames: [...(defaultSchema.tagNames ?? []), "mark", "abbr"],
  strip: [...(defaultSchema.strip ?? []), "style", "iframe", "object", "embed", "svg", "math", "template", "form"],
  attributes: {
    ...defaultSchema.attributes,
    "*": (defaultSchema.attributes?.["*"] ?? []).filter(attribute => attribute !== "tabIndex" && attribute !== "accessKey"),
    code: [[
      "className",
      /^language-[\w+-]+$/,
      "math-inline",
      "math-display",
      "showLineNumbers",
      /^\{[\d,-]+\}$/,
      /^filename-[A-Za-z0-9._~%\-]{1,1152}$/,
    ]],
  },
};

type Tree = Parameters<ReturnType<typeof rehypeSanitize>>[0];
type Node = Tree | Tree["children"][number];

function visit(node: Node, callback: (node: Node) => void) {
  callback(node);
  if ("children" in node) for (const child of node.children) visit(child, callback);
}

/** Sanitize untrusted input before trusted math/code rendering. Keep local
 * heading and GFM footnote links aligned with the sanitizer's safe ID prefix. */
export function rehypeSanitizeMarkdown() {
  const sanitize = rehypeSanitize(schema);
  return (tree: Tree): Tree => {
    const ids = new Set<string>();
    visit(tree, node => {
      if (node.type === "element") {
        for (const key of ["id", "name"]) {
          const value = node.properties[key];
          if (typeof value === "string") ids.add(value);
        }
      }
    });
    const clean = sanitize(tree);
    const cleanIds = new Set<string>();
    visit(clean, node => {
      if (node.type !== "element") return;
      for (const key of ["id", "name"]) {
        const value = node.properties[key];
        if (typeof value === "string") cleanIds.add(value);
      }
    });
    visit(clean, node => {
      if (node.type !== "element") return;
      const href = node.properties.href;
      if (typeof href !== "string" || !href.startsWith("#")) return;
      let target: string;
      try { target = decodeURIComponent(href.slice(1)); } catch { return; }
      const prefixed = `${schema.clobberPrefix}${target}`;
      if (ids.has(target) && cleanIds.has(prefixed)) node.properties.href = `#${encodeURIComponent(prefixed)}`;
    });
    return clean;
  };
}
