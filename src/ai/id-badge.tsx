"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "../lib/clipboard";
import { useYunUI } from "../adapters/context";

/** Click-to-copy mono ID badge (faithful port of Yunxin's IDBadge).
 *  Defaults to subtitle scale (`sm`: 11px, muted, tighter); pass `size="default"`
 *  for the larger 12px variant. */
export function IDBadge({
    text,
    truncate = true,
    size = "sm",
}: {
    text: string;
    truncate?: boolean;
    size?: "default" | "sm";
}) {
    const [copied, setCopied] = useState(false);
    const t = useYunUI().useT("common.badge");
    const sm = size === "sm";

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!(await copyToClipboard(text))) return;
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={`group/badge relative inline-flex items-center rounded-md bg-muted border border-border hover:bg-muted/70 cursor-pointer transition-colors duration-200 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring ${truncate ? "max-w-full min-w-0" : ""}`}
            title={t("clickToCopy", { text })}
            aria-label={t("clickToCopy", { text })}
        >
            <span className={`font-mono block ${sm ? "px-1.5 py-0 text-[11px] leading-5 text-muted-foreground" : "px-2 py-0.5 text-xs"} ${truncate ? "truncate max-w-full min-w-0" : "whitespace-nowrap"}`}>{text}</span>
            <span className={`opacity-0 group-hover/badge:opacity-100 absolute right-0 inset-y-0 flex items-center justify-center rounded-r-md bg-muted/90 backdrop-blur-sm transition-opacity duration-200 ${sm ? "w-4" : "w-5"}`}>
                {copied ? <Check size={sm ? 9 : 10} /> : <Copy size={sm ? 9 : 10} />}
            </span>
        </button>
    );
}
