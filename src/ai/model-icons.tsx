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

/*
 * -600, not -500/-400. These glyphs carry meaning (they are how a reader tells
 * a chat model from an embedding one), so WCAG SC 1.4.11 asks for 3:1 against
 * the surface — and on white, -500 lands under that for the bright hues
 * (cyan-500 is 2.4:1). Same reasoning as ai/capability-colors.ts.
 */
const MODEL_TYPE_ICONS: Record<string, ReactNode> = {
    chat: <MessageSquare size={16} className="text-blue-600" />,
    completion: <FileText size={16} className="text-gray-600" />,
    embedding: <Hash size={16} className="text-purple-600" />,
    image_generation: <Palette size={16} className="text-pink-600" />,
    audio: <Headphones size={16} className="text-orange-600" />,
    tts: <Volume2 size={16} className="text-green-600" />,
    stt: <Mic size={16} className="text-red-600" />,
    video: <Video size={16} className="text-cyan-600" />,
    video_generation: <Video size={16} className="text-cyan-600" />,
    music_generation: <Music size={16} className="text-orange-600" />,
    rerank: <Shuffle size={16} className="text-indigo-600" />,
    moderation: <Shield size={16} className="text-yellow-600" />,
    "3d": <Box size={16} className="text-amber-600" />,
    realtime: <Radio size={16} className="text-yellow-600" />,
};

/** Capability/type icon for a model (chat, embedding, tts, …). */
export function ModelTypeIcon({ type, size = 16 }: { type: string; size?: number }) {
    const icon = MODEL_TYPE_ICONS[type.toLowerCase()];
    if (icon) {
        return <span className="inline-flex" style={{ transform: size !== 16 ? `scale(${size / 16})` : undefined }}>{icon}</span>;
    }
    return <Bot size={size} className="text-muted-foreground" />;
}
