import * as React from 'react';

interface CodeBlockEditPayload {
    code: string;
    language: string;
    filename: string;
}
interface CodeBlockProps {
    children: string;
    language?: string;
    showLineNumbers?: boolean;
    highlightLines?: number[];
    filename?: string;
    className?: string;
    /**
     * When provided, an "Edit" button appears in the header and calls this with
     * the code payload (e.g. to open it in an editor/workspace). Hidden if unset.
     */
    onEdit?: (payload: CodeBlockEditPayload) => void;
}
/**
 * Syntax-highlighted code block powered by Shiki (accurate, VS Code-grade
 * highlighting for 100+ languages). Shiki is loaded on demand the first time a
 * block renders, so it never ships in the initial bundle. Supports line numbers,
 * highlighted lines, a filename header, copy, and an optional edit action.
 */
declare function CodeBlock({ children, language, showLineNumbers, highlightLines, filename, className, onEdit, }: CodeBlockProps): React.JSX.Element;
/** Inline code (`` `code` ``) — used by the markdown renderer. */
declare function InlineCode({ children, className, }: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;

interface MarkdownRendererProps {
    content: string;
    className?: string;
    /**
     * Rewrite image/link URLs before rendering (e.g. prefix a backend host or
     * proxy). Defaults to identity.
     */
    urlTransform?: (url: string) => string;
    /**
     * When provided, code blocks show an "Edit" button that calls this with the
     * code payload (e.g. open it in an editor). Hidden if unset.
     */
    onCodeEdit?: (payload: CodeBlockEditPayload) => void;
}
/**
 * Full markdown renderer: GFM (tables, task lists, strikethrough), math (KaTeX),
 * Shiki code blocks, Mermaid diagrams, GitHub-style callouts, heading anchors,
 * and lazy, zoomable images. Requires `katex/dist/katex.min.css` and the YunUI
 * content styles to be imported by the host app.
 */
declare function MarkdownRenderer({ content, className, urlTransform, onCodeEdit, }: MarkdownRendererProps): React.JSX.Element;

type CalloutType = "note" | "tip" | "important" | "warning" | "caution" | "success";
interface CalloutBlockProps {
    type: CalloutType;
    title?: string;
    children: React.ReactNode;
    className?: string;
}
/**
 * GitHub-style callout box (note / tip / important / warning / caution /
 * success). Renders a colored, left-bordered panel with a semantic icon.
 */
declare function CalloutBlock({ type, title, children, className, }: CalloutBlockProps): React.JSX.Element;
/**
 * Parse a GitHub-style callout marker (`[!NOTE] optional title`) from the first
 * line of a blockquote. Returns `{ type: null }` when the line isn't a callout.
 */
declare function parseCalloutType(text: string): {
    type: CalloutType | null;
    title: string | null;
};

interface MathRendererProps {
    math: string;
    block?: boolean;
    className?: string;
}
/**
 * Render a LaTeX expression with KaTeX. Requires `katex/dist/katex.min.css` to
 * be imported by the host app.
 */
declare function MathRenderer({ math, block, className }: MathRendererProps): React.JSX.Element;
/** Inline math (`$…$`) — used by the markdown renderer's math plugin. */
declare function InlineMath({ value }: {
    value: string;
}): React.JSX.Element;
/** Block/display math (`$$…$$`) — used by the markdown renderer's math plugin. */
declare function BlockMath({ value }: {
    value: string;
}): React.JSX.Element;

interface MermaidDiagramProps {
    chart: string;
    className?: string;
}
/**
 * Render a Mermaid diagram (flowchart, sequence, gantt, …). The `mermaid`
 * library is loaded on demand the first time a diagram renders, so it never
 * ships in the initial bundle. Re-themes automatically for light/dark.
 */
declare function MermaidDiagram({ chart, className }: MermaidDiagramProps): React.JSX.Element;

interface ImageLightboxProps {
    src: string;
    alt?: string;
    isOpen: boolean;
    onClose: () => void;
}
/**
 * Full-screen image viewer with zoom, rotate, download and keyboard shortcuts
 * (Esc / +/- / R). Rendered into a portal on `document.body`.
 */
declare function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps): React.ReactPortal | null;

interface ContentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /** Open a zoom/rotate/download lightbox on click. @defaultValue true */
    enableLightbox?: boolean;
}
/**
 * Lazy, flicker-free image for rendered content. Defers loading until the image
 * scrolls near the viewport (IntersectionObserver), fades in on load, shows a
 * spinner placeholder, and (by default) opens a full-screen lightbox on click.
 *
 * URLs are used as-is — resolve/rewrite them upstream (e.g. via the markdown
 * renderer's `urlTransform`).
 */
declare const ContentImage: React.MemoExoticComponent<({ enableLightbox, className, alt, src, onError, onLoad, ...rest }: ContentImageProps) => React.JSX.Element | null>;

export { BlockMath, CalloutBlock, type CalloutBlockProps, type CalloutType, CodeBlock, type CodeBlockEditPayload, type CodeBlockProps, ContentImage, type ContentImageProps, ImageLightbox, type ImageLightboxProps, InlineCode, InlineMath, MarkdownRenderer, type MarkdownRendererProps, MathRenderer, type MathRendererProps, MermaidDiagram, type MermaidDiagramProps, parseCalloutType };
