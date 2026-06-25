"use client";

import { MessageSquare, Waves, Code, Eye, Brain, Ban, Fingerprint, Layers, SlidersHorizontal, Pencil, Radio, Mic, Video, Music, Box } from "lucide-react";
import { useYunUI } from "../adapters/context";

interface CapabilitySelectorProps {
    /** Currently selected capability keys (controlled). */
    selected: string[];
    /** Called with the next selection when a capability is toggled. */
    onChange: (capabilities: string[]) => void;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
    /** Button size: `sm` or `md` (default). */
    size?: "sm" | "md";
    /** Grid column count. @defaultValue 4 */
    columns?: 2 | 3 | 4;
    /** Filters which capability set is shown (e.g. "image_generation", "audio", "video"). Defaults to the LLM set. */
    modelType?: string;
}

// Icon and color configurations (static)
const llmCapabilityConfig = [
    { value: "chat", icon: MessageSquare, iconColor: "text-blue-500", color: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20" },
    { value: "streaming", icon: Waves, iconColor: "text-cyan-500", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 hover:bg-cyan-500/20" },
    { value: "function_calling", icon: Code, iconColor: "text-purple-500", color: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20" },
    { value: "vision", icon: Eye, iconColor: "text-amber-500", color: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20" },
    { value: "thinking", icon: Brain, iconColor: "text-pink-500", color: "bg-pink-500/10 text-pink-600 border-pink-500/20 hover:bg-pink-500/20" },
];

const imageCapabilityConfig = [
    { value: "image_edit", icon: Pencil, iconColor: "text-orange-500", color: "bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20" },
    { value: "negative_prompt", icon: Ban, iconColor: "text-red-500", color: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20" },
    { value: "seed_control", icon: Fingerprint, iconColor: "text-indigo-500", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/20" },
    { value: "lora", icon: Layers, iconColor: "text-teal-500", color: "bg-teal-500/10 text-teal-600 border-teal-500/20 hover:bg-teal-500/20" },
    { value: "guidance_scale", icon: SlidersHorizontal, iconColor: "text-yellow-500", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20" },
    { value: "strength", icon: SlidersHorizontal, iconColor: "text-orange-500", color: "bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20" },
    { value: "batch", icon: Waves, iconColor: "text-cyan-500", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 hover:bg-cyan-500/20" },
];

const audioCapabilityConfig = [
    { value: "tts", icon: Mic, iconColor: "text-green-500", color: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20" },
    { value: "stt", icon: MessageSquare, iconColor: "text-blue-500", color: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20" },
    { value: "audio_translation", icon: Waves, iconColor: "text-purple-500", color: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20" },
];

const videoCapabilityConfig = [
    { value: "video_generation", icon: Video, iconColor: "text-red-500", color: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20" },
];

const musicCapabilityConfig = [
    { value: "music_generation", icon: Music, iconColor: "text-pink-500", color: "bg-pink-500/10 text-pink-600 border-pink-500/20 hover:bg-pink-500/20" },
];

const threedCapabilityConfig = [
    { value: "threed_generation", icon: Box, iconColor: "text-indigo-500", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/20" },
];

const realtimeCapabilityConfig = [
    { value: "realtime_voice", icon: Radio, iconColor: "text-yellow-500", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20" },
];

/** Multi-select grid of toggleable model capabilities; the option set adapts to `modelType`. */
export function CapabilitySelector({ selected, onChange, disabled = false, size = "md", columns = 4, modelType }: CapabilitySelectorProps) {
    const t = useYunUI().useT("capabilities");

    const toggleCapability = (cap: string) => {
        if (disabled) return;

        onChange(
            selected.includes(cap)
                ? selected.filter(c => c !== cap)
                : [...selected, cap]
        );
    };

    // Build capabilities with translated labels
    const buildCapabilities = (config: typeof llmCapabilityConfig) => {
        return config.map(cap => ({
            ...cap,
            label: t(cap.value)
        }));
    };

    // Determine which capabilities to show based on model type
    const getCapabilities = () => {
        switch (modelType) {
            case "image_generation":
                return buildCapabilities(imageCapabilityConfig);
            case "audio":
            case "tts":
            case "stt":
                return buildCapabilities(audioCapabilityConfig);
            case "video":
            case "video_generation":
                return buildCapabilities(videoCapabilityConfig);
            case "music":
            case "music_generation":
                return buildCapabilities(musicCapabilityConfig);
            case "3d":
            case "threed":
            case "threed_generation":
                return buildCapabilities(threedCapabilityConfig);
            case "realtime":
            case "realtime_voice":
                return buildCapabilities(realtimeCapabilityConfig);
            default:
                return buildCapabilities(llmCapabilityConfig);
        }
    };

    const capabilityOptions = getCapabilities();

    const sizeClasses = size === "sm" ? "p-2.5 text-xs gap-1.5" : "p-3 text-sm gap-2";
    const iconSize = size === "sm" ? 14 : 16;

    // Mobile-first ramp (static classes for purging): fewer columns on a phone,
    // the requested count at sm+ — so capability chips don't crush on narrow screens.
    const gridColsClass = {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-2 sm:grid-cols-3",
        4: "grid-cols-2 sm:grid-cols-4",
        5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
        6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
    }[columns] || "grid-cols-2 sm:grid-cols-3";

    return (
        <div className={`grid ${gridColsClass} gap-2`}>
            {capabilityOptions.map(cap => {
                const isSelected = selected.includes(cap.value);
                const Icon = cap.icon;
                return (
                    <button
                        key={cap.value}
                        type="button"
                        onClick={() => toggleCapability(cap.value)}
                        disabled={disabled}
                        className={`rounded-lg border text-left transition-all flex items-center ${sizeClasses} ${
                            isSelected
                                ? cap.color
                                : "bg-background border-border hover:bg-muted/50"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <Icon size={iconSize} className={`${isSelected ? "" : cap.iconColor} shrink-0`} />
                        <span className="font-medium">{cap.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

// Export configs for use in other components
export { llmCapabilityConfig, imageCapabilityConfig, audioCapabilityConfig, videoCapabilityConfig, musicCapabilityConfig, threedCapabilityConfig, realtimeCapabilityConfig };
