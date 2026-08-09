import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useRef, useState } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";

import { useDismissOnOutside } from "../lib/hooks";

// =============================================================================
// Six components hand-rolled outside-click dismissal and no two agreed. This
// pins the union behaviour they were consolidated onto, because the ways it can
// silently regress are all invisible in a screenshot:
//   - a listener that stays registered while the panel is CLOSED runs on every
//     click in the host app (four of the six did this);
//   - `mousedown` without `touchstart` leaves a phone user holding the panel
//     open (four of the six did this too).
// =============================================================================

function Panel({
    escape = true,
    onState,
}: {
    escape?: boolean;
    onState?: (open: boolean) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    useDismissOnOutside(open, () => { setOpen(false); onState?.(false); }, ref, { escape });
    return (
        <div>
            <div ref={ref}>
                <button onClick={() => { setOpen(true); onState?.(true); }}>open</button>
                {open && <div data-testid="panel">panel</div>}
            </div>
            <button data-testid="outside">outside</button>
        </div>
    );
}

describe("useDismissOnOutside", () => {
    let added: string[];
    let addSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        added = [];
        addSpy = vi.spyOn(document, "addEventListener").mockImplementation(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function (this: Document, type: string, ...rest: any[]) {
                added.push(type);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return (EventTarget.prototype.addEventListener as any).call(this, type, ...rest);
            } as typeof document.addEventListener,
        );
    });
    afterEach(() => addSpy.mockRestore());

    it("registers nothing while the panel is closed", () => {
        render(<Panel />);
        expect(added).not.toContain("mousedown");
        expect(added).not.toContain("touchstart");
    });

    it("listens for both mouse and touch once open", () => {
        render(<Panel />);
        act(() => { screen.getByText("open").click(); });
        expect(added).toContain("mousedown");
        expect(added).toContain("touchstart");
    });

    it("closes on an outside press but not on an inside one", () => {
        render(<Panel />);
        act(() => { screen.getByText("open").click(); });
        expect(screen.getByTestId("panel")).toBeTruthy();

        // Inside: still open.
        fireEvent.mouseDown(screen.getByText("open"));
        expect(screen.queryByTestId("panel")).toBeTruthy();

        // Outside: gone.
        fireEvent.mouseDown(screen.getByTestId("outside"));
        expect(screen.queryByTestId("panel")).toBeNull();
    });

    it("closes on an outside touch, which four of the six copies never did", () => {
        render(<Panel />);
        act(() => { screen.getByText("open").click(); });
        fireEvent.touchStart(screen.getByTestId("outside"));
        expect(screen.queryByTestId("panel")).toBeNull();
    });

    it("closes on Escape by default and stays open when escape is off", () => {
        const { unmount } = render(<Panel />);
        act(() => { screen.getByText("open").click(); });
        fireEvent.keyDown(document, { key: "Escape" });
        expect(screen.queryByTestId("panel")).toBeNull();
        unmount();

        // `escape: false` is used by the components that run their own Escape
        // handler so they can also restore focus to the trigger.
        render(<Panel escape={false} />);
        act(() => { screen.getByText("open").click(); });
        fireEvent.keyDown(document, { key: "Escape" });
        expect(screen.queryByTestId("panel")).toBeTruthy();
    });

    it("removes its listeners again when the panel closes", () => {
        const removed: string[] = [];
        const removeSpy = vi.spyOn(document, "removeEventListener").mockImplementation(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function (this: Document, type: string, ...rest: any[]) {
                removed.push(type);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return (EventTarget.prototype.removeEventListener as any).call(this, type, ...rest);
            } as typeof document.removeEventListener,
        );
        render(<Panel />);
        act(() => { screen.getByText("open").click(); });
        fireEvent.mouseDown(screen.getByTestId("outside"));
        expect(removed).toContain("mousedown");
        expect(removed).toContain("touchstart");
        removeSpy.mockRestore();
    });
});
