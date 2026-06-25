"use client";

import { useState } from "react";
// Provider icons - resolves image files from /icons/providers and /icons/models.
// The host app must serve those assets (bundle them under public/icons).
import { useYunUI } from "../adapters/context";

// Developer to icon file mapping (for fallback)
const developerIconMap: Record<string, string> = {
    // Major AI companies
    openai: "openai.png",
    anthropic: "anthropic.png",
    google: "google.svg",
    gemini: "gemini.svg",
    gemma: "gemma.svg",
    "deepseek": "deepseek.svg",
    qwen: "qwen.svg",
    mistral: "mistral.svg",
    "01.ai": "zero-one.svg",
    "zero-one": "zero-one.svg",
    xai: "grok.png",

    // Chinese companies
    zhipu: "zhipu.svg",
    moonshot: "moonshot.png",
    baichuan: "baichuan.svg",
    alibaba: "dashscope.png",
    minimax: "minimax.svg",
    volcengine: "volcengine.svg",
    bytedance: "byte_dance.svg",
    baidu: "wenxin.svg",  // baidu-cloud.svg only exists under /icons/providers/; ERNIE/Wenxin icon lives in /icons/models/
    tencent: "dianxin.png",
    doubao: "doubao.svg",
    hunyuan: "hunyuan.svg",
    sparkdesk: "sparkdesk.png",
    wenxin: "wenxin.svg",
    stepfun: "step.svg",

    // Research organizations
    ai21: "ai21.svg",
    adept: "adept.png",
    aisingapore: "aisingapore.png",
    bigcode: "bigcode.png",
    codegeex: "codegeex.svg",
    cohere: "cohere.svg",
    dbrx: "dbrx.svg",
    gryphe: "gryphe.png",
    hailuo: "hailuo.svg",
    internlm: "internlm.svg",
    jina: "jina.png",
    nvidia: "nvidia.svg",
    rakutenai: "rakutenai.png",
    upstage: "upstage.svg",
    voyageai: "voyageai.svg",
    xirang: "xirang.png",
    yi: "zero-one.svg",
    zai: "zai.png",

    // Image/Audio/Video models
    chatgpt: "chatgpt.jpeg",
    dalle: "dalle.svg",
    flux: "flux.png",
    ideogram: "ideogram.svg",
    keling: "keling.png",
    luma: "luma.svg",
    midjourney: "midjourney.png",
    stability: "stability.svg",
    suno: "suno.png",
    vidu: "vidu.svg",
    tokenflux: "tokenflux.png",

    // Other
    huggingface: "huggingface.svg",
    meta: "llama.png",
    facebook: "llama.png",  // no meta.png under /icons/models/; Meta/Facebook family uses the Llama icon
    microsoft: "microsoft.svg",
    ibm: "ibm.png",
    github: "copilot.svg",
    tele: "tele.png",
    ling: "ling.png",
    mimo: "mimo.svg",
    pangu: "pangu.svg",
    xiaomi: "xiaomi.png",

    // Model-family icons with dedicated art under /icons/models/
    claude: "claude.svg",
    codestral: "codestral.png",
    mixtral: "mixtral.png",
    pixtral: "pixtral.png",
    llava: "llava.svg",
    palm: "palm.svg",
    chatglm: "chatglm.svg",
    internvl: "internvl.png",
    minicpm: "minicpm.webp",
    nousresearch: "nousresearch.png",
};

// Get icon path for developer (returns full path under /icons/models/).
// This is the canonical developer-icon resolver shared with ModelIcon/ModelAvatar,
// so a developer label/badge always matches the model avatar's developer icon.
export function getDeveloperIconPath(developer: string | null | undefined): string | null {
    if (!developer) return null;
    const file = getDeveloperIconFile(developer);
    return file ? `/icons/models/${file}` : null;
}

// Get icon filename for developer (returns just the filename)
function getDeveloperIconFile(developer: string): string | null {
    if (!developer) return null;
    const normalized = developer.toLowerCase().replace(/[-_\s]/g, "");

    // Direct match
    if (developerIconMap[normalized]) {
        return developerIconMap[normalized];
    }

    // Partial match: the input must CONTAIN a known key of >=3 chars; prefer the
    // longest match. Avoids false positives like "ai" -> openai or "x" -> grok
    // that the old bidirectional substring check produced.
    let best: { key: string; file: string } | null = null;
    for (const [key, file] of Object.entries(developerIconMap)) {
        if (key.length >= 3 && normalized.includes(key) && (!best || key.length > best.key.length)) {
            best = { key, file };
        }
    }
    if (best) return best.file;

    return null;
}

// Provider to icon file mapping
const providerIconMap: Record<string, string> = {
    // Major providers
    openai: "openai.png",
    anthropic: "anthropic.png",
    google: "google.svg",
    gemini: "gemini.svg",
    deepseek: "deepseek.svg",
    mistral: "mistral.svg",
    groq: "groq.png",
    grok: "grok.png",
    xai: "grok.png",

    // Cloud providers
    azure: "github.png",
    "azure-openai": "github.png",
    aws: "github.png",
    bedrock: "github.png",

    // Chinese providers
    zhipu: "zhipu.svg",
    moonshot: "moonshot.png",
    baichuan: "baichuan.svg",
    alibaba: "dashscope.png",
    qwen: "dashscope.png",
    dashscope: "dashscope.png",
    minimax: "minimax.svg",
    volcengine: "volcengine.svg",
    doubao: "doubao.svg",
    bytedance: "bytedance.svg",
    baidu: "baidu-cloud.svg",

    // Other providers
    nvidia: "nvidia.svg",
    huggingface: "huggingface.svg",
    ollama: "ollama.png",
    lmstudio: "lmstudio.png",
    openrouter: "openrouter.png",
    tokenrouter: "tokenrouter.png",
    together: "together.svg",
    cohere: "cohere.svg",
    perplexity: "perplexity.svg",
    fireworks: "fireworks.svg",
    github: "github.png",
    jina: "jina.png",
    modelscope: "modelscope.svg",
    siliconflow: "silicon.svg",
    silicon: "silicon.svg",
    cerebras: "cerebras.svg",
    hyperbolic: "hyperbolic.svg",
    lepton: "lepton.png",
    cloudflare: "cloudflare.svg",
    vllm: "vllm.svg",
    zai: "zai.png",

    // Image/special
    step: "step.svg",
    "zero-one": "zero-one.svg",
    yi: "zero-one.svg",
    infini: "infini.svg",

    // Additional providers / gateways with icons under /icons/providers/.
    // Keys are normalized (lowercase, separators stripped) to match getIconPath().
    xiaomi: "Xiaomi.png",
    intel: "intel.png",
    nomic: "nomic.png",
    mixedbread: "mixedbread.png",
    lanyun: "lanyun.png",
    newapi: "newapi.svg",
    ocoolai: "ocoolai.png",
    ph8: "ph8.png",
    ppio: "ppio.svg",
    vertexai: "vertexai.svg",
    gcp: "vertexai.svg",
    "302ai": "302ai.svg",
    aihubmix: "aihubmix.svg",
    dmxapi: "DMXAPI.png",
    bailian: "bailian.svg",
    bigmodel: "bigModel.svg",
    burncloud: "burncloud.svg",
    cherryin: "cherryin.png",
    giteeai: "gitee-ai.png",
    qiniu: "qiniu.svg",
    sophnet: "sophnet.svg",
    longcat: "longcat.svg",
    alayanew: "alayanew.webp",
    cephalon: "cephalon.jpeg",
    mcprouter: "mcprouter.webp",
    gpustack: "gpustack.svg",
    kwaipilot: "Kwaipilot.png",
    tencentcloudti: "tencent-cloud-ti.svg",
    neteaseyoudao: "netease-youdao.svg",
    aionly: "aiOnly.webp",
};

// Distinct built-in provider icons for an icon picker. Deduped by file so each
// visual icon appears once; value is the resolvable /icons/providers/<file> path.
export function getProviderIconOptions(): { value: string; label: string }[] {
    const seen = new Set<string>();
    const out: { value: string; label: string }[] = [];
    for (const [key, file] of Object.entries(providerIconMap)) {
        if (seen.has(file)) continue;
        seen.add(file);
        out.push({ value: `/icons/providers/${file}`, label: key });
    }
    return out.sort((a, b) => a.label.localeCompare(b.label));
}

// Canonical provider-id normalization (lowercase, strip dashes/underscores/spaces).
// Single source of truth — the icon registry's producer keys and the lookup here must
// use the identical rule, so share this rather than re-inlining the regex.
export function normalizeProviderId(id: string | null | undefined): string {
    // Guard against undefined/null ids (e.g. a model record with no provider yet)
    // so icon components degrade to a fallback instead of crashing the page.
    return (id ?? "").toLowerCase().replace(/[-_\s]/g, "");
}

// Get icon path for provider (resolves to /icons/providers/<file> via providerIconMap)
export function getIconPath(providerId: string | null | undefined): string | null {
    const normalized = normalizeProviderId(providerId);
    if (!normalized) return null;

    // Direct match
    if (providerIconMap[normalized]) {
        return `/icons/providers/${providerIconMap[normalized]}`;
    }

    // Partial match: input must contain a known key (>=3 chars); prefer longest.
    let best: { key: string; file: string } | null = null;
    for (const [key, file] of Object.entries(providerIconMap)) {
        if (key.length >= 3 && normalized.includes(key) && (!best || key.length > best.key.length)) {
            best = { key, file };
        }
    }
    if (best) return `/icons/providers/${best.file}`;

    return null;
}

/**
 * Rewrites a built-in `/icons/...` path to the consumer-configured icon base
 * (from `useYunUI().iconBasePath`). Custom/absolute URLs (http…, data:…, or any
 * path not under `/icons`) pass through unchanged.
 */
function applyIconBase(path: string | null, base: string): string | null {
    if (!path || base === "/icons") return path;
    return path.startsWith("/icons/") ? base + path.slice(6) : path;
}

interface ProviderIconProps {
    /** Provider id; resolved to a built-in icon by name (e.g. "openai", "anthropic"). */
    provider: string;
    className?: string;
    /** Icon size in pixels. @defaultValue 20 */
    size?: number;
    /** Render as a rounded avatar tile with a subtle background. */
    rounded?: boolean;
    /** Custom icon URL that overrides the built-in lookup (falls back on load error). */
    iconUrl?: string | null;
}

/** Provider logo resolved by id (or a custom `iconUrl`), with a letter/SVG fallback for unknown providers. */
export function ProviderIcon({
    provider,
    className = "",
    size = 20,
    rounded = false,
    iconUrl,
}: ProviderIconProps) {
    // Custom icon URL takes priority when provided as a prop. (Yunxin's app-wide
    // admin-set icon registry is consumer-specific and not bundled here.)
    const { Image, iconBasePath } = useYunUI();
    const [customError, setCustomError] = useState(false);
    // When the built-in icon asset 404s (icons aren't bundled — host them or set
    // iconBasePath), degrade to the initial/SVG fallback instead of a broken img.
    const [pathError, setPathError] = useState(false);
    const effectiveIconUrl = iconUrl;
    // If the custom icon fails to load, fall through to the built-in name-based icon.
    if (effectiveIconUrl && !customError) {
        if (rounded) {
            const getRadius = () => (size <= 14 ? 'rounded-sm' : size <= 20 ? 'rounded-md' : 'rounded-lg');
            return (
                <div
                    className={`${getRadius()} overflow-hidden bg-linear-to-br from-black/2 to-black/5 flex items-center justify-center ${className}`}
                    style={{ width: size, height: size }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={effectiveIconUrl} alt={provider} width={size} height={size} className="object-cover" onError={() => setCustomError(true)} />
                </div>
            );
        }
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={effectiveIconUrl} alt={provider} width={size} height={size} className={`object-contain ${className}`} onError={() => setCustomError(true)} />;
    }

    const iconPath = applyIconBase(getIconPath(provider), iconBasePath);

    // Dynamic border radius based on size for consistent square look
    const getRadiusClass = () => {
        if (size <= 14) return 'rounded-sm';  // 2px for very small icons
        if (size <= 20) return 'rounded-md';  // 6px for small icons
        return 'rounded-lg';                 // 8px for larger icons
    };

    if (iconPath && !pathError) {
        if (rounded) {
            return (
                <div
                    className={`${getRadiusClass()} overflow-hidden bg-linear-to-br from-black/2 to-black/5 flex items-center justify-center ${className}`}
                    style={{ width: size, height: size }}
                >
                    <Image
                        src={iconPath}
                        alt={provider}
                        width={size}
                        height={size}
                        className="object-cover"
                        unoptimized
                        onError={() => setPathError(true)}
                    />
                </div>
            );
        }

        return (
            <Image
                src={iconPath}
                alt={provider}
                width={size}
                height={size}
                className={`object-contain ${className}`}
                unoptimized
                onError={() => setPathError(true)}
            />
        );
    }

    // Fallback SVG for unknown providers
    if (rounded) {
        return (
            <div
                className={`${getRadiusClass()} bg-linear-to-br from-black/5 to-black/10 flex items-center justify-center ${className}`}
                style={{ width: size, height: size }}
            >
                <span className="text-xs font-medium text-muted-foreground">{(provider || "?").charAt(0).toUpperCase()}</span>
            </div>
        );
    }

    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

/** {@link ProviderIcon} preset that is always rounded with a background (avatar style). */
export function ProviderAvatar({
    provider,
    size = 32,
    className = "",
}: {
    /** Provider id (resolved by name). */
    provider: string;
    /** Icon size in pixels. @defaultValue 32 */
    size?: number;
    className?: string;
}) {
    return <ProviderIcon provider={provider} size={size} rounded className={className} />;
}

// Provider display names - comprehensive list
export const ProviderNames: Record<string, string> = {
    openai: "OpenAI",
    anthropic: "Anthropic",
    google: "Google",
    gemini: "Gemini",
    deepseek: "DeepSeek",
    mistral: "Mistral",
    xai: "xAI",
    grok: "Grok",
    groq: "Groq",
    azure: "GitHub Models",
    "azure-openai": "GitHub Models",
    aws: "GitHub Models",
    bedrock: "GitHub Models",
    nvidia: "NVIDIA",
    zhipu: "Zhipu",
    moonshot: "Moonshot",
    alibaba: "Alibaba",
    qwen: "Qwen",
    dashscope: "DashScope",
    minimax: "MiniMax",
    volcengine: "Volcengine",
    doubao: "Doubao",
    bytedance: "ByteDance",
    baidu: "Baidu",
    baichuan: "Baichuan",
    yi: "Yi",
    openrouter: "OpenRouter",
    tokenrouter: "TokenRouter",
    huggingface: "HuggingFace",
    ollama: "Ollama",
    lmstudio: "LM Studio",
    together: "Together",
    cohere: "Cohere",
    perplexity: "Perplexity",
    fireworks: "Fireworks",
    github: "GitHub Models",
    jina: "Jina",
    modelscope: "ModelScope",
    siliconflow: "SiliconFlow",
    silicon: "SiliconFlow",
    cerebras: "Cerebras",
    hyperbolic: "Hyperbolic",
    lepton: "Lepton",
    step: "Step",
    infini: "Infini",
    cloudflare: "Cloudflare",
    vllm: "vLLM",
    zai: "Z.ai",

    // Additional providers / gateways
    xiaomi: "Xiaomi",
    intel: "Intel",
    nomic: "Nomic",
    mixedbread: "Mixedbread",
    lanyun: "Lanyun",
    newapi: "New API",
    ocoolai: "OCoolAI",
    ph8: "PH8",
    ppio: "PPIO",
    vertexai: "Vertex AI",
    gcp: "Vertex AI",
    "302ai": "302.AI",
    aihubmix: "AiHubMix",
    dmxapi: "DMXAPI",
    bailian: "Bailian",
    bigmodel: "BigModel",
    burncloud: "BurnCloud",
    cherryin: "CherryIN",
    giteeai: "Gitee AI",
    qiniu: "Qiniu",
    sophnet: "SophNet",
    longcat: "LongCat",
    alayanew: "AlayaNew",
    cephalon: "Cephalon",
    mcprouter: "MCP Router",
    gpustack: "GPUStack",
    kwaipilot: "Kwaipilot",
    tencentcloudti: "Tencent Cloud TI",
    neteaseyoudao: "NetEase Youdao",
    aionly: "AiOnly",
};

export function getProviderName(providerId: string | null | undefined): string {
    if (!providerId) return "";
    const normalized = providerId.toLowerCase().replace(/[-_\s]/g, "");

    // Direct match
    if (ProviderNames[normalized]) return ProviderNames[normalized];

    // Partial match: input must contain a known key (>=3 chars); prefer longest.
    let best: { key: string; name: string } | null = null;
    for (const [key, name] of Object.entries(ProviderNames)) {
        if (key.length >= 3 && normalized.includes(key) && (!best || key.length > best.key.length)) {
            best = { key, name };
        }
    }
    if (best) return best.name;

    // Capitalize first letter of original
    return providerId.charAt(0).toUpperCase() + providerId.slice(1);
}

// Export for backwards compatibility
export function getProviderIcon(providerId: string) {
    const Component = () => <ProviderIcon provider={providerId} />;
    Component.displayName = `ProviderIcon(${providerId})`;
    return Component;
}

// =============================================================================
// Model Icon Component - with priority: model icon > developer icon > provider icon
// =============================================================================

interface ModelIconProps {
    /** Model's own icon URL or `/icons/models/` filename (highest priority). */
    iconUrl?: string | null;
    /** Developer/maker id, used to resolve a developer icon (second priority). */
    developer?: string | null;
    /** Provider id, used as the final fallback icon. */
    provider: string;
    className?: string;
    /** Icon size in pixels. @defaultValue 20 */
    size?: number;
    /** Render as a rounded avatar tile with a subtle background. */
    rounded?: boolean;
}

/**
 * Get proxied URL for external images to bypass CORS.
 * Only proxies URLs from known external domains.
 */
function getProxiedImageUrl(url: string): string {
    // Yunxin proxied some object-storage hosts through its backend to bypass CORS.
    // YunUI is backend-agnostic, so it uses the URL as-is; a consumer that needs
    // proxying can pre-resolve icon URLs before passing them in.
    return url;
}

/**
 * ModelIcon component with priority system:
 * 1. Model's own icon_url (custom URL or path to /icons/models/)
 * 2. Developer's icon (from developerIconMap)
 * 3. Provider's icon (fallback)
 *
 * Uses state to track failures so React re-renders and falls through
 * to the next priority level when an image can't be loaded.
 */
export function ModelIcon({
    iconUrl,
    developer,
    provider,
    className = "",
    size = 20,
    rounded = false,
}: ModelIconProps) {
    const { Image, iconBasePath } = useYunUI();
    const [failedPriority, setFailedPriority] = useState(0);

    // Dynamic border radius based on size
    const getRadiusClass = () => {
        if (size <= 14) return 'rounded-sm';
        if (size <= 20) return 'rounded-md';
        return 'rounded-lg';
    };

    // Priority 1: Model's own icon_url
    if (failedPriority < 1 && iconUrl && iconUrl.trim()) {
        const src = iconUrl.startsWith("http")
            ? getProxiedImageUrl(iconUrl)
            : (iconUrl.startsWith("/") ? iconUrl : `${iconBasePath}/models/${iconUrl}`);

        const handleError = () => setFailedPriority(1);

        if (rounded) {
            return (
                <div
                    className={`${getRadiusClass()} overflow-hidden bg-linear-to-br from-black/2 to-black/5 flex items-center justify-center ${className}`}
                    style={{ width: size, height: size }}
                >
                    <Image
                        src={src}
                        alt={provider}
                        width={size}
                        height={size}
                        className="object-cover"
                        unoptimized
                        onError={handleError}
                    />
                </div>
            );
        }

        return (
            <Image
                src={src}
                alt={provider}
                width={size}
                height={size}
                className={`object-contain ${className}`}
                unoptimized
                onError={handleError}
            />
        );
    }

    // Priority 2: Developer's icon (render directly, don't pass path to ProviderIcon)
    if (failedPriority < 2 && developer) {
        const developerIconFile = getDeveloperIconFile(developer);
        if (developerIconFile) {
            const src = `${iconBasePath}/models/${developerIconFile}`;

            const handleError = () => setFailedPriority(2);

            if (rounded) {
                return (
                    <div
                        className={`${getRadiusClass()} overflow-hidden bg-linear-to-br from-black/2 to-black/5 flex items-center justify-center ${className}`}
                        style={{ width: size, height: size }}
                    >
                        <Image
                            src={src}
                            alt={developer}
                            width={size}
                            height={size}
                            className="object-cover"
                            unoptimized
                            onError={handleError}
                        />
                    </div>
                );
            }

            return (
                <Image
                    src={src}
                    alt={developer}
                    width={size}
                    height={size}
                    className={`object-contain ${className}`}
                    unoptimized
                    onError={handleError}
                />
            );
        }
    }

    // Priority 3: Provider's icon (fallback)
    return <ProviderIcon provider={provider} size={size} rounded={rounded} className={className} />;
}

/** {@link ModelIcon} preset that is always rounded with a background (avatar style). */
export function ModelAvatar({
    iconUrl,
    developer,
    provider,
    size = 32,
    className = "",
}: {
    /** Model's own icon URL or filename (highest priority). */
    iconUrl?: string | null;
    /** Developer id (second priority). */
    developer?: string | null;
    /** Provider id (fallback). */
    provider: string;
    /** Icon size in pixels. @defaultValue 32 */
    size?: number;
    className?: string;
}) {
    return <ModelIcon iconUrl={iconUrl} developer={developer} provider={provider} size={size} rounded className={className} />;
}
