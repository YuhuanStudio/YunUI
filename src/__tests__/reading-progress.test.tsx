import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReadingProgress } from "../patterns/reading-progress";

/** The component coalesces scroll into a frame, so the state change lands one
 *  rAF after the event.
 *
 *  Queued and flushed, not run inline. A stub that calls the callback
 *  immediately inverts the real ordering: the component does
 *  `frame = requestAnimationFrame(measure)`, and `measure` clears `frame` — so
 *  running it inline means the assignment lands *after* the clear and `frame`
 *  stays truthy forever, which silently ignores every later scroll. Real rAF
 *  returns first and runs the callback later; the queue reproduces that. */
let frames: FrameRequestCallback[] = [];

beforeEach(() => {
    frames = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
        frames.push(cb);
        return frames.length;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
});

function flushFrames() {
    const queued = frames;
    frames = [];
    act(() => {
        queued.forEach((cb) => cb(0));
    });
}

/** The progress bar's fill. Selected by its own class rather than by
 *  `[aria-hidden]`, which also matches the icon SVG inside the button. */
function fillOf(container: HTMLElement): HTMLElement {
    return container.querySelector(".origin-left") as HTMLElement;
}

/** Put the document somewhere specific and let the listener run. */
function scrollTo(y: number, { height = 3000, viewport = 1000 } = {}) {
    Object.defineProperty(document.documentElement, "scrollHeight", {
        value: height,
        configurable: true,
    });
    Object.defineProperty(window, "innerHeight", { value: viewport, configurable: true });
    Object.defineProperty(window, "scrollY", { value: y, configurable: true });
    act(() => {
        window.dispatchEvent(new Event("scroll"));
    });
    flushFrames();
}

describe("ReadingProgress", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("starts empty at the top of the page", () => {
        const { container } = render(<ReadingProgress />);
        scrollTo(0);
        const fill = fillOf(container);
        expect(fill.style.transform).toBe("scaleX(0)");
    });

    it("fills as the page is scrolled", () => {
        const { container } = render(<ReadingProgress />);
        // 1000 of a 2000px reach is half way.
        scrollTo(1000);
        const fill = fillOf(container);
        expect(fill.style.transform).toBe("scaleX(0.5)");
    });

    it("never exceeds one, however far the page is over-scrolled", () => {
        const { container } = render(<ReadingProgress />);
        scrollTo(9999);
        const fill = fillOf(container);
        expect(fill.style.transform).toBe("scaleX(1)");
    });

    it("does not divide by zero on a page shorter than the viewport", () => {
        const { container } = render(<ReadingProgress />);
        scrollTo(0, { height: 500, viewport: 1000 });
        const fill = fillOf(container);
        expect(fill.style.transform).toBe("scaleX(0)");
    });

    it("hides the back-to-top button until the threshold is passed", () => {
        render(<ReadingProgress threshold={500} />);
        scrollTo(100);
        expect(screen.getByRole("button", { name: "Back to top" }).className).toContain(
            "opacity-0"
        );
        scrollTo(900);
        expect(screen.getByRole("button", { name: "Back to top" }).className).toContain(
            "opacity-100"
        );
    });

    it("scrolls to the top when the button is pressed", async () => {
        const scroll = vi.fn();
        Object.defineProperty(window, "scrollTo", { value: scroll, configurable: true });
        render(<ReadingProgress threshold={0} />);
        scrollTo(900);
        await userEvent.click(screen.getByRole("button", { name: "Back to top" }));
        expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    it("uses the supplied label", () => {
        render(<ReadingProgress labels={{ backToTop: "回到頂端" }} />);
        expect(screen.getByRole("button", { name: "回到頂端" })).toBeInTheDocument();
    });

    it("can render either half alone", () => {
        const { container, rerender } = render(<ReadingProgress backToTop={false} />);
        expect(screen.queryByRole("button")).toBeNull();
        rerender(<ReadingProgress bar={false} />);
        expect(fillOf(container)).toBeNull();
    });

    it("removes its listeners on unmount", () => {
        const remove = vi.spyOn(window, "removeEventListener");
        render(<ReadingProgress />).unmount();
        const events = remove.mock.calls.map(([e]) => e);
        expect(events).toContain("scroll");
        expect(events).toContain("resize");
    });
});
