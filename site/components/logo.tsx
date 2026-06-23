import type { ReactNode } from "react";

/**
 * The YunUI logo mark — inline so it inherits `currentColor` (the tile fills
 * with the current text color and themes light/dark/true-black automatically).
 * Mirrors site/public/yunui-logo.svg, kept inline so callers can color it via
 * a `text-foreground` wrapper without an extra network request.
 */
export function LogoMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="YunUI"
      className={className}
    >
      {/* App-icon tile (fills with currentColor) */}
      <rect width="32" height="32" rx="8" fill="currentColor" />
      {/* Two offset rounded layers = "one source, composed everywhere" */}
      <rect x="7.5" y="7.5" width="13" height="13" rx="3.5" fill="#fff" fillOpacity="0.3" />
      <rect x="11.5" y="11.5" width="13" height="13" rx="3.5" fill="#fff" />
    </svg>
  );
}

/**
 * Logo mark + "YunUI" wordmark lockup. Wrapped in `text-foreground` so the
 * mark themes with the page.
 */
export function Logo({
  size = 24,
  className,
  wordmark = true,
  suffix,
}: {
  size?: number;
  className?: string;
  wordmark?: boolean;
  suffix?: ReactNode;
}) {
  return (
    <span className={`inline-flex items-center gap-2 text-foreground ${className ?? ""}`}>
      <LogoMark size={size} className="shrink-0" />
      {wordmark && (
        <span className="font-semibold tracking-tight text-[0.975rem] leading-none">YunUI</span>
      )}
      {suffix}
    </span>
  );
}
