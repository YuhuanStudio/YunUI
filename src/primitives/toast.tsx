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
            icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        });
    },

    error: (message: string, description?: string) => {
        sonnerToast.error(message, {
            description,
            icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        });
    },

    info: (message: string, description?: string) => {
        sonnerToast.info(message, {
            description,
            icon: <Info className="w-5 h-5 text-blue-500" />,
        });
    },

    warning: (message: string, description?: string) => {
        sonnerToast.warning(message, {
            description,
            icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
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
