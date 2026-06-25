"use client";

import { type ElementType, type ReactNode } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "../index";
import { useYunUI } from "../adapters/context";

interface MediaPageHeaderProps {
    /** Page title. */
    title: string;
    /** Page subtitle/description. */
    description: string;
    /** While true, the sync button spins and is disabled. */
    isSyncing: boolean;
    /** Sync error message; shown in a red banner when non-null. */
    syncError: string | null;
    /** Called when the sync button is clicked. */
    onSync: () => void;
    /** Optional inline stat chips (`label` + `value`) below the header. */
    stats?: { label: string; value: string | number }[];
}

/** Media library page header with a title, description, sync button, error banner, and optional stats. */
export function MediaPageHeader({ title, description, isSyncing, syncError, onSync, stats }: MediaPageHeaderProps) {
    const t = useYunUI().useT("components.mediaPageHeader");

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="heading-xl">{title}</h1>
                    <p className="text-body mt-1">{description}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onSync} disabled={isSyncing} className="text-muted-foreground shrink-0 self-start sm:self-auto">
                    <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                    <span className="ml-2">{isSyncing ? t("syncing") : t("sync")}</span>
                </Button>
            </div>

            {syncError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                    <AlertCircle size={16} />
                    <span>{syncError}</span>
                </div>
            )}

            {stats && stats.length > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-1">
                            <span className="font-medium text-foreground">{stat.value}</span>
                            <span>{stat.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

interface MediaEmptyStateProps {
    /** Icon component shown above the title. */
    icon: ElementType;
    /** Heading text. */
    title: string;
    /** Supporting text below the title. */
    description: string;
    /** Action slot (e.g. a button) below the text. */
    action?: ReactNode;
}

/** Empty state for media pages (icon, title, description, optional action). */
export function MediaEmptyState({ icon: Icon, title, description, action }: MediaEmptyStateProps) {
    return (
        <div className="empty-state py-16">
            <Icon size={40} className="text-muted-foreground/40 mb-3" />
            <div className="font-medium mb-1">{title}</div>
            <div className="text-caption">{description}</div>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

/** Loading state for media pages (spinning sync icon + message, falls back to i18n default). */
export function MediaLoadingState({ message }: { message?: string }) {
    const t = useYunUI().useT("components.mediaPageHeader");
    const displayMessage = message ?? t("loading");
    return (
        <div className="flex items-center justify-center py-16">
            <RefreshCw size={24} className="animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">{displayMessage}</span>
        </div>
    );
}

/** Error state for media pages with an optional retry button. */
export function MediaErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
    const t = useYunUI().useT("components.mediaPageHeader");
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle size={40} className="text-red-500/50 mb-3" />
            <div className="font-medium text-red-600 dark:text-red-400 mb-1">{t("error")}</div>
            <div className="text-caption mb-4">{message}</div>
            {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry}>
                    <RefreshCw size={14} className="mr-2" />
                    {t("retry")}
                </Button>
            )}
        </div>
    );
}
