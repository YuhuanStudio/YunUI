"use client";

import { type ReactNode } from "react";
import { AlertCircle, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

// =====================================================
// FEATURE LOCKED STATE
// The centered "this feature isn't available to you" screen — an icon medallion,
// a title, a description, and an optional dashed "restricted" note card. Pure
// presentation; the host owns the feature-flag check and renders this as the
// fallback when a feature is off.
// =====================================================

export interface FeatureLockedStateProps {
    /** Glyph inside the top medallion (defaults to a sparkles icon). */
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    /** Heading of the dashed note card; the card shows when this or `noteText` is set. */
    noteTitle?: ReactNode;
    /** Body of the dashed note card. */
    noteText?: ReactNode;
    className?: string;
}

export function FeatureLockedState({ icon, title, description, noteTitle, noteText, className }: FeatureLockedStateProps) {
    return (
        <div className={cn("flex items-center justify-center min-h-[60vh]", className)}>
            <div className="text-center max-w-md mx-auto p-8">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    {icon ?? <Sparkles className="w-8 h-8 text-muted-foreground" />}
                </div>
                <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                {description && <p className="text-muted-foreground mb-6">{description}</p>}
                {(noteTitle || noteText) && (
                    <div className="card p-4 bg-muted/30 border border-dashed">
                        <div className="flex items-start gap-3 text-sm text-muted-foreground">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="text-left">
                                {noteTitle && <p className="font-medium mb-1">{noteTitle}</p>}
                                {noteText && <p>{noteText}</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
