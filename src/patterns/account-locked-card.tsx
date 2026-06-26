"use client";

import { type ReactNode, useEffect } from "react";
import { useYunUI } from "../adapters/context";

/**
 * Card for terminal "your account is locked" auth screens (banned / suspended).
 * Presentational only — the host owns the logout/redirect behind `onBack`.
 */
export interface AccountLockedCardProps {
  appName: string;
  logoSrc?: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  appeal: string;
  backLabel: string;
  onBack: () => void;
  /**
   * Run once on mount. Yunxin uses this to drop the (now-useless) session via
   * api.logout() so background auth probes can't bounce the user back into a
   * loop on these terminal screens.
   */
  onMount?: () => void;
  loading?: boolean;
  children?: ReactNode;
}

export function AccountLockedCard({
  appName,
  logoSrc = "/favicon.ico",
  icon,
  title,
  subtitle,
  appeal,
  backLabel,
  onBack,
  onMount,
  loading = false,
  children,
}: AccountLockedCardProps) {
  const { Image } = useYunUI();
  useEffect(() => {
    onMount?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Image src={logoSrc} alt={appName} width={32} height={32} />
          <span className="font-semibold text-[15px]">{appName}</span>
        </div>

        <div className="p-6 bg-card border border-border rounded-xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-soft">
            {icon}
          </div>
          <h1 className="text-xl font-semibold mb-2 text-center">{title}</h1>
          <p className="text-sm text-muted-foreground mb-5 text-center">{subtitle}</p>

          {children}

          <p className="text-sm text-muted-foreground mb-6 text-center">{appeal}</p>

          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {backLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
