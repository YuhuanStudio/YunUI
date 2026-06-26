"use client";

import { type ReactNode, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "../lib/cn";

// =====================================================
// AVATAR UPLOADER
// A clickable avatar that opens a file picker: shows the image (or an initials
// fallback), a camera overlay on hover, and a spinner while uploading. The host
// owns the upload — `onSelectFile` hands back the chosen File.
// =====================================================

export interface AvatarUploaderProps {
    /** Current avatar image URL; when absent, `fallback` is shown. */
    src?: string;
    /** Fallback content (e.g. the user's initials). */
    fallback?: ReactNode;
    /** Diameter in px. */
    size?: number;
    /** True while an upload is in flight — shows a spinner. */
    uploading?: boolean;
    /** Called with the picked file. */
    onSelectFile?: (file: File) => void;
    /** Accessible label for the control. */
    label?: string;
    className?: string;
}

export function AvatarUploader({
    src,
    fallback,
    size = 48,
    uploading,
    onSelectFile,
    label,
    className,
}: AvatarUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label={label}
            className={cn("relative group cursor-pointer shrink-0 rounded-full", className)}
            style={{ width: size, height: size }}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onSelectFile?.(file);
                    e.target.value = "";
                }}
            />
            {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" className="w-full h-full rounded-full object-cover ring-2 ring-border group-hover:ring-primary transition-all" />
            ) : (
                <div className="w-full h-full rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold ring-2 ring-border group-hover:ring-primary transition-all" style={{ fontSize: size * 0.36 }}>
                    {fallback}
                </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/50 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploading ? (
                    <Loader2 size={Math.round(size / 3)} className="text-white animate-spin" />
                ) : (
                    <Camera size={Math.round(size / 3)} className="text-white" />
                )}
            </div>
        </button>
    );
}
