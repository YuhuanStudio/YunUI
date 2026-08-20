"use client";

import { Eye, EyeOff, Clock, CheckCircle, XCircle, Zap, FileText, FileCode, MessageSquare, Waves, Code, Brain, Ban, Fingerprint, Layers, SlidersHorizontal, Image as ImageIcon, Award, DatabaseZap } from "lucide-react";
import { useYunUI } from "../adapters/context";
import { capabilityIconColor, capabilityBadgeColor } from "../ai/capability-colors";

/*
 * Light-mode ink is -700, not -600. These pills sit on a 10% tint of the same
 * hue, and axe measured the -600 inks below the 4.5:1 AA floor on the brighter
 * ones (amber 2.96:1, cyan 3.29:1) against the tint. Dark mode keeps -400,
 * where the tint is on a dark surface and the contrast runs the other way.
 * Matches ai/capability-colors.ts.
 */
// Fellow recognition badge — the standing mark of an approved Fellows-tier member.
export function FellowBadge({ variant = "inline", className = "" }: { variant?: "inline" | "pill"; className?: string }) {
    const t = useYunUI().useT("components.badges");
    if (variant === "pill") {
        return (
            <span className={`badge inline-flex items-center gap-1 text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 ${className}`}>
                <Award size={11} className="text-amber-600" />
                {t("fellow")}
            </span>
        );
    }
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 ${className}`}>
            <Award size={10} className="text-amber-600" />
            {t("fellow")}
        </span>
    );
}

// Capability badge with color and icon
export function CapabilityBadge({ capability, short = false }: { capability: string; short?: boolean }) {
    void short;
    const t = useYunUI().useT("components.badges");

    const configs: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; iconColor: string; color: string; labelKey: string }> = {
        chat: { icon: MessageSquare, iconColor: capabilityIconColor("chat"), color: capabilityBadgeColor("chat"), labelKey: "chat" },
        streaming: { icon: Waves, iconColor: capabilityIconColor("streaming"), color: capabilityBadgeColor("streaming"), labelKey: "streaming" },
        function_calling: { icon: Code, iconColor: capabilityIconColor("function_calling"), color: capabilityBadgeColor("function_calling"), labelKey: "functionCalling" },
        vision: { icon: Eye, iconColor: capabilityIconColor("vision"), color: capabilityBadgeColor("vision"), labelKey: "vision" },
        thinking: { icon: Brain, iconColor: capabilityIconColor("thinking"), color: capabilityBadgeColor("thinking"), labelKey: "thinking" },
        image_edit: { icon: ImageIcon, iconColor: capabilityIconColor("image_edit"), color: capabilityBadgeColor("image_edit"), labelKey: "imageEdit" },
        // Whether the model CAN reuse a cached prompt — a separate question from what caching
        // costs. An unquoted or zero cache price says nothing about the capability.
        prompt_caching: { icon: DatabaseZap, iconColor: capabilityIconColor("prompt_caching"), color: capabilityBadgeColor("prompt_caching"), labelKey: "promptCaching" },
        context_caching: { icon: DatabaseZap, iconColor: capabilityIconColor("context_caching"), color: capabilityBadgeColor("context_caching"), labelKey: "contextCaching" },
        negative_prompt: { icon: Ban, iconColor: capabilityIconColor("negative_prompt"), color: capabilityBadgeColor("negative_prompt"), labelKey: "negativePrompt" },
        seed_control: { icon: Fingerprint, iconColor: capabilityIconColor("seed_control"), color: capabilityBadgeColor("seed_control"), labelKey: "seedControl" },
        lora: { icon: Layers, iconColor: capabilityIconColor("lora"), color: capabilityBadgeColor("lora"), labelKey: "loraSupport" },
        guidance_scale: { icon: SlidersHorizontal, iconColor: capabilityIconColor("guidance_scale"), color: capabilityBadgeColor("guidance_scale"), labelKey: "guidanceScale" },
        strength: { icon: SlidersHorizontal, iconColor: capabilityIconColor("strength"), color: capabilityBadgeColor("strength"), labelKey: "strength" },
        batch: { icon: Waves, iconColor: capabilityIconColor("batch"), color: capabilityBadgeColor("batch"), labelKey: "batchGeneration" },
    };

    const config = configs[capability];
    if (!config) return null;

    const Icon = config.icon;

    return (
        <span className={`badge inline-flex items-center gap-1 text-xs ${config.color}`}>
            <Icon size={10} className={config.iconColor} />
            {t(config.labelKey)}
        </span>
    );
}

// Status badge for approval status
export function StatusBadge({ status, size = "sm" }: { status: string; size?: "sm" | "md" }) {
    const t = useYunUI().useT("components.badges");

    const configs: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; color: string; labelKey: string }> = {
        pending: { icon: Clock, color: "badge-warning", labelKey: "pending" },
        approved: { icon: CheckCircle, color: "badge-success", labelKey: "approved" },
        auto_approved: { icon: Zap, color: "badge-info", labelKey: "autoApproved" },
        rejected: { icon: XCircle, color: "badge-error", labelKey: "rejected" },
    };

    const config = configs[status];
    if (!config) return null;

    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Icon size={size === "sm" ? 12 : 14} />
            {t(config.labelKey)}
        </span>
    );
}

// Source badge (YAML, API, etc.)
export function SourceBadge({ source, showIcon = true }: { source: string; showIcon?: boolean }) {
    const t = useYunUI().useT("common.badge");

    const configs: Record<string, { icon: React.ComponentType<{ size?: number }>; color: string; label: string }> = {
        yaml: { icon: FileCode, color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20", label: t("yaml") },
        api: { icon: FileText, color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20", label: t("api") },
    };

    const config = configs[source.toLowerCase()];
    if (!config) return null;

    const Icon = config.icon;

    return (
        <span className={`badge flex items-center gap-1 ${config.color}`}>
            {showIcon && <Icon size={10} />}
            {config.label}
        </span>
    );
}

// Active status badge
export function ActiveBadge({ isActive }: { isActive: boolean }) {
    const t = useYunUI().useT("components.badges");

    return (
        <span className={`badge flex items-center gap-1 ${isActive ? "badge-success" : ""}`}>
            {isActive ? <Eye size={10} /> : <EyeOff size={10} />}
            {isActive ? t("active") : t("inactive")}
        </span>
    );
}

// Deprecated badge
export function DeprecatedBadge({ isDeprecated }: { isDeprecated: boolean }) {
    const t = useYunUI().useT("components.badges");

    if (!isDeprecated) return null;

    return <span className="badge">{t("deprecated")}</span>;
}
