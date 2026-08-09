import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import { AuthShell } from "../patterns";

// =============================================================================
// AuthShell is an EXTRACTION of Yunxin's auth screens, not a redesign of them.
// Yunxin is the original and stays the reference: all nine of its auth screens
// (login, signup, forgot-password, reset-password, verify-email,
// verify-added-email, resend-verification, auth/callback, the auth loading
// state) hand-roll the same shell, and adopting AuthShell must be a no-op on
// screen.
//
// So these tests pin the exact class strings rather than "does it look about
// right". If someone later swaps the panel onto the house `.card` — which is a
// 20px radius WITH a shadow and a hover transition, where Yunxin's auth card is
// `rounded-xl`, flat and static — that is a silent restyle of nine live pages,
// and it should fail here rather than ship.
// =============================================================================

/** Verbatim from Yunxin/frontend/src/app/(auth)/login/page.tsx. */
const YUNXIN = {
    viewport: "min-h-dvh bg-background flex items-center justify-center px-6",
    column: "w-full max-w-sm",
    brandRow: "flex items-center justify-center gap-2.5 mb-8",
    panel: "p-6 bg-card border border-border rounded-xl",
    heading: "text-xl font-semibold mb-6 text-center",
    errorBox: "mb-4 p-3 bg-error-soft text-error text-sm rounded-lg border border-error-soft",
    footer: "mt-6 text-center text-sm text-muted-foreground",
};

/** Every class in `expected` is present on `el`, in any order. */
function hasClasses(el: Element | null | undefined, expected: string) {
    expect(el, "element not found").toBeTruthy();
    const actual = new Set((el as Element).className.split(/\s+/));
    const missing = expected.split(/\s+/).filter((c) => !actual.has(c));
    expect(missing, `missing classes on ${(el as Element).tagName}`).toEqual([]);
}

describe("AuthShell reproduces Yunxin's auth shell", () => {
    it("keeps the viewport, column, brand row and panel chrome", () => {
        const { container } = render(
            <AuthShell brand={<span>Yunxin</span>} title="Sign in">
                <form />
            </AuthShell>,
        );

        const viewport = container.firstElementChild!;
        hasClasses(viewport, YUNXIN.viewport);
        hasClasses(viewport.firstElementChild, YUNXIN.column);
        hasClasses(container.querySelector("span")!.parentElement, YUNXIN.brandRow);
        hasClasses(container.querySelector("h1")!.parentElement, YUNXIN.panel);
    });

    it("does NOT use the house .card class", () => {
        // `.card` carries a 20px radius, a shadow and a hover transition; the
        // auth screens are flat rounded-xl boxes. Swapping them is a restyle.
        const { container } = render(
            <AuthShell title="Sign in">
                <form />
            </AuthShell>,
        );
        expect(container.querySelector(".card")).toBeNull();
    });

    it("matches Yunxin's heading margins: mb-6 alone, mb-2 with a subtitle", () => {
        const { container: bare } = render(
            <AuthShell title="Sign in">
                <form />
            </AuthShell>,
        );
        hasClasses(bare.querySelector("h1"), YUNXIN.heading);

        const { container: withSub } = render(
            <AuthShell title="Check your email" subtitle="We sent you a link.">
                <form />
            </AuthShell>,
        );
        const h1 = withSub.querySelector("h1")!;
        expect(h1.className).toContain("mb-2");
        expect(h1.className).not.toContain("mb-6");
    });

    it("renders a failed submit in the shared soft-error box, and nothing when falsy", () => {
        const { container } = render(
            <AuthShell error="Incorrect email or password.">
                <form />
            </AuthShell>,
        );
        const box = container.querySelector(".bg-error-soft");
        hasClasses(box, YUNXIN.errorBox);
        expect(box!.textContent).toBe("Incorrect email or password.");

        // `error={undefined}` / `error={null}` / `error={""}` must render nothing,
        // so callers can pass their error state straight through.
        for (const empty of [undefined, null, ""]) {
            const { container: c } = render(
                <AuthShell error={empty}>
                    <form />
                </AuthShell>,
            );
            expect(c.querySelector(".bg-error-soft")).toBeNull();
        }
    });

    it("keeps the footer's muted caption styling", () => {
        const { container } = render(
            <AuthShell footer={<>No account? Sign up</>}>
                <form />
            </AuthShell>,
        );
        const footer = container.querySelector(".mt-6");
        hasClasses(footer, YUNXIN.footer);
    });

    it("widens to max-w-md only when asked", () => {
        const { container } = render(
            <AuthShell width="md">
                <form />
            </AuthShell>,
        );
        hasClasses(container.firstElementChild!.firstElementChild, "w-full max-w-md");
    });

    it("centers the card contents for status screens without touching the chrome", () => {
        const { container } = render(
            <AuthShell centered title="Check your email">
                <form />
            </AuthShell>,
        );
        const panel = container.querySelector("h1")!.parentElement!;
        hasClasses(panel, `${YUNXIN.panel} text-center`);
    });
});
