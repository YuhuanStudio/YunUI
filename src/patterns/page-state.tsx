"use client";

import { type ElementType, type ReactNode } from "react";
import { Spinner } from "../index";

interface PageLoadingStateProps {
    /** Optional text shown beside the spinner. */
    message?: string;
}

/** Centered in-page loading state (spinner + optional message). */
export function PageLoadingState({ message }: PageLoadingStateProps) {
    return (
        <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
            {message && <span className="ml-3 text-muted-foreground">{message}</span>}
        </div>
    );
}

interface PageErrorStateProps {
    /** Error message to display. */
    message: string;
    /** When provided, shows a retry link that calls this. */
    onRetry?: () => void;
    /** Label for the retry link. @defaultValue "Retry" */
    retryLabel?: string;
}

/** Centered in-page error state with an optional retry link. */
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
    /** Optional icon component shown above the title. */
    icon?: ElementType;
    /** Heading text. */
    title: string;
    /** Supporting text below the title. */
    description?: string;
    /** Action slot (e.g. a button) below the text. */
    action?: ReactNode;
}

/** Centered in-page empty state with an icon, title, description, and optional action. */
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
