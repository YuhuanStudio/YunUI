/**
 * The one colour per model capability.
 *
 * `badges.tsx` and `model-card.tsx` each carried their own copy of this table.
 * They happened to still agree — but nothing kept them that way, and a hue
 * added to one would have quietly disagreed with the other. One exported map
 * means a capability is the same colour everywhere it appears.
 *
 * These are a decorative taxonomy, not semantics: there are a dozen of them and
 * no `--vision` token exists or should. They stay on the raw palette on purpose,
 * unlike `--error`/`--success`/`--warning`, which do have tokens and must use
 * them.
 *
 * Every class is written out in full. Building them (`text-${hue}-500`) would
 * be tidier and completely broken: Tailwind scans source text, so a class that
 * only exists after string concatenation is never generated and the colour
 * silently disappears.
 */
export interface CapabilityColor {
    /** `text-*` for a bare glyph. */
    icon: string;
    /** Fill + text + border for a tinted pill. */
    badge: string;
}

export const CAPABILITY_COLORS: Record<string, CapabilityColor> = {
    chat: {
        icon: "text-blue-500",
        badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    streaming: {
        icon: "text-cyan-500",
        badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    },
    function_calling: {
        icon: "text-purple-500",
        badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    vision: {
        icon: "text-amber-500",
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    thinking: {
        icon: "text-pink-500",
        badge: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    },
    image_edit: {
        icon: "text-orange-500",
        badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    },
    negative_prompt: {
        icon: "text-red-500",
        badge: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    },
    seed_control: {
        icon: "text-indigo-500",
        badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    },
    lora: {
        icon: "text-teal-500",
        badge: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    },
    guidance_scale: {
        icon: "text-yellow-500",
        badge: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    },
    strength: {
        icon: "text-orange-500",
        badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    },
    batch: {
        icon: "text-cyan-500",
        badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    },
};

/** Glyph colour for a capability, falling back to the muted tone. */
export function capabilityIconColor(key: string): string {
    return CAPABILITY_COLORS[key]?.icon ?? "text-muted-foreground";
}

/** Tinted pill classes for a capability, falling back to the neutral surface. */
export function capabilityBadgeColor(key: string): string {
    return CAPABILITY_COLORS[key]?.badge ?? "bg-muted text-muted-foreground border-border";
}
