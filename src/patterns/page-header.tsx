"use client";

import { type ReactNode } from "react";
import { cn } from "../lib/cn";

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
    return (
        {/* Stack title above actions on mobile; side-by-side from sm — so a long
            title + action buttons don't crush into one cramped row on a phone. */}
        <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4", className)}>
            <div className="min-w-0">
                <h1 className="heading-xl">{title}</h1>
                {description && <p className="text-body mt-1">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
    );
}
