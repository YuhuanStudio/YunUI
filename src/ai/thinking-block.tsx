"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../lib/cn";
import { useYunUI } from "../adapters/context";

interface ThinkingBlockProps {
    content: string;
    isStreaming?: boolean;
    defaultOpen?: boolean;
    /**
     * Render the reasoning content (e.g. with a Markdown renderer). Defaults to
     * plain pre-wrapped text so YunUI carries no markdown dependency.
     */
    renderContent?: (content: string) => ReactNode;
}

export function ThinkingBlock({ content, isStreaming, defaultOpen = false, renderContent }: ThinkingBlockProps) {
    const t = useYunUI().useT("common.thinking");
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="my-2 rounded-xl border border-border bg-muted/30 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
                <div className={cn(
                    "flex items-center justify-center w-5 h-5 rounded-md bg-muted text-muted-foreground",
                    isStreaming && "animate-pulse"
                )}>
                    <Brain size={11} />
                </div>

                <span className="font-medium whitespace-nowrap">{t("label")}</span>

                {isStreaming && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded whitespace-nowrap">
                        {t("active")}
                    </span>
                )}

                <div className="ml-auto">
                    {isOpen ? (
                        <ChevronUp size={14} className="text-muted-foreground/70" />
                    ) : (
                        <ChevronDown size={14} className="text-muted-foreground/70" />
                    )}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <div className="px-3 pb-2.5 pt-1.5 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
                            {content ? (
                                <div className="text-muted-foreground">
                                    {renderContent ? renderContent(content) : (
                                        <div className="whitespace-pre-wrap">{content}</div>
                                    )}
                                    {isStreaming && (
                                        <motion.span
                                            animate={{ opacity: [0.4, 1, 0.4] }}
                                            transition={{ duration: 1.2, repeat: Infinity }}
                                            className="inline-block w-1 h-3 bg-muted-foreground/60 ml-0.5 align-middle"
                                        />
                                    )}
                                </div>
                            ) : (
                                <span className="italic opacity-50">{t("inProgress")}</span>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
