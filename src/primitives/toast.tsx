"use client";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react";

// =====================================================
// TOAST PROVIDER
// =====================================================

export function Toaster() {
    return (
        <SonnerToaster
            position="bottom-right"
            // Sonner's collapsed stack renders older notifications as empty
            // card backs. In dense application shells that reads as a broken
            // overlay and can cover controls. Keep the latest notification
            // visible; queued toasts still retain their normal lifetime.
            visibleToasts={1}
            toastOptions={{
                classNames: {
                    toast: "bg-card border border-border rounded-xl shadow-lg p-4",
                    title: "text-sm font-medium",
                    description: "text-xs text-muted-foreground",
                    actionButton: "bg-foreground text-background text-xs px-3 py-1.5 rounded-lg",
                    cancelButton: "text-muted-foreground text-xs px-3 py-1.5 rounded-lg hover:bg-muted",
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
