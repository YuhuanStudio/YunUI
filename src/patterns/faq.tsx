"use client";
import { useState } from "react";
import { Plus as PlusIcon } from "lucide-react";
import { cn } from "../lib/cn";

export interface FAQItem {
    question: string;
    answer: React.ReactNode;
}

export interface FAQProps {
    /** The questions to render. The host app supplies (and translates) these. */
    items: FAQItem[];
    /** Which item starts expanded (default: first). Pass null for all collapsed. */
    defaultOpenIndex?: number | null;
}

export function FAQ({ items, defaultOpenIndex = 0 }: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
    const faqs = items;

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
                <div
                    key={i}
                    className={cn(
                        "glass-card overflow-hidden transition-all duration-300",
                        openIndex === i ? "bg-card/60 ring-1 ring-accent-muted" : "hover:bg-card/50"
                    )}
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full flex items-center justify-between p-6 text-left gap-4"
                    >
                        <span className="font-semibold text-foreground flex-1 min-w-0">{faq.question}</span>
                        <span className={cn("text-muted-foreground transition-transform duration-300 shrink-0", openIndex === i ? "rotate-45" : "")}>
                            <PlusIcon className="w-5 h-5" />
                        </span>
                    </button>

                    <div
                        className={cn(
                            "px-6 text-muted-foreground text-sm leading-relaxed overflow-hidden transition-all duration-300",
                            openIndex === i ? "max-h-60 pb-6 opacity-100" : "max-h-0 opacity-0"
                        )}
                    >
                        {faq.answer}
                    </div>
                </div>
            ))}
        </div>
    );
}
