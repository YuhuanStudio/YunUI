"use client";

import { useState, useEffect } from "react";
import { Check as CheckIcon, Copy as CopyIcon } from "lucide-react";
import { cn } from "../lib/cn";
import { useYunUI } from "../adapters/context";
import { copyToClipboard } from "../lib/clipboard";

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
    /** Show line numbers in the gutter. @defaultValue true */
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

function highlightCode(code: string): string {
    const lines = code.split('\n');
    return lines.map((line, i) => {
        const rendered = renderLine(line) || '&nbsp;';
        return `<div class="table-row group"><span class="table-cell select-none text-right pr-4 w-8 text-(--text-muted) text-xs opacity-0 group-hover:opacity-50 transition-opacity">${i + 1}</span><span class="table-cell">${rendered}</span></div>`;
    }).join('');
}

/** Styled code block with a window-chrome header, optional tabs, line numbers, basic syntax highlighting, and copy. */
export function CodeBlock({
    code,
    language = "text",
    filename,
    showLineNumbers = true,
    copyable = true,
    className,
    tabs,
}: CodeBlockProps) {
    const t = useYunUI().useT("common");
    const [copied, setCopied] = useState(false);
    const [highlightedHtml, setHighlightedHtml] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    // Use active tab code if tabs are provided, otherwise use the code prop
    const currentCode = tabs?.[activeTab]?.code || code;
    const currentLanguage = tabs?.[activeTab]?.language || language;

    useEffect(() => {
        setHighlightedHtml(highlightCode(currentCode));
    }, [currentCode]);

    const handleCopy = async () => {
        if (!(await copyToClipboard(currentCode))) return;
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTabChange = (index: number) => {
        setActiveTab(index);
    };

    // max-w-full + min-w-0: in a flex/grid parent the card would otherwise grow
    // to the (wide) code's intrinsic width and overflow the page on mobile —
    // instead it stays within its container and the <pre> scrolls.
    return (
        <div className={cn("card overflow-hidden max-w-full min-w-0", className)}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-(--border-hairline) bg-(--bg-elevated)">
                <div className="flex items-center gap-2.5">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-(--error) opacity-80" />
                        <div className="w-2 h-2 rounded-full bg-(--warning) opacity-80" />
                        <div className="w-2 h-2 rounded-full bg-(--success) opacity-80" />
                    </div>
                    {tabs && tabs.length > 0 ? (
                        <div className="flex items-center gap-1">
                            {tabs.map((tab, index) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(index)}
                                    className={cn(
                                        "px-3 py-1 rounded-md text-xs font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                        activeTab === index
                                            ? "bg-(--accent-subtle) text-(--text-primary)"
                                            : "text-(--text-tertiary) hover:text-(--text-secondary) hover:bg-(--accent-subtle)/50"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    ) : filename ? (
                        <span className="text-xs font-medium text-(--text-secondary) font-mono">
                            {filename}
                        </span>
                    ) : (
                        <span className="badge text-xs">{currentLanguage}</span>
                    )}
                </div>
                {copyable && (
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all hover:bg-(--accent-subtle) outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {copied ? (
                            <>
                                <CheckIcon className="w-3.5 h-3.5 text-(--success)" />
                                <span className="text-(--success)">{t('copied')}</span>
                            </>
                        ) : (
                            <>
                                <CopyIcon className="w-3.5 h-3.5 text-(--text-tertiary)" />
                                <span className="text-(--text-tertiary)">{t('copy')}</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            <div className="p-4 bg-(--bg-base)">
                <pre className="text-sm overflow-x-auto">
                    <code className="font-mono" style={{ color: 'var(--text-primary)' }}>
                        {showLineNumbers ? (
                            <div
                                className="table"
                                dangerouslySetInnerHTML={{
                                    __html: highlightedHtml || code.split('\n').map((line, i) =>
                                        `<div class="table-row group"><span class="table-cell select-none text-right pr-4 w-8 text-(--text-muted) text-xs opacity-0 group-hover:opacity-50 transition-opacity">${i + 1}</span><span class="table-cell">${escapeHtml(line) || '&nbsp;'}</span></div>`
                                    ).join('')
                                }}
                            />
                        ) : (
                            code
                        )}
                    </code>
                </pre>
            </div>
        </div>
    );
}
