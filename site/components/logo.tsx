import type { ReactNode } from "react";

/**
 * YuhuanStudio's brand mark — the gradient wing logo shared across all
 * YuhuanStudio products (Yunxin, YunUI). Served from /yuhuanstudio-logo.png so
 * it matches the favicon exactly.
 */
export function LogoMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/yuhuanstudio-logo.png"
      alt="YuhuanStudio"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

/**
 * YuhuanStudio mark + "YunUI" wordmark lockup.
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
