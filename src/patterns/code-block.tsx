"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Check as CheckIcon, Copy as CopyIcon } from "lucide-react";
import { cn } from "../lib/cn";
import { useYunUI } from "../adapters/context";
import { copyToClipboard } from "../lib/clipboard";
import {
    CODE_BLOCK_FOLD_THRESHOLD,
    captureCodeBlockScroll,
    codeLineCount,
    codeLineCountLabel,
    previewCode,
    restoreCodeBlockScroll,
    scheduleCodeBlockScrollRestore,
    translateCodeBlockLabel,
    type CodeBlockScrollSnapshot,
} from "../lib/code-block";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

interface Tab {
    /** Unique tab id. */
    id: string;
    /** Tab label shown in the header. */
    label: string;
    /** Code shown when this tab is active. */
    code: string;
    /** Language for this tab's code. */
    language?: string;
}

interface CodeBlockProps {
    /** The code to display (ignored when `tabs` are provided). */
    code: string;
    /** Language label, also used by the lightweight highlighter. @defaultValue "text" */
    language?: string;
    /** Filename shown in the header instead of the language badge. */
    filename?: string;
    /** Show line numbers in the gutter. @defaultValue false */
    showLineNumbers?: boolean;
    /** Show the copy-to-clipboard button. @defaultValue true */
    copyable?: boolean;
    className?: string;
    /** Render multiple switchable code tabs instead of a single `code` block. */
    tabs?: Tab[];
}

interface Token {
    type: 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'constant' | 'text';
    value: string;
}

function tokenizeLine(line: string): Token[] {
    const tokens: Token[] = [];
    let remaining = line;
    let pos = 0;

    while (pos < line.length) {
        if (/\s/.test(line[pos])) {
            const match = line.slice(pos).match(/^\s+/);
            if (match) {
                tokens.push({ type: 'text', value: match[0] });
                pos += match[0].length;
                remaining = line.slice(pos);
                continue;
            }
        }

        const stringMatch = remaining.match(/^("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)/);
        if (stringMatch) {
            tokens.push({ type: 'string', value: stringMatch[0] });
            pos += stringMatch[0].length;
            remaining = line.slice(pos);
            continue;
        }

        const commentMatch = remaining.match(/^(\/\/.*$|#.*$)/);
        if (commentMatch) {
            tokens.push({ type: 'comment', value: commentMatch[0] });
            break;
        }

        const keywords = ['import', 'from', 'const', 'let', 'var', 'return', 'print', 'def', 'class', 'function', 'if', 'else', 'for', 'while', 'async', 'await'];
        const keywordMatch = remaining.match(new RegExp(`^\\b(${keywords.join('|')})\\b`));
        if (keywordMatch) {
            tokens.push({ type: 'keyword', value: keywordMatch[0] });
            pos += keywordMatch[0].length;
            remaining = line.slice(pos);
            continue;
        }

        const constantMatch = remaining.match(/^\b(True|False|None|null|undefined|TRUE|FALSE)\b/);
        if (constantMatch) {
            tokens.push({ type: 'constant', value: constantMatch[0] });
            pos += constantMatch[0].length;
            remaining = line.slice(pos);
            continue;
        }

        const numberMatch = remaining.match(/^\b(\d+\.?\d*)\b/);
        if (numberMatch) {
            tokens.push({ type: 'number', value: numberMatch[0] });
            pos += numberMatch[0].length;
            remaining = line.slice(pos);
            continue;
        }

        const funcMatch = remaining.match(/^(\w+)(\s*\()/);
        if (funcMatch) {
            tokens.push({ type: 'function', value: funcMatch[1] });
            tokens.push({ type: 'text', value: funcMatch[2] });
            pos += funcMatch[0].length;
            remaining = line.slice(pos);
            continue;
        }

        const textMatch = remaining.match(/^[^\s"'`]/);
        if (textMatch) {
            const match = remaining.match(/^[^\s"'`\w]+|\w+/);
            if (match) {
                tokens.push({ type: 'text', value: match[0] });
                pos += match[0].length;
                remaining = line.slice(pos);
                continue;
            }
        }

        // Keep unmatched quotes/backticks and characters outside the ASCII
        // tokenizer's grammar visible instead of silently dropping them.
        tokens.push({ type: 'text', value: line[pos] });
        pos++;
        remaining = line.slice(pos);
    }

    return tokens;
}

function escapeHtml(text: string): string {
    // SECURITY: Escape all potentially dangerous HTML characters
    const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;',
    };
    return text.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}

function renderLine(line: string): string {
    const tokens = tokenizeLine(line);
    return tokens.map(token => {
        const escaped = escapeHtml(token.value);
        switch (token.type) {
            case 'keyword': return `<span class="code-keyword">${escaped}</span>`;
            case 'string': return `<span class="code-string">${escaped}</span>`;
            case 'comment': return `<span class="code-comment">${escaped}</span>`;
            case 'number': return `<span class="code-number">${escaped}</span>`;
            case 'function': return `<span class="code-function">${escaped}</span>`;
            case 'constant': return `<span class="code-constant">${escaped}</span>`;
            default: return escaped;
        }
    }).join('');
}

function highlightCode(code: string, showLineNumbers: boolean): string {
    const lines = code.split('\n');
    return lines.map((line, i) => {
        const rendered = renderLine(line) || '<br />';
        // Line numbers: --text-tertiary at full opacity on hover, not --text-muted
    // at 50%. They are meant to be quiet — they only appear on hover at all —
    // but #52525b is 2.57:1 before the opacity even applies, and half of that
    // is invisible. Being subtle and being unreadable are different goals.
    const lineNumber = showLineNumbers
        ? `<span class="table-cell select-none text-right pr-4 w-8 text-(--text-tertiary) text-xs opacity-0 group-hover:opacity-100 transition-opacity">${i + 1}</span>`
        : '';
    return `<div class="table-row group">${lineNumber}<span class="table-cell">${rendered}</span></div>`;
    }).join('');
}

/** Lightweight-tokenized code with compact metadata, selectable formats, full copy, and long-code disclosure. */
export function CodeBlock({
    code,
    language = "text",
    filename,
    showLineNumbers = false,
    copyable = true,
    className,
    tabs,
}: CodeBlockProps) {
    const translate = useYunUI().useT("common");
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [activeTabId, setActiveTabId] = useState<string | null>(null);
    const codeRegionRef = useRef<HTMLPreElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const copyButtonRef = useRef<HTMLButtonElement>(null);
    const disclosureRef = useRef<HTMLButtonElement>(null);
    const disclosureScroll = useRef<CodeBlockScrollSnapshot | null>(null);
    const restoreExpandedFocus = useRef(false);
    const restoreDisclosureFocus = useRef(false);
    const codeBlockId = useId();
    const copyRequestRef = useRef(0);
    const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasTabs = Boolean(tabs?.length);
    const activeTabData = hasTabs
        ? tabs?.find((tab) => tab.id === activeTabId) ?? tabs?.[0]
        : undefined;
    const resolvedActiveTabId = activeTabData?.id ?? null;
    const currentCode = activeTabData ? activeTabData.code : code;
    const currentLanguage = activeTabData?.language || language;
    const previousCopyPayloadRef = useRef(currentCode);
    const lineCount = codeLineCount(currentCode);
    const foldable = lineCount > CODE_BLOCK_FOLD_THRESHOLD;
    const shownCode = foldable && !expanded ? previewCode(currentCode) : currentCode;
    const highlightedHtml = useMemo(
        () => highlightCode(shownCode, showLineNumbers),
        [shownCode, showLineNumbers],
    );

    const codeRegionLabel = translateCodeBlockLabel(
        translate,
        "scrollRegion",
        `${currentLanguage} code, ${codeLineCountLabel(lineCount)}`,
        { language: currentLanguage, count: lineCount },
    );
    const copyFullLabel = translateCodeBlockLabel(translate, "copyFull", "Copy full code");
    const copyErrorLabel = translateCodeBlockLabel(
        translate,
        "copyError",
        "Clipboard access was denied. Select the code and copy it manually.",
    );
    const scrollCueLabel = translateCodeBlockLabel(translate, "scrollHorizontally", "Scroll horizontally");
    const showAllLabel = translateCodeBlockLabel(
        translate,
        "showAll",
        `Show all ${lineCount} lines`,
        { count: lineCount },
    );
    const showLessLabel = translateCodeBlockLabel(translate, "showLess", "Show less");
    const tabGroupLabel = translateCodeBlockLabel(translate, "tabGroup", "Code sample formats");

    useIsomorphicLayoutEffect(() => {
        if (activeTabId !== resolvedActiveTabId) setActiveTabId(resolvedActiveTabId);
    }, [activeTabId, resolvedActiveTabId]);

    useIsomorphicLayoutEffect(() => {
        if (previousCopyPayloadRef.current === currentCode) return;
        previousCopyPayloadRef.current = currentCode;
        copyRequestRef.current += 1;
        setCopied(false);
        setCopyError(false);
        if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = null;
    }, [currentCode]);

    useEffect(() => () => {
        copyRequestRef.current += 1;
        if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
    }, []);

    useIsomorphicLayoutEffect(() => {
        if (!disclosureScroll.current) return;
        const snapshot = disclosureScroll.current;
        if (expanded && restoreExpandedFocus.current) {
            restoreExpandedFocus.current = false;
            codeRegionRef.current?.focus({ preventScroll: true });
        }
        if (!expanded && restoreDisclosureFocus.current) {
            restoreDisclosureFocus.current = false;
            disclosureRef.current?.focus({ preventScroll: true });
        }
        restoreCodeBlockScroll(snapshot);
        return scheduleCodeBlockScrollRestore(snapshot, () => {
            if (disclosureScroll.current === snapshot) disclosureScroll.current = null;
        });
    }, [expanded]);

    const handleCopy = async () => {
        const requestId = ++copyRequestRef.current;
        const payload = currentCode;
        if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = null;
        setCopied(false);
        setCopyError(false);
        if (!(await copyToClipboard(payload))) {
            if (requestId !== copyRequestRef.current) return;
            setCopied(false);
            setCopyError(true);
            return;
        }
        if (requestId !== copyRequestRef.current) return;
        setCopied(true);
        copyTimeoutRef.current = setTimeout(() => {
            if (requestId !== copyRequestRef.current) return;
            setCopied(false);
            copyTimeoutRef.current = null;
        }, 2000);
    };

    const handleTabChange = (id: string) => {
        setActiveTabId(id);
        setCopied(false);
        setCopyError(false);
    };

    const toggleExpanded = () => {
        const nextExpanded = !expanded;
        disclosureScroll.current = captureCodeBlockScroll(disclosureRef.current);
        restoreExpandedFocus.current = nextExpanded;
        restoreDisclosureFocus.current = !nextExpanded;
        setExpanded(nextExpanded);
    };

    const handleCodeKeyDown = (event: React.KeyboardEvent<HTMLPreElement>) => {
        const region = event.currentTarget;
        if (foldable && expanded && event.key === "Tab") {
            const headerButtons = headerRef.current?.querySelectorAll<HTMLButtonElement>("button");
            const previousControl = copyButtonRef.current ?? headerButtons?.[headerButtons.length - 1] ?? null;
            const nextControl = event.shiftKey ? previousControl : disclosureRef.current;
            if (nextControl) {
                event.preventDefault();
                nextControl.focus();
                return;
            }
        }
        const before = region.scrollLeft;
        if (event.key === "ArrowRight" && region.scrollWidth > region.clientWidth) {
            region.scrollLeft += 48;
        } else if (event.key === "ArrowLeft" && region.scrollWidth > region.clientWidth) {
            region.scrollLeft -= 48;
        } else {
            return;
        }
        if (region.scrollLeft !== before) event.preventDefault();
    };

    const legacyCopy = translate("copy");
    const legacyCopied = translate("copied");
    const copyText = !legacyCopy || legacyCopy === "copy" || legacyCopy.endsWith(".copy") ? "Copy" : legacyCopy;
    const copiedText = !legacyCopied || legacyCopied === "copied" || legacyCopied.endsWith(".copied") ? "Copied" : legacyCopied;

    return (
        <div className={cn("my-3 w-full min-w-0 overflow-hidden rounded-lg border border-(--border-hairline) bg-(--bg-base)", className)}>
            <div ref={headerRef} className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 border-b border-(--border-hairline) bg-(--bg-elevated) px-2 py-1.5">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                    {hasTabs ? (
                        <div role="group" aria-label={tabGroupLabel} className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                            {tabs!.map((tab) => (
                                <button
                                    type="button"
                                    key={tab.id}
                                    aria-pressed={activeTabData?.id === tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={cn(
                                        "min-h-6 min-w-0 max-w-full break-words rounded-md px-2 py-1 text-left text-xs font-medium leading-tight transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                        activeTabData?.id === tab.id
                                            ? "bg-(--accent-subtle) text-(--text-primary)"
                                            : "text-(--text-secondary) hover:bg-(--accent-subtle)/50",
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <span className={cn("min-w-0 flex-1 truncate font-mono text-xs font-medium text-(--text-secondary)", !filename && "font-sans")} title={filename || currentLanguage}>
                            {filename || currentLanguage}
                        </span>
                    )}
                    {filename && !hasTabs && (
                        <span className="shrink-0 rounded bg-(--bg-base) px-1.5 py-0.5 text-[10px] text-(--text-secondary)">
                            {currentLanguage}
                        </span>
                    )}
                    <span className="shrink-0 text-[10px] text-(--text-secondary)">
                        {translateCodeBlockLabel(translate, "lineCount", codeLineCountLabel(lineCount), { count: lineCount })}
                    </span>
                    {currentCode.split("\n").some((line) => line.length > 72) && (
                        <span className="shrink-0 text-[10px] text-(--text-secondary)">
                            {scrollCueLabel} <span aria-hidden="true">→</span>
                        </span>
                    )}
                </div>
                {copyable && (
                    <button
                        ref={copyButtonRef}
                        type="button"
                        aria-label={copied ? copiedText : copyFullLabel}
                        onClick={handleCopy}
                        className="ml-auto inline-flex min-h-6 shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-(--text-secondary) transition-colors hover:bg-(--accent-subtle) outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {copied ? <CheckIcon className="h-3.5 w-3.5 text-(--success)" /> : <CopyIcon className="h-3.5 w-3.5" />}
                        <span className={copied ? "text-(--success)" : "text-(--text-secondary)"}>{copied ? copiedText : copyText}</span>
                    </button>
                )}
            </div>
            {copyError && <p role="alert" className="border-b border-(--border-hairline) px-2 py-1 text-xs text-(--text-secondary)">{copyErrorLabel}</p>}
            <pre
                ref={codeRegionRef}
                id={`${codeBlockId}-code`}
                tabIndex={0}
                aria-label={codeRegionLabel}
                onKeyDown={handleCodeKeyDown}
                className={cn("m-0 max-w-full overflow-x-auto overflow-y-hidden whitespace-pre bg-(--bg-base) px-2 py-2 font-mono text-sm leading-[1.5] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring", showLineNumbers && "code-with-line-numbers")}
            >
                <code className="font-mono text-(--text-primary)" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
            </pre>
            {foldable && (
                <button
                    ref={disclosureRef}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`${codeBlockId}-code`}
                    onClick={toggleExpanded}
                    className="flex min-h-7 w-full items-center border-t border-(--border-hairline) px-2 py-1 text-left text-xs text-(--text-secondary) transition-colors hover:bg-(--accent-subtle) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                    {expanded ? showLessLabel : showAllLabel}
                </button>
            )}
        </div>
    );
}
