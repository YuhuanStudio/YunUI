"use client";

import { type ReactNode } from "react";
import { cn } from "../lib/cn";
import {
    llmCapabilityConfig,
    imageCapabilityConfig,
    audioCapabilityConfig,
    videoCapabilityConfig,
    musicCapabilityConfig,
    threedCapabilityConfig,
    realtimeCapabilityConfig,
} from "./capability-selector";

// Flatten every capability config into one lookup, so a capability's icon +
// color is defined ONCE (the same source CapabilitySelector uses) and renders
// identically everywhere — model rows, filter chips, standalone badges. Apps no
// longer keep their own copy of the mapping.
const CAPABILITY_BY_KEY: Record<string, { value: string; icon: React.ComponentType<{ size?: number; className?: string }>; iconColor: string; color: string }> =
    Object.fromEntries(
        [
            ...llmCapabilityConfig,
            ...imageCapabilityConfig,
            ...audioCapabilityConfig,
            ...videoCapabilityConfig,
            ...musicCapabilityConfig,
            ...threedCapabilityConfig,
            ...realtimeCapabilityConfig,
        ].map((c) => [c.value, c]),
    );

/** Whether a capability key has a known icon/color in the design system. */
export function isKnownCapability(capability: string): boolean {
    return capability in CAPABILITY_BY_KEY;
}

/** Just the colored capability glyph — e.g. the inline icons shown after a model
 *  name. Renders nothing for an unknown capability. */
export function CapabilityIcon({
    capability,
    size = 14,
    className,
}: {
    capability: string;
    size?: number;
    className?: string;
}) {
    const cfg = CAPABILITY_BY_KEY[capability];
    if (!cfg) return null;
    const Icon = cfg.icon;
    return <Icon size={size} className={cn(cfg.iconColor, "shrink-0", className)} />;
}

/** A capability pill: colored glyph + tinted background + label. The consumer
 *  supplies the translated `label` (YunUI stays i18n-agnostic). Renders nothing
 *  for an unknown capability. */
export function CapabilityBadge({
    capability,
    label,
    iconSize = 10,
    className,
}: {
    capability: string;
    label?: ReactNode;
    iconSize?: number;
    className?: string;
}) {
    const cfg = CAPABILITY_BY_KEY[capability];
    if (!cfg) return null;
    const Icon = cfg.icon;
    return (
        <span className={cn("badge inline-flex items-center gap-1 text-xs", cfg.color, className)}>
            <Icon size={iconSize} className={cfg.iconColor} />
            {label}
        </span>
    );
}
