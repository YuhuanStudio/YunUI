// =====================================================
// YunUI — content rendering stack
// =====================================================
// Rich rendering for LLM/chat/doc content: markdown (GFM), math (KaTeX),
// Shiki-highlighted code, Mermaid diagrams, GitHub-style callouts, and lazy,
// zoomable images. Heavy engines (shiki, mermaid) load on demand.
//
// This subpath pulls in react-markdown, remark/rehype plugins, katex, shiki and
// mermaid as (optional) peer dependencies — install them in the host app.
// Also import `@yuhuanowo/yunui/content.css` and `katex/dist/katex.min.css`.

export {
  MarkdownRenderer,
  type MarkdownRendererProps,
} from "./markdown-renderer";

export {
  CodeBlock,
  InlineCode,
  type CodeBlockProps,
  type CodeBlockEditPayload,
} from "./code-block";

export {
  CalloutBlock,
  parseCalloutType,
  type CalloutBlockProps,
  type CalloutType,
} from "./callout-block";

export {
  MathRenderer,
  InlineMath,
  BlockMath,
  type MathRendererProps,
} from "./math-renderer";

export {
  MermaidDiagram,
  type MermaidDiagramProps,
} from "./mermaid-diagram";

export {
  ImageLightbox,
  type ImageLightboxProps,
} from "./image-lightbox";

export {
  ContentImage,
  type ContentImageProps,
} from "./content-image";
