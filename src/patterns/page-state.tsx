"use client";

import { type ElementType, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button, Spinner } from "../index";

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
    /** When provided, shows a retry button that calls this. */
    onRetry?: () => void;
    /** Label for the retry button. @defaultValue "Retry" */
    retryLabel?: string;
}

/** Centered, compact in-page error state with an optional retry action. */
export function PageErrorState({ message, onRetry, retryLabel = "Retry" }: PageErrorStateProps) {
    return (
        <div
            role="alert"
            className="mx-auto flex w-full max-w-sm flex-col items-center justify-center px-4 py-12 text-center"
        >
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-error-soft">
                <AlertCircle size={20} className="text-error" aria-hidden="true" />
            </span>
            <div className="max-w-full text-sm font-medium leading-6 text-foreground">{message}</div>
            {onRetry && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="mt-4 min-w-20"
                >
                    {retryLabel}
                </Button>
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
