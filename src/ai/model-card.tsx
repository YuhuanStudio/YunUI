"use client";

import { type ReactNode } from "react";
import {
  Waves,
  Eye,
  Brain,
  Code,
  Ban,
  Fingerprint,
  Layers,
  SlidersHorizontal,
  Image as ImageIcon,
  PauseCircle,
} from "lucide-react";
import { useYunUI } from "../adapters/context";
import { IDBadge } from "./id-badge";

const CAPABILITY_ICONS: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; color: string }> = {
  streaming: { icon: Waves, color: "text-cyan-500" },
  vision: { icon: Eye, color: "text-amber-500" },
  thinking: { icon: Brain, color: "text-pink-500" },
  function_calling: { icon: Code, color: "text-purple-500" },
  image_edit: { icon: ImageIcon, color: "text-orange-500" },
  negative_prompt: { icon: Ban, color: "text-red-500" },
  seed_control: { icon: Fingerprint, color: "text-indigo-500" },
  lora: { icon: Layers, color: "text-teal-500" },
  guidance_scale: { icon: SlidersHorizontal, color: "text-yellow-500" },
  strength: { icon: SlidersHorizontal, color: "text-orange-500" },
  batch: { icon: Waves, color: "text-cyan-500" },
};

export interface ModelCardProps {
  /** Model display name. */
  name: string;
  /** Avatar slot — host renders the provider/model icon. */
  icon?: ReactNode;
  /** Primary id + aliases, shown as mono badges. */
  ids?: string[];
  /** Short description (falls back to a "No description" label). */
  description?: ReactNode;
  /** Capability keys (e.g. "vision", "thinking") → coloured icons (first 4 shown). */
  capabilities?: string[];
  /** Developer/maker shown in the footer, with an optional icon. */
  developer?: { label: string; iconUrl?: string };
  /** e.g. "128K" or "1024×1024". */
  context?: string;
  /** Optional tier chip (e.g. "pro"); a `"free"` tier is hidden. */
  tier?: string;
  /** Formatted price node, e.g. "$0.50/M". */
  price?: ReactNode;
  /** Mark the model as unofficial (shows a warning badge). */
  nonofficial?: boolean;
  /** Mark the model as suspended (shows a paused badge). */
  suspended?: boolean;
  /** Localized strings for the unofficial/suspended badges and the empty-description fallback. */
  labels?: { nonofficial?: string; suspended?: string; noDescription?: string };
  /** Makes the whole card a clickable button (keyboard-activatable). */
  onClick?: () => void;
  className?: string;
}

/** Card summarizing an AI model: icon, name, capability chips, id badges, description, and a developer/context/tier/price footer. */
export function ModelCard({
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
  className = "",
}: ModelCardProps) {
  const { Image } = useYunUI();
  const shownCaps = capabilities.filter((c) => CAPABILITY_ICONS[c]).slice(0, 4);

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`card card-interactive p-4 text-left w-full group cursor-pointer flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      {/* Header: icon + capability chips */}
      <div className="flex items-start justify-between mb-3">
        {icon}
        <div className="flex items-center gap-1">
          {shownCaps.map((cap) => {
            const { icon: Icon, color } = CAPABILITY_ICONS[cap]!;
            return (
              <div key={cap} className="p-1 rounded-md bg-muted/50" title={cap}>
                <Icon size={11} className={color} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Name + status badges */}
      <div className="mb-2">
        <div className="font-medium text-sm group-hover:text-foreground flex items-center gap-1.5">
          <span className="truncate">{name}</span>
          {nonofficial && (
            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded badge-warning font-medium whitespace-nowrap">
              {labels?.nonofficial ?? "Unofficial"}
            </span>
          )}
          {suspended && (
            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded badge-warning font-medium whitespace-nowrap">
              <PauseCircle size={10} />
              {labels?.suspended ?? "Suspended"}
            </span>
          )}
        </div>
      </div>

      {/* IDs */}
      {ids.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {ids.map((id, idx) => (
            <IDBadge key={idx} text={id} />
          ))}
        </div>
      )}

      {/* Description */}
      <div className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2.5em]">
        {description || <span className="opacity-40">{labels?.noDescription ?? "No description"}</span>}
      </div>

      {/* Footer: developer + context/tier/price */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground pt-3 border-t border-border">
        <span className="flex items-center gap-1.5 min-w-0">
          {developer?.iconUrl && (
            <div className="rounded-md overflow-hidden bg-muted" style={{ width: 12, height: 12 }}>
              <Image src={developer.iconUrl} alt={developer.label} width={12} height={12} className="object-cover" />
            </div>
          )}
          {developer?.label && <span>{developer.label}</span>}
        </span>
        <div className="flex items-center gap-2">
          {context && <span className="bg-muted px-1.5 py-0.5 rounded-sm font-medium">{context}</span>}
          {tier && tier !== "free" && (
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-sm font-medium">
              {tier}
            </span>
          )}
          {price && <span className="font-mono">{price}</span>}
        </div>
      </div>
    </div>
  );
}
