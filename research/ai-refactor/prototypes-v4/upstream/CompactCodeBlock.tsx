import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Check, Copy } from "lucide-react";
import { CodeBlock, type CodeBlockEditPayload } from "@yuhuanowo/yunui/content";

/**
 * Research-only copy of codeblock-v4/Prototype.tsx CompactCandidate.
 * Source commit and behavior adaptations are recorded in D4 review notes.
 */
export default function CompactCodeBlock({
  code,
  language,
  filename,
  showLineNumbers,
  highlightLines,
  onEdit,
}: {
  code: string;
  language: string;
  filename: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  onEdit?: (payload: CodeBlockEditPayload) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const expandControl = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const lines = code.split("\n");
  const shouldFold = lines.length > 16;
  const hasLongLine = lines.some((line) => line.length > 72);

  const copyFull = async () => {
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  useEffect(() => {
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    expandControl.current?.focus();
  }, [expanded]);

  const toggleExpanded = (next: boolean) => {
    restoreFocus.current = true;
    setExpanded(next);
  };
  const onPreviewKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || target.tabIndex < 0) return;
    if (event.key === "ArrowRight" && target.scrollWidth > target.clientWidth) target.scrollLeft += 48;
    else if (event.key === "ArrowLeft" && target.scrollWidth > target.clientWidth) target.scrollLeft -= 48;
    else if (event.key === "ArrowDown" && target.scrollHeight > target.clientHeight) target.scrollTop += 48;
    else if (event.key === "ArrowUp" && target.scrollHeight > target.clientHeight) target.scrollTop -= 48;
    else return;
    event.preventDefault();
  };

  const codeProps = { language, showLineNumbers, highlightLines, onEdit };
  return (
    <div className="d4-compact-code" data-testid="candidate-code" data-code-lines={lines.length}>
      <div className="d4-compact-code-head">
        <span className="d4-compact-code-file" title={filename}>{filename}</span>
        <span className="d4-compact-code-lang">{language} <span aria-hidden="true">·</span> {lines.length} {lines.length === 1 ? "line" : "lines"}</span>
        {hasLongLine && <span className="d4-compact-scroll-cue">Scroll horizontally →</span>}
        {onEdit && <button type="button" className="d4-compact-action" aria-label="Edit code" onClick={() => onEdit({ code, language, filename })}>Edit</button>}
        <button type="button" className="d4-compact-action" aria-label="Copy full code" onClick={copyFull}>
          {copied ? <Check size={14} /> : <Copy size={14} />}<span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      {copyError && <p role="alert" className="d4-compact-copy-error">Clipboard access was denied. Select the code and copy it manually.</p>}
      {shouldFold && !expanded ? <>
        <div className="d4-compact-preview" aria-label={`Code preview, first 8 of ${lines.length} lines`}>
          <CodeBlock {...codeProps} className="d4-compact-public-preview">{lines.slice(0, 8).join("\n")}</CodeBlock>
        </div>
        <button ref={expandControl} type="button" className="d4-compact-expand" aria-expanded="false" onClick={() => toggleExpanded(true)}>Show all {lines.length} lines</button>
      </> : <>
        <div className="d4-compact-full"><CodeBlock {...codeProps} className="d4-compact-public-code">{code}</CodeBlock></div>
        {shouldFold && <button ref={expandControl} type="button" className="d4-compact-expand" aria-expanded="true" onClick={() => toggleExpanded(false)}>Show less</button>}
      </>}
    </div>
  );
}
