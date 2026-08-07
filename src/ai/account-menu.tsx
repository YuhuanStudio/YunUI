"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { CircleUserRound, LogOut } from "lucide-react";
import { cn } from "../lib/cn";
import { useYunUI } from "../adapters/context";

export interface AccountMenuUser {
    /** Display name. Falls back to `fallbackName` when absent. */
    name?: string | null;
    /** Shown under the name in the menu header. */
    email?: string | null;
    /** Avatar image URL; a glyph is shown when absent. */
    avatarUrl?: string | null;
}

export interface AccountMenuItem {
    key: string;
    label: ReactNode;
    icon?: ElementType;
    /** Navigate on select. */
    href?: string;
    /** Or run something on select (takes precedence over `href`). */
    onSelect?: () => void;
}

export interface AccountMenuProps {
    /**
     * The signed-in user, `null` when signed out, or `undefined` while the
     * answer is still unknown.
     *
     * The three-state shape is the point: a session cookie is usually
     * `httpOnly`, so the page cannot read it and only the server can answer.
     * While it is `undefined` this renders a fixed-size placeholder rather than
     * guessing — showing "sign in" first and swapping to an avatar makes every
     * page load look like it signed the reader out.
     */
    user: AccountMenuUser | null | undefined;
    /** Menu entries above the sign-out row. */
    items?: AccountMenuItem[];
    /** Where the signed-out button links. */
    signInHref: string;
    /** Called when the sign-out row is chosen. Omit to hide the row. */
    onSignOut?: () => void;
    /** Every string this renders — localize them yourself. */
    labels?: {
        signIn?: string;
        signOut?: string;
        /** Accessible name for the trigger, e.g. "{name} menu". */
        menu?: string;
        /** Shown when the user has no name. */
        fallbackName?: string;
    };
    className?: string;
}

/**
 * The navbar account control: a sign-in glyph when signed out, the reader's
 * avatar when signed in, and a menu with their identity, your links and a
 * sign-out row.
 *
 * Extracted from YunNEWS, which handles the signed-in swap better than the
 * other apps — hence upstreaming it so they all get it. Purely presentational:
 * the host fetches the session, supplies every label and owns each action.
 */
export function AccountMenu({
    user,
    items = [],
    signInHref,
    onSignOut,
    labels,
    className,
}: AccountMenuProps) {
    const { Link } = useYunUI();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const signInLabel = labels?.signIn ?? "Sign in";
    const signOutLabel = labels?.signOut ?? "Sign out";
    const fallbackName = labels?.fallbackName ?? "Account";

    useEffect(() => {
        if (!open) return;
        const onDown = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    // Not answered yet — hold the space so the navbar does not shift when it is.
    if (user === undefined) {
        return <span aria-hidden className={cn("block h-9 w-9", className)} />;
    }

    if (user === null) {
        return (
            <Link
                href={signInHref}
                aria-label={signInLabel}
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground",
                    className,
                )}
            >
                <CircleUserRound className="h-4 w-4" />
            </Link>
        );
    }

    const name = user.name || fallbackName;

    return (
        <div ref={ref} className={cn("relative", className)}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={labels?.menu ?? name}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-colors hover:bg-foreground/5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatarUrl} alt="" width={28} height={28} className="h-7 w-7 rounded-full" />
                ) : (
                    <CircleUserRound className="h-4 w-4 text-muted-foreground" />
                )}
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-border bg-popover/95 p-1.5 shadow-lg shadow-black/5 backdrop-blur-2xl"
                >
                    <div className="border-b border-border px-3 py-2.5">
                        <p className="truncate text-sm font-medium">{name}</p>
                        {user.email && <p className="text-caption truncate">{user.email}</p>}
                    </div>

                    {items.map((item) => {
                        const Icon = item.icon;
                        const body = (
                            <>
                                {Icon && <Icon className="h-4 w-4" aria-hidden />}
                                {item.label}
                            </>
                        );
                        const rowClass =
                            "mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";
                        return item.onSelect ? (
                            <button
                                key={item.key}
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    item.onSelect?.();
                                    setOpen(false);
                                }}
                                className={rowClass}
                            >
                                {body}
                            </button>
                        ) : (
                            <Link
                                key={item.key}
                                href={item.href ?? "#"}
                                onClick={() => setOpen(false)}
                                className={rowClass}
                            >
                                {body}
                            </Link>
                        );
                    })}

                    {onSignOut && (
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                onSignOut();
                                setOpen(false);
                            }}
                            className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <LogOut className="h-4 w-4" aria-hidden />
                            {signOutLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
