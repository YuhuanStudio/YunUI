"use client";

import { type ReactNode } from "react";
import { cn } from "../lib/cn";

// =====================================================
// MODEL MANAGER CARD
// A dense admin "model row" rendered as a card — every column an admin table
// carries (name + ids, provider, developer, type, status, context / resolution,
// max output, price in/out, capabilities, row actions) laid out top-to-bottom so
// model management reads on any width instead of a wide scrolling table.
// Domain-agnostic: every value is a slot the consumer fills.
// =====================================================

/** One labelled spec shown in the card's spec grid. */
export interface ModelManagerField {
    label: ReactNode;
    value: ReactNode;
    /** Span both grid columns (e.g. a long price line). */
    full?: boolean;
}

export interface ModelManagerCardProps {
    /** Leading model icon. */
    icon?: ReactNode;
    /** Model display name (the card title). */
    name: ReactNode;
    /** Inline status badges next to the name (YAML, deprecated, inactive, suspended…). */
    nameBadges?: ReactNode;
    /** Id / alias chips rendered under the name. */
    ids?: ReactNode;
    /** Row-select control (a checkbox). Sits at the left of the top control bar. */
    selectSlot?: ReactNode;
    /** Row actions (edit / enable / inspect / delete …) — sit at the right of the
     *  top control bar (no footer rule). */
    actions?: ReactNode;
    /** Labelled specs — provider, developer, type, status, context/resolution,
     *  max output, price, … — laid out in a 2-column grid. */
    fields?: ModelManagerField[];
    /** Capability badges + an optional label. */
    capabilities?: { label?: ReactNode; value: ReactNode };
    /** Mark the row selected (a ring + tint). */
    selected?: boolean;
    className?: string;
}

/** A model-management row as a card (all admin columns, top-to-bottom). */
export function ModelManagerCard({
    icon,
    name,
    nameBadges,
    ids,
    selectSlot,
    actions,
    fields,
    capabilities,
    selected,
    className,
}: ModelManagerCardProps) {
    return (
        <div
            className={cn(
                "card p-5 transition-shadow hover:shadow-md",
                selected && "ring-2 ring-primary/40 bg-muted/30",
                className,
            )}
        >
            {/* Top control bar: select (left) · actions (right). Keeps both off the
                content so the icon stays flush-left and nothing crowds the bottom. */}
            {(selectSlot || actions) && (
                <div className="flex items-center justify-between gap-2 -mt-2 mb-3 min-h-7">
                    <div className="flex items-center">{selectSlot}</div>
                    {actions && <div className="flex items-center gap-0.5 -mr-1.5 text-muted-foreground">{actions}</div>}
                </div>
            )}

            {/* Identity: icon · name + status badges · id chips */}
            <div className="flex items-start gap-3">
                {icon && <div className="shrink-0">{icon}</div>}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
                        <span className="font-semibold leading-tight">{name}</span>
                        {nameBadges}
                    </div>
                    {ids && <div className="flex flex-wrap items-center gap-1 mt-1.5">{ids}</div>}
                </div>
            </div>

            {/* Specs grid (provider/developer/type/status/context/max-output/price…) */}
            {fields && fields.length > 0 && (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 text-sm">
                    {fields.map((f, i) => (
                        <div key={i} className={cn("min-w-0", f.full && "col-span-2")}>
                            <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{f.label}</dt>
                            <dd className="mt-1">{f.value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            {/* Capabilities */}
            {capabilities && (
                <div className="mt-4">
                    {capabilities.label && (
                        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">{capabilities.label}</div>
                    )}
                    <div className="flex flex-wrap gap-1.5">{capabilities.value}</div>
                </div>
            )}
        </div>
    );
}

export default ModelManagerCard;
