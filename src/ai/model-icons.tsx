"use client";

import { type ReactNode } from "react";
import {
    MessageSquare, FileText, Hash, Palette, Music,
    Volume2, Mic, Video, Box, Bot, Shuffle, Shield,
    Headphones, Radio,
} from "lucide-react";
import { ProviderIcon } from "./provider-icons";

/**
 * Rounded provider icon — a thin alias over the canonical {@link ProviderIcon}
 * (rounded avatar style). Kept for call sites that prefer the short name.
 */
export function ProviderIconImg({ provider, size = 16 }: { provider: string; size?: number }) {
    return <ProviderIcon provider={provider} size={size} rounded />;
}

const MODEL_TYPE_ICONS: Record<string, ReactNode> = {
    chat: <MessageSquare size={16} className="text-blue-500" />,
    completion: <FileText size={16} className="text-gray-500" />,
    embedding: <Hash size={16} className="text-purple-500" />,
    image_generation: <Palette size={16} className="text-pink-500" />,
    audio: <Headphones size={16} className="text-orange-500" />,
    tts: <Volume2 size={16} className="text-green-500" />,
    stt: <Mic size={16} className="text-red-500" />,
    video: <Video size={16} className="text-cyan-500" />,
    video_generation: <Video size={16} className="text-cyan-400" />,
    music_generation: <Music size={16} className="text-orange-400" />,
    rerank: <Shuffle size={16} className="text-indigo-500" />,
    moderation: <Shield size={16} className="text-yellow-500" />,
    "3d": <Box size={16} className="text-amber-500" />,
    realtime: <Radio size={16} className="text-yellow-400" />,
};

/** Capability/type icon for a model (chat, embedding, tts, …). */
export function ModelTypeIcon({ type, size = 16 }: { type: string; size?: number }) {
    const icon = MODEL_TYPE_ICONS[type.toLowerCase()];
    if (icon) {
        return <span className="inline-flex" style={{ transform: size !== 16 ? `scale(${size / 16})` : undefined }}>{icon}</span>;
    }
    return <Bot size={size} className="text-muted-foreground" />;
}
