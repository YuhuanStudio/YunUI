"use client";

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

// NOTE: the labelled pill lives in `yunui/patterns` as `CapabilityBadge`
// (it auto-labels via the adapter's `useT`). This module intentionally only adds
// the glyph-only `CapabilityIcon`, which patterns didn't have.
