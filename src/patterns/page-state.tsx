"use client";

import { type ElementType, type ReactNode } from "react";
import { Spinner } from "../index";

interface PageLoadingStateProps {
    message?: string;
}

export function PageLoadingState({ message }: PageLoadingStateProps) {
    return (
        <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
            {message && <span className="ml-3 text-muted-foreground">{message}</span>}
        </div>
    );
}

interface PageErrorStateProps {
    message: string;
    onRetry?: () => void;
    retryLabel?: string;
}

export function PageErrorState({ message, onRetry, retryLabel = "Retry" }: PageErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-red-600 dark:text-red-400 font-medium mb-2">{message}</div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                >
                    {retryLabel}
                </button>
            )}
        </div>
    );
}

interface PageEmptyStateProps {
    icon?: ElementType;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function PageEmptyState({ icon: Icon, title, description, action }: PageEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            {Icon && <Icon size={40} className="text-muted-foreground/40 mb-3" />}
            <div className="font-medium mb-1">{title}</div>
            {description && <div className="text-caption">{description}</div>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
