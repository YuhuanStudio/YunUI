import { useRef } from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAnchoredPosition } from "../lib/use-anchored-position";

function Fixture({ open }: { open: boolean }) {
    const panelRef = useRef<HTMLDivElement>(null);
    const position = useAnchoredPosition(open, panelRef);
    return (
        <div data-testid="clip" style={{ overflowY: "auto" }}>
            <div data-testid="anchor">
                <div
                    ref={panelRef}
                    data-testid="panel"
                    data-placement={position.placement}
                    data-max-height={position.maxHeight}
                />
            </div>
        </div>
    );
}

describe("useAnchoredPosition", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("flips above when a scroll ancestor clips space that exists in the viewport", () => {
        const { rerender } = render(<Fixture open={false} />);
        const clip = screen.getByTestId("clip");
        const anchor = screen.getByTestId("anchor");
        const panel = screen.getByTestId("panel");

        Object.defineProperties(panel, {
            offsetParent: { configurable: true, value: anchor },
            offsetLeft: { configurable: true, value: 0 },
            offsetWidth: { configurable: true, value: 240 },
            scrollHeight: { configurable: true, value: 120 },
        });
        clip.getBoundingClientRect = () => ({
            x: 80, y: 100, top: 100, right: 420, bottom: 600, left: 80,
            width: 340, height: 500, toJSON: () => ({}),
        });
        anchor.getBoundingClientRect = () => ({
            x: 100, y: 540, top: 540, right: 380, bottom: 580, left: 100,
            width: 280, height: 40, toJSON: () => ({}),
        });

        rerender(<Fixture open />);

        expect(panel).toHaveAttribute("data-placement", "top");
        expect(panel).not.toHaveAttribute("data-max-height");
    });

    it("caps height to the real available side instead of overflowing a small boundary", () => {
        const { rerender } = render(<Fixture open={false} />);
        const clip = screen.getByTestId("clip");
        const anchor = screen.getByTestId("anchor");
        const panel = screen.getByTestId("panel");

        Object.defineProperties(panel, {
            offsetParent: { configurable: true, value: anchor },
            offsetLeft: { configurable: true, value: 0 },
            offsetWidth: { configurable: true, value: 240 },
            scrollHeight: { configurable: true, value: 240 },
        });
        clip.getBoundingClientRect = () => ({
            x: 80, y: 100, top: 100, right: 420, bottom: 300, left: 80,
            width: 340, height: 200, toJSON: () => ({}),
        });
        anchor.getBoundingClientRect = () => ({
            x: 100, y: 190, top: 190, right: 380, bottom: 230, left: 100,
            width: 280, height: 40, toJSON: () => ({}),
        });

        rerender(<Fixture open />);

        expect(panel).toHaveAttribute("data-placement", "top");
        expect(panel).toHaveAttribute("data-max-height", "82");
    });

    it("remeasures when open panel content changes without a viewport event", () => {
        let notifyResize: (() => void) | undefined;
        const observe = vi.fn();
        const disconnect = vi.fn();
        vi.stubGlobal("ResizeObserver", class {
            constructor(callback: ResizeObserverCallback) {
                notifyResize = () => callback([], this as unknown as ResizeObserver);
            }
            observe = observe;
            disconnect = disconnect;
            unobserve = vi.fn();
        });

        let naturalHeight = 300;
        const { rerender } = render(<Fixture open={false} />);
        const clip = screen.getByTestId("clip");
        const anchor = screen.getByTestId("anchor");
        const panel = screen.getByTestId("panel");

        Object.defineProperties(panel, {
            offsetParent: { configurable: true, value: anchor },
            offsetLeft: { configurable: true, value: 0 },
            offsetWidth: { configurable: true, value: 240 },
            scrollHeight: { configurable: true, get: () => naturalHeight },
        });
        clip.getBoundingClientRect = () => ({
            x: 80, y: 0, top: 0, right: 420, bottom: 500, left: 80,
            width: 340, height: 500, toJSON: () => ({}),
        });
        anchor.getBoundingClientRect = () => ({
            x: 100, y: 300, top: 300, right: 380, bottom: 392, left: 100,
            width: 280, height: 92, toJSON: () => ({}),
        });

        rerender(<Fixture open />);
        expect(panel).toHaveAttribute("data-placement", "top");
        expect(panel).toHaveAttribute("data-max-height", "292");
        expect(observe).toHaveBeenCalledWith(panel);
        expect(observe).toHaveBeenCalledWith(anchor);

        naturalHeight = 60;
        act(() => notifyResize?.());

        expect(panel).toHaveAttribute("data-placement", "bottom");
        expect(panel).not.toHaveAttribute("data-max-height");
    });
});
