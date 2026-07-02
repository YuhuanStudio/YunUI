"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";
import { useContentT } from "./use-content-t";
import { ImageLightbox } from "./image-lightbox";

export interface MermaidDiagramProps {
  chart: string;
  className?: string;
  /** Click the diagram to open a full-screen zoomable view. @defaultValue true */
  enableZoom?: boolean;
}

let mermaidSeq = 0;

// Diagram types mermaid's `look: "handDrawn"` does NOT roughen — these render
// perfectly straight, so we post-process them ourselves (roughenSvg). Everything
// else (flowchart, state, class, ER, requirement, C4, block…) is left to native
// handDrawn, which looks better and must NOT be filtered on top.
const NEEDS_MANUAL_ROUGHENING = new Set([
  "sequenceDiagram",
  "gantt",
  "pie",
  "journey",
  "gitGraph",
  "timeline",
  "mindmap",
  "quadrantChart",
  "xychart-beta",
  "sankey-beta",
  "packet-beta",
]);

/** First diagram-type keyword of a chart, skipping frontmatter and `%%` directives. */
function diagramType(chart: string): string {
  const lines = chart.trim().split("\n");
  let i = 0;
  if (lines[0]?.trim() === "---") {
    i = 1;
    while (i < lines.length && lines[i].trim() !== "---") i++;
    i++;
  }
  for (; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l || l.startsWith("%%")) continue;
    return l.split(/[\s:({]/)[0];
  }
  return "";
}

function needsManualRoughening(chart: string): boolean {
  return NEEDS_MANUAL_ROUGHENING.has(diagramType(chart));
}

/**
 * Give EVERY diagram a hand-drawn (Excalidraw-like) feel. Mermaid's native
 * `look: "handDrawn"` only roughens some diagram types (flowchart, state, class,
 * ER) and leaves sequence / gantt / pie / journey perfectly straight. So we also
 * inject an SVG turbulence-displacement filter and apply it to the stroke/shape
 * elements only — never `<text>` — so lines and boxes wobble like a sketch while
 * labels stay crisp. Scoped to this diagram's id so filters never leak across
 * diagrams, and self-contained (ships in the SVG) so it works in any host.
 */
function roughenSvg(svg: string, id: string): string {
  // The filter region must be in userSpaceOnUse: thin `<line>`/lifeline elements
  // have a zero-area bounding box, so an objectBoundingBox region collapses and
  // they render blank. Derive a tight whole-diagram region from the viewBox.
  const vb = svg.match(/viewBox="([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)"/);
  if (!vb) return svg;
  const [, mx, my, w, h] = vb.map(Number) as unknown as number[];
  const pad = 12;
  const fid = `${id}-rough`;
  const defs =
    `<defs><filter id="${fid}" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" ` +
    `x="${mx - pad}" y="${my - pad}" width="${w + pad * 2}" height="${h + pad * 2}">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="7" result="n"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>` +
    `</filter></defs>` +
    `<style>` +
    `#${id} path,#${id} rect,#${id} circle,#${id} ellipse,#${id} line,#${id} polygon,#${id} polyline{filter:url(#${fid})}` +
    `#${id} text,#${id} tspan{filter:none}` +
    `</style>`;
  // Insert right after the opening <svg …> tag.
  return svg.replace(/(<svg\b[^>]*>)/, `$1${defs}`);
}

/**
 * Render a Mermaid diagram (flowchart, sequence, gantt, …). The `mermaid`
 * library is loaded on demand the first time a diagram renders, so it never
 * ships in the initial bundle. Re-themes automatically for light/dark.
 */
export function MermaidDiagram({
  chart,
  className,
  enableZoom = true,
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [themeTick, setThemeTick] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const t = useContentT();

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      setIsLoading(true);
      setError("");

      // Fresh id per attempt — reusing an id across re-renders (e.g. the
      // theme observer firing) can make mermaid v11's render() hang on the
      // stale temp element it left in the DOM.
      const diagramId = `yunui-mermaid-${(mermaidSeq += 1)}`;

      try {
        const mermaid = (await import("mermaid")).default;
        const isDark =
          typeof document !== "undefined" &&
          document.documentElement.classList.contains("dark");

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          // Native rough.js hand-drawn look — clean output for the types it
          // supports (flowchart, state, class, ER, requirement, C4, block…).
          look: "handDrawn",
          handDrawnSeed: 1,
          securityLevel: "loose",
          fontFamily: '"Comic Sans MS", "Segoe Print", ui-rounded, system-ui, sans-serif',
          flowchart: { curve: "basis", padding: 20 },
          sequence: { diagramMarginX: 20, diagramMarginY: 20 },
          gantt: { barHeight: 20, barGap: 4 },
        });

        const { svg: renderedSvg } = await mermaid.render(diagramId, chart.trim());

        if (!cancelled) {
          // Native `handDrawn` already roughens the supported types cleanly;
          // applying our displacement filter on top would double-distort them
          // (tear fills off borders). Only roughen the types mermaid leaves
          // perfectly straight, so EVERY diagram ends up hand-drawn.
          setSvg(
            needsManualRoughening(chart)
              ? roughenSvg(renderedSvg, diagramId)
              : renderedSvg,
          );
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : t("diagramRenderFailed", "Failed to render diagram"),
          );
          setIsLoading(false);
        }
      }
    }

    renderDiagram();

    return () => {
      cancelled = true;
    };
    // `t` is intentionally omitted: it's only read in the catch fallback, and a
    // host adapter that returns a fresh translator each render would otherwise
    // retrigger this effect endlessly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, themeTick]);

  // Re-render when the light/dark class on <html> changes.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const observer = new MutationObserver(() => setThemeTick((n) => n + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  if (error) {
    return (
      <div
        className={cn(
          "my-4 p-4 rounded-xl border bg-error-soft border-error-soft",
          className,
        )}
      >
        <div className="flex items-start gap-2">
          <span className="text-error">⚠️</span>
          <div>
            <p className="text-sm font-medium text-error">
              {t("mermaidError", "Diagram error")}
            </p>
            <p className="text-xs text-(--text-tertiary) mt-1">{error}</p>
            <details className="mt-2">
              <summary className="text-xs text-(--text-tertiary) cursor-pointer hover:text-(--text-primary)">
                {t("viewSource", "View source")}
              </summary>
              <pre className="mt-2 p-2 bg-(--bg-elevated) rounded text-xs overflow-auto">
                {chart}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "card my-4 p-8 flex items-center justify-center",
          className,
        )}
      >
        <div className="flex items-center gap-2 text-(--text-tertiary)">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">{t("renderingDiagram", "Rendering diagram…")}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        onClick={enableZoom ? () => setZoomOpen(true) : undefined}
        role={enableZoom ? "button" : undefined}
        aria-label={enableZoom ? t("zoomDiagram", "Zoom diagram") : undefined}
        className={cn(
          "card my-4 p-4 overflow-x-auto",
          "flex items-center justify-center",
          "[&_svg]:max-w-full [&_svg]:h-auto",
          enableZoom && "cursor-zoom-in",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {enableZoom && (
        <ImageLightbox isOpen={zoomOpen} onClose={() => setZoomOpen(false)}>
          {/* Theme-matched panel so a light-theme diagram (dark strokes) stays
              readable on the lightbox's dark backdrop, and vice-versa. */}
          <div
            className="bg-(--bg-card) rounded-2xl p-6 shadow-2xl border border-white/10 w-[86vw] max-w-[1100px] [&_svg]:!max-w-none [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-h-[80vh]"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </ImageLightbox>
      )}
    </>
  );
}
