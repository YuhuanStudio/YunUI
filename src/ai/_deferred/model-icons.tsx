"use client";

import { useState } from "react";
import Image from "next/image";
import {
    MessageSquare, FileText, Hash, Palette, Music,
    Volume2, Mic, Video, Box, Bot, Shuffle, Shield,
    Headphones, Radio,
} from "lucide-react";
import { getIconPath, normalizeProviderId } from "@/components/provider-icons";
import { useCustomProviderIcon } from "@/components/provider-icon-registry";

export function ProviderIconImg({ provider, size = 16 }: { provider: string; size?: number }) {
    const [error, setError] = useState(false);
    const [customError, setCustomError] = useState(false);
    const customIcon = useCustomProviderIcon(provider);
    const normalized = normalizeProviderId(provider);
    // Prefer the registered providerIconMap (handles non-png/cased filenames),
    // fall back to the png-by-convention path for unmapped providers.
    const iconPath = getIconPath(provider) ?? `/icons/providers/${normalized}.png`;

    // An admin-set custom icon (possibly an external URL) wins; render via plain <img>
    // since the host isn't in next/image config. If it fails to load, fall through to
    // the built-in name-based icon below (NOT straight to the initials badge).
    if (customIcon && !customError) {
        return (
            <div className="rounded-md overflow-hidden bg-linear-to-br from-black/2 to-black/5" style={{ width: size, height: size }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={customIcon} alt={provider} width={size} height={size} onError={() => setCustomError(true)} className="object-cover" />
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="rounded-md bg-linear-to-br from-black/5 to-black/10 flex items-center justify-center text-xs font-semibold uppercase"
                style={{ width: size, height: size }}
            >
                {provider.charAt(0)}
            </div>
        );
    }

    return (
        <div className="rounded-md overflow-hidden bg-linear-to-br from-black/2 to-black/5" style={{ width: size, height: size }}>
            <Image
                src={iconPath}
                alt={provider}
                width={size}
                height={size}
                onError={() => setError(true)}
                className="object-cover"
            />
        </div>
    );
}

const MODEL_TYPE_ICONS: Record<string, React.ReactNode> = {
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

export function ModelTypeIcon({ type, size = 16 }: { type: string; size?: number }) {
    const icon = MODEL_TYPE_ICONS[type.toLowerCase()];
    if (icon) {
        return <span className="inline-flex" style={{ transform: size !== 16 ? `scale(${size / 16})` : undefined }}>{icon}</span>;
    }
    return <Bot size={size} className="text-muted-foreground" />;
}
