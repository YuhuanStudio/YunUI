"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";
import { useContentT } from "./use-content-t";

export interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

let mermaidSeq = 0;

/**
 * Render a Mermaid diagram (flowchart, sequence, gantt, …). The `mermaid`
 * library is loaded on demand the first time a diagram renders, so it never
 * ships in the initial bundle. Re-themes automatically for light/dark.
 */
export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [themeTick, setThemeTick] = useState(0);
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
          // Excalidraw-style hand-drawn shapes/edges (rough.js under the hood).
          // Deterministic seed so a diagram looks identical across re-renders.
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
          setSvg(renderedSvg);
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
    <div
      ref={containerRef}
      className={cn(
        "card my-4 p-4 overflow-x-auto",
        "flex items-center justify-center",
        "[&_svg]:max-w-full [&_svg]:h-auto",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
