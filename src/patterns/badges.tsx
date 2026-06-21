"use client";

import { Eye, EyeOff, Clock, CheckCircle, XCircle, Zap, FileText, FileCode, MessageSquare, Waves, Code, Brain, Ban, Fingerprint, Layers, SlidersHorizontal, Image as ImageIcon, Award } from "lucide-react";
import { useYunUI } from "../adapters/context";

// Fellow recognition badge — the standing mark of an approved Fellows-tier member.
export function FellowBadge({ variant = "inline", className = "" }: { variant?: "inline" | "pill"; className?: string }) {
    const t = useYunUI().useT("components.badges");
    if (variant === "pill") {
        return (
            <span className={`badge inline-flex items-center gap-1 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 ${className}`}>
                <Award size={11} className="text-amber-500" />
                {t("fellow")}
            </span>
        );
    }
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 ${className}`}>
            <Award size={10} className="text-amber-500" />
            {t("fellow")}
        </span>
    );
}

// Capability badge with color and icon
export function CapabilityBadge({ capability, short = false }: { capability: string; short?: boolean }) {
    void short;
    const t = useYunUI().useT("components.badges");

    const configs: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; iconColor: string; color: string; labelKey: string }> = {
        chat: { icon: MessageSquare, iconColor: "text-blue-500", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", labelKey: "chat" },
        streaming: { icon: Waves, iconColor: "text-cyan-500", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20", labelKey: "streaming" },
        function_calling: { icon: Code, iconColor: "text-purple-500", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", labelKey: "functionCalling" },
        vision: { icon: Eye, iconColor: "text-amber-500", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", labelKey: "vision" },
        thinking: { icon: Brain, iconColor: "text-pink-500", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20", labelKey: "thinking" },
        image_edit: { icon: ImageIcon, iconColor: "text-orange-500", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20", labelKey: "imageEdit" },
        negative_prompt: { icon: Ban, iconColor: "text-red-500", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", labelKey: "negativePrompt" },
        seed_control: { icon: Fingerprint, iconColor: "text-indigo-500", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20", labelKey: "seedControl" },
        lora: { icon: Layers, iconColor: "text-teal-500", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20", labelKey: "loraSupport" },
        guidance_scale: { icon: SlidersHorizontal, iconColor: "text-yellow-500", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20", labelKey: "guidanceScale" },
        strength: { icon: SlidersHorizontal, iconColor: "text-orange-500", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20", labelKey: "strength" },
        batch: { icon: Waves, iconColor: "text-cyan-500", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20", labelKey: "batchGeneration" },
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
        yaml: { icon: FileCode, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", label: t("yaml") },
        api: { icon: FileText, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", label: t("api") },
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
