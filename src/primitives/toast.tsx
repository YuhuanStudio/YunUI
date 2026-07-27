"use client";

import {
    Toaster as SonnerToaster,
    toast as sonnerToast,
    type ToasterProps,
} from "sonner";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react";

// =====================================================
// TOAST PROVIDER
// =====================================================

const defaultClassNames = {
    toast: "bg-card border border-border rounded-xl shadow-lg p-4",
    title: "text-sm font-medium",
    description: "text-xs text-muted-foreground",
    actionButton: "bg-foreground text-background text-xs px-3 py-1.5 rounded-lg",
    cancelButton: "text-muted-foreground text-xs px-3 py-1.5 rounded-lg hover:bg-muted",
};

export function Toaster({
    position = "bottom-right",
    visibleToasts = 1,
    expand = true,
    toastOptions,
    ...props
}: ToasterProps) {
    return (
        <SonnerToaster
            {...props}
            position={position}
            // Sonner intentionally hides the content of collapsed back cards.
            // In application shells that looks like a broken, empty toast.
            // Keep one notification visible and render the stack expanded so
            // an exiting or queued notification never becomes a blank card.
            visibleToasts={visibleToasts}
            expand={expand}
            toastOptions={{
                ...toastOptions,
                classNames: {
                    ...defaultClassNames,
                    ...toastOptions?.classNames,
                },
            }}
        />
    );
}

// =====================================================
// TOAST HELPERS
// =====================================================

export const toast = {
    success: (message: string, description?: string) => {
        sonnerToast.success(message, {
            description,
            icon: <CheckCircle2 className="w-5 h-5 text-success" />,
        });
    },

    error: (message: string, description?: string) => {
        sonnerToast.error(message, {
            description,
            icon: <AlertCircle className="w-5 h-5 text-error" />,
        });
    },

    info: (message: string, description?: string) => {
        sonnerToast.info(message, {
            description,
            icon: <Info className="w-5 h-5 text-info" />,
        });
    },

    warning: (message: string, description?: string) => {
        sonnerToast.warning(message, {
            description,
            icon: <AlertTriangle className="w-5 h-5 text-warning" />,
        });
    },

    loading: (message: string) => {
        return sonnerToast.loading(message, {
            icon: <Loader2 className="w-5 h-5 animate-spin" />,
        });
    },

    dismiss: (id?: string | number) => {
        sonnerToast.dismiss(id);
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: Error) => string);
        }
    ) => {
        return sonnerToast.promise(promise, {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
        });
    },
};
