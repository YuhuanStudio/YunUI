import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { AnimatedNumber } from "../primitives/animated-number";

// =============================================================================
// Yunxin kept a private copy of this component for exactly one reason: a spring
// never advances under jsdom, so the shared version rendered "0" forever and
// every assertion about a homepage stat failed. Its fork carried a
// `NODE_ENV === "test"` escape hatch.
//
// That hatch now lives here (generalised to reduced-motion too), so these tests
// are what stop the fork coming back.
// =============================================================================

describe("AnimatedNumber", () => {
    it("prints the final value immediately under a test runner", () => {
        render(<AnimatedNumber value={1234} />);
        expect(screen.getByText("1234")).toBeTruthy();
    });

    it("strips trailing zeros and appends the suffix", () => {
        render(<AnimatedNumber value={100} decimals={2} suffix="%" />);
        expect(screen.getByText("100%")).toBeTruthy();

        render(<AnimatedNumber value={99.99} decimals={2} suffix="%" />);
        expect(screen.getByText("99.99%")).toBeTruthy();
    });

    it("rounds when decimals is 0", () => {
        render(<AnimatedNumber value={41.6} suffix="+" />);
        expect(screen.getByText("42+")).toBeTruthy();
    });

    it("honours an explicit immediate={false} even in a test run", () => {
        // The override has to win, or a host could never exercise the animation.
        render(<AnimatedNumber value={500} immediate={false} />);
        expect(screen.queryByText("500")).toBeNull();
    });
});
