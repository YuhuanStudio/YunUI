"use client";

import { type ReactNode } from "react";
import { cn } from "../lib/cn";

// =====================================================
// MODEL MANAGER CARD
// A card representation of a dense admin "model row" — every column an admin
// table carries (name + ids, provider, developer, type, status, context /
// resolution, max output, price in/out, capabilities, row actions) laid out as
// a card so it reads top-to-bottom on any width instead of a wide scrolling
// table. Domain-agnostic: each value is a slot the consumer fills.
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
    /** Id / alias chips rendered under the name. */
    ids?: ReactNode;
    /** Row-select control (a checkbox), shown at the card's top-left. */
    selectSlot?: ReactNode;
    /** Row actions (edit / enable / inspect / delete …), shown top-right. */
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
    ids,
    selectSlot,
    actions,
    fields,
    capabilities,
    selected,
    className,
}: ModelManagerCardProps) {
    return (
        <div className={cn("card p-4", selected && "ring-2 ring-primary/40 bg-muted/30", className)}>
            {/* Header: select · icon · name (+ ids) · actions */}
            <div className="flex items-start gap-3">
                {selectSlot && <div className="shrink-0 pt-0.5">{selectSlot}</div>}
                {icon && <div className="shrink-0">{icon}</div>}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold truncate leading-tight">{name}</span>
                        {actions && <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">{actions}</div>}
                    </div>
                    {ids && <div className="flex flex-wrap items-center gap-1 mt-1">{ids}</div>}
                </div>
            </div>

            {/* Specs grid (provider/developer/type/status/context/max-output/price…) */}
            {fields && fields.length > 0 && (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-3.5 text-sm">
                    {fields.map((f, i) => (
                        <div key={i} className={cn("min-w-0", f.full && "col-span-2")}>
                            <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{f.label}</dt>
                            <dd className="mt-0.5">{f.value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            {/* Capabilities */}
            {capabilities && (
                <div className="mt-3.5">
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
