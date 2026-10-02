"use client";

import { useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";
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
import { capabilityIconColor } from "./capability-colors";

const CAPABILITY_ICONS: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; color: string }> = {
  streaming: { color: capabilityIconColor("streaming"), icon: Waves },
  vision: { color: capabilityIconColor("vision"), icon: Eye },
  thinking: { color: capabilityIconColor("thinking"), icon: Brain },
  function_calling: { color: capabilityIconColor("function_calling"), icon: Code },
  image_edit: { color: capabilityIconColor("image_edit"), icon: ImageIcon },
  negative_prompt: { color: capabilityIconColor("negative_prompt"), icon: Ban },
  seed_control: { color: capabilityIconColor("seed_control"), icon: Fingerprint },
  lora: { color: capabilityIconColor("lora"), icon: Layers },
  guidance_scale: { color: capabilityIconColor("guidance_scale"), icon: SlidersHorizontal },
  strength: { color: capabilityIconColor("strength"), icon: SlidersHorizontal },
  batch: { color: capabilityIconColor("batch"), icon: Waves },
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
  const cardRef = useRef<HTMLDivElement>(null);
  const selectionOnPointerDown = useRef<string | null>(null);
  const shownCaps = capabilities.filter((c) => CAPABILITY_ICONS[c]).slice(0, 4);

  const handleCardPointerDown = () => {
    selectionOnPointerDown.current = window.getSelection()?.toString() ?? "";
  };

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!onClick) return;
    const target = event.target;
    if (target instanceof Element && target.closest("button, a, input, select, textarea, label, summary, [contenteditable='true'], [tabindex]:not([tabindex='-1']), [role='button'], [role='link'], [role='menuitem'], [role='checkbox'], [role='radio'], [role='switch'], [role='combobox'], [role='textbox'], [role='slider'], [role='option'], [role='tab'], [role='treeitem'], [data-model-card-interactive]")) return;
    const selection = window.getSelection();
    const selectedText = selection?.toString() ?? "";
    const previousSelection = selectionOnPointerDown.current;
    selectionOnPointerDown.current = null;
    if (selectedText && previousSelection !== null && selectedText !== previousSelection && selection?.anchorNode && cardRef.current?.contains(selection.anchorNode)) return;
    if (selectedText && previousSelection === null && selection?.anchorNode && cardRef.current?.contains(selection.anchorNode)) return;
    onClick();
  };

  return (
    <div
      ref={cardRef}
      onPointerDown={handleCardPointerDown}
      onClick={handleCardClick}
      className={`card card-interactive p-4 text-left w-full group cursor-pointer flex flex-col relative ${className}`}
    >
      {onClick && (
        <button
          type="button"
          aria-label={name}
          data-model-card-action
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          className="absolute inset-0 z-0 rounded-[inherit] border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      )}
      <div className={onClick ? "relative z-[1] flex flex-1 flex-col" : undefined}>
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
        {description ?? <span className="opacity-40">{labels?.noDescription ?? "No description"}</span>}
      </div>

      {/* Footer: developer + context/tier/price */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground pt-3 border-t border-border">
        <span className="flex items-center gap-1.5 min-w-0">
          {developer?.iconUrl && (
            <div className="rounded-md overflow-hidden bg-muted" style={{ width: 12, height: 12 }}>
              <Image src={developer.iconUrl} alt={developer.label} width={12} height={12} className="object-cover" />
            </div>
          )}
          {developer?.label && <span className="truncate min-w-0">{developer.label}</span>}
        </span>
        <div className="flex items-center gap-2">
          {context && <span className="bg-muted px-1.5 py-0.5 rounded-sm font-medium">{context}</span>}
          {tier && tier !== "free" && (
            <span className="bg-warning-soft text-warning px-1.5 py-0.5 rounded-sm font-medium">
              {tier}
            </span>
          )}
          {price != null && <span className="font-mono">{price}</span>}
        </div>
      </div>
      </div>
    </div>
  );
}
