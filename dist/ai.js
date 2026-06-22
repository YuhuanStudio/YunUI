"use client";
import { copyToClipboard } from './chunk-WASCOOVD.js';
import { cn, ThemeToggle } from './chunk-DRZ7UCRU.js';
import { useYunUI } from './chunk-XZGNL5A6.js';
import { useState, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, ChevronUp, ChevronDown, Check, Copy, Waves, SlidersHorizontal, Layers, Fingerprint, Ban, Image, Code, Eye, PauseCircle, Bot, Globe, X, Menu, Radio, Box, Shield, Shuffle, Music, Video, Mic, Volume2, Headphones, Palette, Hash, FileText, MessageSquare, Pencil } from 'lucide-react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { cva } from 'class-variance-authority';

function ThinkingBlock({ content, isStreaming, defaultOpen = false, renderContent }) {
  const t = useYunUI().useT("common.thinking");
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return /* @__PURE__ */ jsxs("div", { className: "my-2 rounded-xl border border-border bg-muted/30 overflow-hidden", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 transition-colors",
        children: [
          /* @__PURE__ */ jsx("div", { className: cn(
            "flex items-center justify-center w-5 h-5 rounded-md bg-muted text-muted-foreground",
            isStreaming && "animate-pulse"
          ), children: /* @__PURE__ */ jsx(Brain, { size: 11 }) }),
          /* @__PURE__ */ jsx("span", { className: "font-medium whitespace-nowrap", children: t("label") }),
          isStreaming && /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded whitespace-nowrap", children: t("active") }),
          /* @__PURE__ */ jsx("div", { className: "ml-auto", children: isOpen ? /* @__PURE__ */ jsx(ChevronUp, { size: 14, className: "text-muted-foreground/70" }) : /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: "text-muted-foreground/70" }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { height: 0, opacity: 0 },
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: { duration: 0.2, ease: "easeInOut" },
        children: /* @__PURE__ */ jsx("div", { className: "px-3 pb-2.5 pt-1.5 text-xs text-muted-foreground leading-relaxed border-t border-border/50", children: content ? /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground", children: [
          renderContent ? renderContent(content) : /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap", children: content }),
          isStreaming && /* @__PURE__ */ jsx(
            motion.span,
            {
              animate: { opacity: [0.4, 1, 0.4] },
              transition: { duration: 1.2, repeat: Infinity },
              className: "inline-block w-1 h-3 bg-muted-foreground/60 ml-0.5 align-middle"
            }
          )
        ] }) : /* @__PURE__ */ jsx("span", { className: "italic opacity-50", children: t("inProgress") }) })
      }
    ) })
  ] });
}
function IDBadge({ text, truncate = true }) {
  const [copied, setCopied] = useState(false);
  const t = useYunUI().useT("common.badge");
  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!await copyToClipboard(text)) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onMouseDown: handleCopy,
      onClick: handleCopy,
      className: `group/badge relative inline-flex items-center rounded-md bg-muted border border-border hover:bg-muted/70 cursor-pointer transition-colors duration-200 overflow-hidden ${truncate ? "max-w-full min-w-0" : ""}`,
      title: t("clickToCopy", { text }),
      children: [
        /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 text-xs font-mono block ${truncate ? "truncate max-w-full min-w-0" : "whitespace-nowrap"}`, children: text }),
        /* @__PURE__ */ jsx("span", { className: "opacity-0 group-hover/badge:opacity-100 absolute right-0 inset-y-0 w-5 flex items-center justify-center rounded-r-md bg-muted/90 backdrop-blur-sm transition-opacity duration-200", children: copied ? /* @__PURE__ */ jsx(Check, { size: 10 }) : /* @__PURE__ */ jsx(Copy, { size: 10 }) })
      ]
    }
  );
}
var CAPABILITY_ICONS = {
  streaming: { icon: Waves, color: "text-cyan-500" },
  vision: { icon: Eye, color: "text-amber-500" },
  thinking: { icon: Brain, color: "text-pink-500" },
  function_calling: { icon: Code, color: "text-purple-500" },
  image_edit: { icon: Image, color: "text-orange-500" },
  negative_prompt: { icon: Ban, color: "text-red-500" },
  seed_control: { icon: Fingerprint, color: "text-indigo-500" },
  lora: { icon: Layers, color: "text-teal-500" },
  guidance_scale: { icon: SlidersHorizontal, color: "text-yellow-500" },
  strength: { icon: SlidersHorizontal, color: "text-orange-500" },
  batch: { icon: Waves, color: "text-cyan-500" }
};
function ModelCard({
  name,
  icon,
  ids = [],
  description,
  capabilities = [],
  developer,
  context,
  tier,
  price,
  nonofficial,
  suspended,
  labels,
  onClick,
  className = ""
}) {
  const { Image } = useYunUI();
  const shownCaps = capabilities.filter((c) => CAPABILITY_ICONS[c]).slice(0, 4);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick,
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      onKeyDown: (e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      },
      className: `card card-interactive p-4 text-left w-full group cursor-pointer flex flex-col ${className}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          icon,
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: shownCaps.map((cap) => {
            const { icon: Icon, color } = CAPABILITY_ICONS[cap];
            return /* @__PURE__ */ jsx("div", { className: "p-1 rounded-md bg-muted/50", title: cap, children: /* @__PURE__ */ jsx(Icon, { size: 11, className: color }) }, cap);
          }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsxs("div", { className: "font-medium text-sm group-hover:text-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "truncate", children: name }),
          nonofficial && /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[10px] px-1.5 py-0.5 rounded badge-warning font-medium whitespace-nowrap", children: labels?.nonofficial ?? "Unofficial" }),
          suspended && /* @__PURE__ */ jsxs("span", { className: "shrink-0 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium whitespace-nowrap bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20", children: [
            /* @__PURE__ */ jsx(PauseCircle, { size: 10 }),
            labels?.suspended ?? "Suspended"
          ] })
        ] }) }),
        ids.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1.5 mb-3", children: ids.map((id, idx) => /* @__PURE__ */ jsx(IDBadge, { text: id }, idx)) }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2.5em]", children: description || /* @__PURE__ */ jsx("span", { className: "opacity-40", children: labels?.noDescription ?? "No description" }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground pt-3 border-t border-border", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 min-w-0", children: [
            developer?.iconUrl && /* @__PURE__ */ jsx("div", { className: "rounded-md overflow-hidden bg-linear-to-br from-black/2 to-black/5", style: { width: 12, height: 12 }, children: /* @__PURE__ */ jsx(Image, { src: developer.iconUrl, alt: developer.label, width: 12, height: 12, className: "object-cover" }) }),
            developer?.label && /* @__PURE__ */ jsx("span", { children: developer.label })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            context && /* @__PURE__ */ jsx("span", { className: "bg-muted px-1.5 py-0.5 rounded-sm font-medium", children: context }),
            tier && tier !== "free" && /* @__PURE__ */ jsx("span", { className: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-sm font-medium", children: tier }),
            price && /* @__PURE__ */ jsx("span", { className: "font-mono", children: price })
          ] })
        ] })
      ]
    }
  );
}
var llmCapabilityConfig = [
  { value: "chat", icon: MessageSquare, iconColor: "text-blue-500", color: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20" },
  { value: "streaming", icon: Waves, iconColor: "text-cyan-500", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 hover:bg-cyan-500/20" },
  { value: "function_calling", icon: Code, iconColor: "text-purple-500", color: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20" },
  { value: "vision", icon: Eye, iconColor: "text-amber-500", color: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20" },
  { value: "thinking", icon: Brain, iconColor: "text-pink-500", color: "bg-pink-500/10 text-pink-600 border-pink-500/20 hover:bg-pink-500/20" }
];
var imageCapabilityConfig = [
  { value: "image_edit", icon: Pencil, iconColor: "text-orange-500", color: "bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20" },
  { value: "negative_prompt", icon: Ban, iconColor: "text-red-500", color: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20" },
  { value: "seed_control", icon: Fingerprint, iconColor: "text-indigo-500", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/20" },
  { value: "lora", icon: Layers, iconColor: "text-teal-500", color: "bg-teal-500/10 text-teal-600 border-teal-500/20 hover:bg-teal-500/20" },
  { value: "guidance_scale", icon: SlidersHorizontal, iconColor: "text-yellow-500", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20" },
  { value: "strength", icon: SlidersHorizontal, iconColor: "text-orange-500", color: "bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20" },
  { value: "batch", icon: Waves, iconColor: "text-cyan-500", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 hover:bg-cyan-500/20" }
];
var audioCapabilityConfig = [
  { value: "tts", icon: Mic, iconColor: "text-green-500", color: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20" },
  { value: "stt", icon: MessageSquare, iconColor: "text-blue-500", color: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20" },
  { value: "audio_translation", icon: Waves, iconColor: "text-purple-500", color: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20" }
];
var videoCapabilityConfig = [
  { value: "video_generation", icon: Video, iconColor: "text-red-500", color: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20" }
];
var musicCapabilityConfig = [
  { value: "music_generation", icon: Music, iconColor: "text-pink-500", color: "bg-pink-500/10 text-pink-600 border-pink-500/20 hover:bg-pink-500/20" }
];
var threedCapabilityConfig = [
  { value: "threed_generation", icon: Box, iconColor: "text-indigo-500", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/20" }
];
var realtimeCapabilityConfig = [
  { value: "realtime_voice", icon: Radio, iconColor: "text-yellow-500", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20" }
];
function CapabilitySelector({ selected, onChange, disabled = false, size = "md", columns = 4, modelType }) {
  const t = useYunUI().useT("capabilities");
  const toggleCapability = (cap) => {
    if (disabled) return;
    onChange(
      selected.includes(cap) ? selected.filter((c) => c !== cap) : [...selected, cap]
    );
  };
  const buildCapabilities = (config) => {
    return config.map((cap) => ({
      ...cap,
      label: t(cap.value)
    }));
  };
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
  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6"
  }[columns] || "grid-cols-3";
  return /* @__PURE__ */ jsx("div", { className: `grid ${gridColsClass} gap-2`, children: capabilityOptions.map((cap) => {
    const isSelected = selected.includes(cap.value);
    const Icon = cap.icon;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => toggleCapability(cap.value),
        disabled,
        className: `rounded-lg border text-left transition-all flex items-center ${sizeClasses} ${isSelected ? cap.color : "bg-background border-border hover:bg-muted/50"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`,
        children: [
          /* @__PURE__ */ jsx(Icon, { size: iconSize, className: `${isSelected ? "" : cap.iconColor} shrink-0` }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: cap.label })
        ]
      },
      cap.value
    );
  }) });
}
var developerIconMap = {
  // Major AI companies
  openai: "openai.png",
  anthropic: "anthropic.png",
  google: "google.png",
  gemini: "gemini.png",
  gemma: "gemma.png",
  "deepseek": "deepseek.png",
  qwen: "qwen.png",
  mistral: "mistral.png",
  "01.ai": "zero-one.png",
  "zero-one": "zero-one.png",
  xai: "grok.png",
  // Chinese companies
  zhipu: "zhipu.png",
  moonshot: "moonshot.png",
  baichuan: "baichuan.png",
  alibaba: "dashscope.png",
  minimax: "minimax.png",
  volcengine: "volcengine.png",
  bytedance: "byte_dance.svg",
  baidu: "wenxin.png",
  // baidu-cloud.svg only exists under /icons/providers/; ERNIE/Wenxin icon lives in /icons/models/
  tencent: "dianxin.png",
  doubao: "doubao.png",
  hunyuan: "hunyuan.png",
  sparkdesk: "sparkdesk.png",
  wenxin: "wenxin.png",
  stepfun: "step.png",
  // Research organizations
  ai21: "ai21.png",
  adept: "adept.png",
  aisingapore: "aisingapore.png",
  bigcode: "bigcode.png",
  codegeex: "codegeex.png",
  cohere: "cohere.png",
  dbrx: "dbrx.png",
  gryphe: "gryphe.png",
  hailuo: "hailuo.png",
  internlm: "internlm.png",
  jina: "jina.png",
  nvidia: "nvidia.png",
  rakutenai: "rakutenai.png",
  upstage: "upstage.png",
  voyageai: "voyageai.png",
  xirang: "xirang.png",
  yi: "zero-one.png",
  zai: "zai.png",
  // Image/Audio/Video models
  chatgpt: "chatgpt.jpeg",
  dalle: "dalle.png",
  flux: "flux.png",
  ideogram: "ideogram.svg",
  keling: "keling.png",
  luma: "luma.png",
  midjourney: "midjourney.png",
  stability: "stability.png",
  suno: "suno.png",
  vidu: "vidu.png",
  tokenflux: "tokenflux.png",
  // Other
  huggingface: "huggingface.png",
  meta: "llama.png",
  facebook: "llama.png",
  // no meta.png under /icons/models/; Meta/Facebook family uses the Llama icon
  microsoft: "microsoft.png",
  ibm: "ibm.png",
  github: "copilot.png",
  tele: "tele.png",
  ling: "ling.png",
  mimo: "mimo.svg",
  pangu: "pangu.svg",
  xiaomi: "xiaomi.png",
  // Model-family icons with dedicated art under /icons/models/
  claude: "claude.png",
  codestral: "codestral.png",
  mixtral: "mixtral.png",
  pixtral: "pixtral.png",
  llava: "llava.png",
  palm: "palm.png",
  chatglm: "chatglm.png",
  internvl: "internvl.png",
  minicpm: "minicpm.webp",
  nousresearch: "nousresearch.png"
};
function getDeveloperIconPath(developer) {
  if (!developer) return null;
  const file = getDeveloperIconFile(developer);
  return file ? `/icons/models/${file}` : null;
}
function getDeveloperIconFile(developer) {
  if (!developer) return null;
  const normalized = developer.toLowerCase().replace(/[-_\s]/g, "");
  if (developerIconMap[normalized]) {
    return developerIconMap[normalized];
  }
  for (const [key, file] of Object.entries(developerIconMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return file;
    }
  }
  return null;
}
var providerIconMap = {
  // Major providers
  openai: "openai.png",
  anthropic: "anthropic.png",
  google: "google.png",
  gemini: "gemini.png",
  deepseek: "deepseek.png",
  mistral: "mistral.png",
  groq: "groq.png",
  grok: "grok.png",
  xai: "grok.png",
  // Cloud providers
  azure: "github.png",
  "azure-openai": "github.png",
  aws: "github.png",
  bedrock: "github.png",
  // Chinese providers
  zhipu: "zhipu.png",
  moonshot: "moonshot.png",
  baichuan: "baichuan.png",
  alibaba: "dashscope.png",
  qwen: "dashscope.png",
  dashscope: "dashscope.png",
  minimax: "minimax.png",
  volcengine: "volcengine.png",
  doubao: "doubao.png",
  bytedance: "bytedance.png",
  baidu: "baidu-cloud.svg",
  // Other providers
  nvidia: "nvidia.png",
  huggingface: "huggingface.png",
  ollama: "ollama.png",
  lmstudio: "lmstudio.png",
  openrouter: "openrouter.png",
  tokenrouter: "tokenrouter.png",
  together: "together.png",
  cohere: "cohere.png",
  perplexity: "perplexity.png",
  fireworks: "fireworks.png",
  github: "github.png",
  jina: "jina.png",
  modelscope: "modelscope.png",
  siliconflow: "silicon.png",
  silicon: "silicon.png",
  cerebras: "cerebras.webp",
  hyperbolic: "hyperbolic.png",
  lepton: "lepton.png",
  cloudflare: "cloudflare.png",
  vllm: "vllm.png",
  zai: "zai.png",
  // Image/special
  step: "step.png",
  "zero-one": "zero-one.png",
  yi: "zero-one.png",
  infini: "infini.png",
  // Additional providers / gateways with icons under /icons/providers/.
  // Keys are normalized (lowercase, separators stripped) to match getIconPath().
  xiaomi: "Xiaomi.png",
  intel: "intel.png",
  nomic: "nomic.png",
  mixedbread: "mixedbread.png",
  lanyun: "lanyun.png",
  newapi: "newapi.png",
  ocoolai: "ocoolai.png",
  ph8: "ph8.png",
  ppio: "ppio.png",
  vertexai: "vertexai.svg",
  gcp: "vertexai.svg",
  "302ai": "302ai.webp",
  aihubmix: "aihubmix.png",
  dmxapi: "DMXAPI.png",
  bailian: "bailian.png",
  bigmodel: "bigModel.png",
  burncloud: "burncloud.png",
  cherryin: "cherryin.png",
  giteeai: "gitee-ai.png",
  qiniu: "qiniu.webp",
  sophnet: "sophnet.svg",
  longcat: "longcat.png",
  alayanew: "alayanew.webp",
  cephalon: "cephalon.jpeg",
  mcprouter: "mcprouter.webp",
  gpustack: "gpustack.svg",
  kwaipilot: "Kwaipilot.png",
  tencentcloudti: "tencent-cloud-ti.png",
  neteaseyoudao: "netease-youdao.svg",
  aionly: "aiOnly.webp"
};
function getProviderIconOptions() {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const [key, file] of Object.entries(providerIconMap)) {
    if (seen.has(file)) continue;
    seen.add(file);
    out.push({ value: `/icons/providers/${file}`, label: key });
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}
function normalizeProviderId(id) {
  return id.toLowerCase().replace(/[-_\s]/g, "");
}
function getIconPath(providerId) {
  const normalized = normalizeProviderId(providerId);
  if (providerIconMap[normalized]) {
    return `/icons/providers/${providerIconMap[normalized]}`;
  }
  for (const [key, file] of Object.entries(providerIconMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return `/icons/providers/${file}`;
    }
  }
  return null;
}
function ProviderIcon({
  provider,
  className = "",
  size = 20,
  rounded = false,
  iconUrl
}) {
  const { Image } = useYunUI();
  const [customError, setCustomError] = useState(false);
  const effectiveIconUrl = iconUrl;
  if (effectiveIconUrl && !customError) {
    if (rounded) {
      const getRadius = () => size <= 14 ? "rounded-sm" : size <= 20 ? "rounded-md" : "rounded-lg";
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `${getRadius()} overflow-hidden bg-linear-to-br from-black/2 to-black/5 flex items-center justify-center ${className}`,
          style: { width: size, height: size },
          children: /* @__PURE__ */ jsx("img", { src: effectiveIconUrl, alt: provider, width: size, height: size, className: "object-cover", onError: () => setCustomError(true) })
        }
      );
    }
    return /* @__PURE__ */ jsx("img", { src: effectiveIconUrl, alt: provider, width: size, height: size, className: `object-contain ${className}`, onError: () => setCustomError(true) });
  }
  const iconPath = getIconPath(provider);
  const getRadiusClass = () => {
    if (size <= 14) return "rounded-sm";
    if (size <= 20) return "rounded-md";
    return "rounded-lg";
  };
  if (iconPath) {
    if (rounded) {
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `${getRadiusClass()} overflow-hidden bg-linear-to-br from-black/2 to-black/5 flex items-center justify-center ${className}`,
          style: { width: size, height: size },
          children: /* @__PURE__ */ jsx(
            Image,
            {
              src: iconPath,
              alt: provider,
              width: size,
              height: size,
              className: "object-cover",
              unoptimized: true
            }
          )
        }
      );
    }
    return /* @__PURE__ */ jsx(
      Image,
      {
        src: iconPath,
        alt: provider,
        width: size,
        height: size,
        className: `object-contain ${className}`,
        unoptimized: true
      }
    );
  }
  if (rounded) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `${getRadiusClass()} bg-linear-to-br from-black/5 to-black/10 flex items-center justify-center ${className}`,
        style: { width: size, height: size },
        children: /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: provider.charAt(0).toUpperCase() })
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      className,
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "3" }),
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
      ]
    }
  );
}
function ProviderAvatar({
  provider,
  size = 32,
  className = ""
}) {
  return /* @__PURE__ */ jsx(ProviderIcon, { provider, size, rounded: true, className });
}
var ProviderNames = {
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
  aionly: "AiOnly"
};
function getProviderName(providerId) {
  const normalized = providerId.toLowerCase().replace(/[-_\s]/g, "");
  if (ProviderNames[normalized]) return ProviderNames[normalized];
  for (const [key, name] of Object.entries(ProviderNames)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return name;
    }
  }
  return providerId.charAt(0).toUpperCase() + providerId.slice(1);
}
function getProxiedImageUrl(url) {
  return url;
}
function ModelIcon({
  iconUrl,
  developer,
  provider,
  className = "",
  size = 20,
  rounded = false
}) {
  const { Image } = useYunUI();
  const [failedPriority, setFailedPriority] = useState(0);
  const getRadiusClass = () => {
    if (size <= 14) return "rounded-sm";
    if (size <= 20) return "rounded-md";
    return "rounded-lg";
  };
  if (failedPriority < 1 && iconUrl && iconUrl.trim()) {
    const src = iconUrl.startsWith("http") ? getProxiedImageUrl(iconUrl) : iconUrl.startsWith("/") ? iconUrl : `/icons/models/${iconUrl}`;
    const handleError = () => setFailedPriority(1);
    if (rounded) {
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `${getRadiusClass()} overflow-hidden bg-linear-to-br from-black/2 to-black/5 flex items-center justify-center ${className}`,
          style: { width: size, height: size },
          children: /* @__PURE__ */ jsx(
            Image,
            {
              src,
              alt: provider,
              width: size,
              height: size,
              className: "object-cover",
              unoptimized: true,
              onError: handleError
            }
          )
        }
      );
    }
    return /* @__PURE__ */ jsx(
      Image,
      {
        src,
        alt: provider,
        width: size,
        height: size,
        className: `object-contain ${className}`,
        unoptimized: true,
        onError: handleError
      }
    );
  }
  if (failedPriority < 2 && developer) {
    const developerIconFile = getDeveloperIconFile(developer);
    if (developerIconFile) {
      const src = `/icons/models/${developerIconFile}`;
      const handleError = () => setFailedPriority(2);
      if (rounded) {
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: `${getRadiusClass()} overflow-hidden bg-linear-to-br from-black/2 to-black/5 flex items-center justify-center ${className}`,
            style: { width: size, height: size },
            children: /* @__PURE__ */ jsx(
              Image,
              {
                src,
                alt: developer,
                width: size,
                height: size,
                className: "object-cover",
                unoptimized: true,
                onError: handleError
              }
            )
          }
        );
      }
      return /* @__PURE__ */ jsx(
        Image,
        {
          src,
          alt: developer,
          width: size,
          height: size,
          className: `object-contain ${className}`,
          unoptimized: true,
          onError: handleError
        }
      );
    }
  }
  return /* @__PURE__ */ jsx(ProviderIcon, { provider, size, rounded, className });
}
function ModelAvatar({
  iconUrl,
  developer,
  provider,
  size = 32,
  className = ""
}) {
  return /* @__PURE__ */ jsx(ModelIcon, { iconUrl, developer, provider, size, rounded: true, className });
}
function ProviderIconImg({ provider, size = 16 }) {
  return /* @__PURE__ */ jsx(ProviderIcon, { provider, size, rounded: true });
}
var MODEL_TYPE_ICONS = {
  chat: /* @__PURE__ */ jsx(MessageSquare, { size: 16, className: "text-blue-500" }),
  completion: /* @__PURE__ */ jsx(FileText, { size: 16, className: "text-gray-500" }),
  embedding: /* @__PURE__ */ jsx(Hash, { size: 16, className: "text-purple-500" }),
  image_generation: /* @__PURE__ */ jsx(Palette, { size: 16, className: "text-pink-500" }),
  audio: /* @__PURE__ */ jsx(Headphones, { size: 16, className: "text-orange-500" }),
  tts: /* @__PURE__ */ jsx(Volume2, { size: 16, className: "text-green-500" }),
  stt: /* @__PURE__ */ jsx(Mic, { size: 16, className: "text-red-500" }),
  video: /* @__PURE__ */ jsx(Video, { size: 16, className: "text-cyan-500" }),
  video_generation: /* @__PURE__ */ jsx(Video, { size: 16, className: "text-cyan-400" }),
  music_generation: /* @__PURE__ */ jsx(Music, { size: 16, className: "text-orange-400" }),
  rerank: /* @__PURE__ */ jsx(Shuffle, { size: 16, className: "text-indigo-500" }),
  moderation: /* @__PURE__ */ jsx(Shield, { size: 16, className: "text-yellow-500" }),
  "3d": /* @__PURE__ */ jsx(Box, { size: 16, className: "text-amber-500" }),
  realtime: /* @__PURE__ */ jsx(Radio, { size: 16, className: "text-yellow-400" })
};
function ModelTypeIcon({ type, size = 16 }) {
  const icon = MODEL_TYPE_ICONS[type.toLowerCase()];
  if (icon) {
    return /* @__PURE__ */ jsx("span", { className: "inline-flex", style: { transform: size !== 16 ? `scale(${size / 16})` : void 0 }, children: icon });
  }
  return /* @__PURE__ */ jsx(Bot, { size, className: "text-muted-foreground" });
}
var variants = {
  primary: "bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/80 disabled:bg-fd-secondary disabled:text-fd-secondary-foreground",
  outline: "border hover:bg-fd-accent hover:text-fd-accent-foreground",
  ghost: "hover:bg-fd-accent hover:text-fd-accent-foreground",
  secondary: "border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"
};
var buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring",
  {
    variants: {
      variant: variants,
      // fumadocs use `color` instead of `variant`
      color: variants,
      size: {
        sm: "gap-1 px-2 py-1.5 text-xs",
        icon: "p-1.5 [&_svg]:size-5",
        "icon-sm": "p-1.5 [&_svg]:size-4.5",
        "icon-xs": "p-1 [&_svg]:size-4"
      }
    }
  }
);
function LanguageSwitcher({
  locales,
  currentLocale,
  onChange,
  variant = "icon",
  align = "right",
  label = "Language",
  pending = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLocaleChange = (newLocale) => {
    if (newLocale === currentLocale || pending) return;
    setIsOpen(false);
    onChange(newLocale);
  };
  const currentLabel = locales.find((l) => l.value === currentLocale)?.label ?? currentLocale;
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: `relative ${className}`, children: [
    variant === "pill" ? /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium transition-all bg-(--bg-elevated) hover:bg-(--bg-elevated)/80 border border-(--border-hairline) text-(--text-secondary) hover:text-(--text-primary) disabled:opacity-50",
        disabled: pending,
        "aria-label": label,
        children: [
          /* @__PURE__ */ jsx(Globe, { size: 14 }),
          /* @__PURE__ */ jsx("span", { children: currentLabel })
        ]
      }
    ) : /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "w-9 h-9 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors disabled:opacity-50",
        disabled: pending,
        "aria-label": label,
        children: /* @__PURE__ */ jsx(Globe, { className: "h-[1.2rem] w-[1.2rem]" })
      }
    ),
    isOpen && /* @__PURE__ */ jsx("div", { className: `absolute ${align === "left" ? "left-0" : "right-0"} top-full mt-2 z-50 rounded-2xl border border-white/10 dark:border-white/5 bg-background/60 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5 animate-in fade-in-0 zoom-in-95 duration-200`, children: /* @__PURE__ */ jsx("div", { className: "p-1", children: locales.map((lang) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => handleLocaleChange(lang.value),
        className: `dropdown-item w-full text-left ${currentLocale === lang.value ? "active" : ""}`,
        children: /* @__PURE__ */ jsx("span", { className: "flex-1", children: lang.label })
      },
      lang.value
    )) }) })
  ] });
}
function Navbar({
  appName,
  logoSrc = "/favicon.ico",
  links = [],
  currentPath = "/",
  variant = "public",
  labels,
  languageSwitcher,
  themeToggle,
  homeHref = "/",
  loginHref = "/login",
  signupHref = "/signup"
}) {
  const { Link, Image } = useYunUI();
  const [scrollSection, setScrollSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const signIn = labels?.signIn ?? "Sign In";
  const signUp = labels?.signUp ?? "Sign Up";
  const menuLabel = labels?.menu ?? "Menu";
  const activeSection = useMemo(() => {
    return currentPath === "/" ? scrollSection : "";
  }, [currentPath, scrollSection]);
  useEffect(() => {
    if (currentPath !== "/") return;
    const sections = document.querySelectorAll("section[id]");
    if (sections.length === 0) return;
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      let currentSection = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = `#${section.id}`;
        }
      });
      setScrollSection(currentSection);
    };
    handleScroll();
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [currentPath]);
  const isActive = (path) => {
    if (currentPath === path) return true;
    if (path.startsWith("/#")) {
      return currentPath === "/" && activeSection === path.slice(1);
    }
    return false;
  };
  return /* @__PURE__ */ jsxs("nav", { className: "fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 max-w-6xl w-[calc(100%-48px)] bg-background/80 backdrop-blur-xl border border-border rounded-full shadow-md flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs(Link, { href: homeHref, className: "flex items-center gap-2 rounded-lg px-2 py-1 -mx-2 hover:bg-foreground/5 transition-colors duration-200", children: [
      /* @__PURE__ */ jsx(Image, { src: logoSrc, alt: appName, width: 28, height: 28, className: "w-7 h-7" }),
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm tracking-tight", children: appName })
    ] }),
    variant === "public" && /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2", children: links.map((link) => /* @__PURE__ */ jsxs(
      Link,
      {
        href: link.href,
        className: "group relative px-2 lg:px-3 py-2 whitespace-nowrap min-w-15 text-center",
        children: [
          /* @__PURE__ */ jsx("span", { className: `text-sm relative z-10 ${isActive(link.href) ? "text-foreground font-medium" : "text-muted-foreground"}`, children: link.label }),
          /* @__PURE__ */ jsx("span", { className: `absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-foreground rounded-full transition-all duration-200 ${isActive(link.href) ? "w-8" : "w-0 group-hover:w-8"}` })
        ]
      },
      link.href
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
      languageSwitcher,
      themeToggle ?? /* @__PURE__ */ jsx(ThemeToggle, { variant: "pill" }),
      variant !== "minimal" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: loginHref,
            className: "hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 whitespace-nowrap min-w-15 text-center",
            children: signIn
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: signupHref,
            className: "px-3 sm:px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 hover:shadow-md transition-all duration-200 whitespace-nowrap min-w-20 text-center",
            children: [
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: signUp }),
              /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Sign Up" })
            ]
          }
        )
      ] }),
      variant === "public" && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setMenuOpen((o) => !o),
          className: "md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-colors",
          "aria-label": menuLabel,
          "aria-expanded": menuOpen,
          children: menuOpen ? /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
        }
      )
    ] }),
    variant === "public" && menuOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "md:hidden fixed inset-0 -z-10", onClick: () => setMenuOpen(false) }),
      /* @__PURE__ */ jsxs("div", { className: "md:hidden absolute top-full left-0 right-0 mt-3 p-2 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-lg flex flex-col gap-0.5", children: [
        links.map((link) => /* @__PURE__ */ jsx(
          Link,
          {
            href: link.href,
            onClick: () => setMenuOpen(false),
            className: `px-4 py-2.5 rounded-xl text-sm transition-colors hover:bg-foreground/5 ${isActive(link.href) ? "text-foreground font-medium" : "text-muted-foreground"}`,
            children: link.label
          },
          link.href
        )),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: loginHref,
            onClick: () => setMenuOpen(false),
            className: "px-4 py-2.5 rounded-xl text-sm text-muted-foreground transition-colors hover:bg-foreground/5",
            children: signIn
          }
        )
      ] })
    ] })
  ] });
}
var GithubIcon = () => /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" }) });
var InstagramIcon = () => /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" }) });
var DiscordIcon = () => /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" }) });
function Footer({
  appName,
  logoSrc = "/favicon.ico",
  homeHref = "/",
  tagline,
  sections = [],
  social = [],
  copyright
}) {
  const { Link, Image } = useYunUI();
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const copyrightText = copyright ?? `\xA9 ${year} ${appName}. All rights reserved.`;
  return /* @__PURE__ */ jsx("footer", { className: "mt-auto py-6 px-6", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "card p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Link, { href: homeHref, className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(Image, { src: logoSrc, alt: appName, width: 24, height: 24 }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: appName })
        ] }),
        tagline && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: tagline })
      ] }),
      sections.map((section) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: section.title }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-1.5 text-sm", children: section.links.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: link.href, className: "text-muted-foreground hover:text-foreground transition-colors", children: link.label }) }, link.href)) })
      ] }, section.title))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx("span", { children: copyrightText }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: social.map((link) => /* @__PURE__ */ jsx(
        "a",
        {
          href: link.href,
          target: link.href.startsWith("/") || link.href.startsWith("mailto:") ? void 0 : "_blank",
          rel: link.href.startsWith("/") || link.href.startsWith("mailto:") ? void 0 : "noopener noreferrer",
          className: "text-muted-foreground hover:text-foreground transition-colors",
          "aria-label": link.label,
          children: link.icon
        },
        link.label
      )) })
    ] })
  ] }) }) });
}

export { CapabilitySelector, DiscordIcon, Footer, GithubIcon, IDBadge, InstagramIcon, LanguageSwitcher, ModelAvatar, ModelCard, ModelIcon, ModelTypeIcon, Navbar, ProviderAvatar, ProviderIcon, ProviderIconImg, ProviderNames, ThinkingBlock, buttonVariants, getDeveloperIconPath, getIconPath, getProviderIconOptions, getProviderName, normalizeProviderId };
//# sourceMappingURL=ai.js.map
//# sourceMappingURL=ai.js.map