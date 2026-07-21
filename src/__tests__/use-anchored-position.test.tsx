import { useRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
});
