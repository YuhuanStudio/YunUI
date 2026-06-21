"use client";

import { type ElementType, type ReactNode } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "../index";
import { useYunUI } from "../adapters/context";

interface MediaPageHeaderProps {
    title: string;
    description: string;
    isSyncing: boolean;
    syncError: string | null;
    onSync: () => void;
    stats?: { label: string; value: string | number }[];
}

export function MediaPageHeader({ title, description, isSyncing, syncError, onSync, stats }: MediaPageHeaderProps) {
    const t = useYunUI().useT("components.mediaPageHeader");

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-xl">{title}</h1>
                    <p className="text-body mt-1">{description}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onSync} disabled={isSyncing} className="text-muted-foreground">
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
                <div className="flex gap-4 text-sm text-muted-foreground">
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
    icon: ElementType;
    title: string;
    description: string;
    action?: ReactNode;
}

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
