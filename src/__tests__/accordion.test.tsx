import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "../primitives";

// -----------------------------------------------------------------------------
// Accordion — Radix Accordion wrapper. Triggers render as role="button" inside a
// header; the open panel exposes role="region". Closed Radix panels are not
// mounted by default. Keyboard a11y (Enter/Space/arrows) comes from Radix.
// -----------------------------------------------------------------------------

function SingleExample({ collapsible = true }: { collapsible?: boolean }) {
    return (
        <Accordion type="single" collapsible={collapsible} defaultValue="one">
            <AccordionItem value="one">
                <AccordionTrigger>First</AccordionTrigger>
                <AccordionContent>First panel</AccordionContent>
            </AccordionItem>
            <AccordionItem value="two">
                <AccordionTrigger>Second</AccordionTrigger>
                <AccordionContent>Second panel</AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

describe("Accordion", () => {
    it("renders triggers as buttons with aria-expanded reflecting open state", () => {
        render(<SingleExample />);
        const first = screen.getByRole("button", { name: "First" });
        const second = screen.getByRole("button", { name: "Second" });

        expect(first).toHaveAttribute("aria-expanded", "true");
        expect(second).toHaveAttribute("aria-expanded", "false");
    });

    it("exposes the open panel as a region and hides closed panels", () => {
        render(<SingleExample />);
        const regions = screen.getAllByRole("region");
        expect(regions).toHaveLength(1);
        expect(regions[0]).toHaveTextContent("First panel");
        // Closed Radix panels are not mounted.
        expect(screen.queryByText("Second panel")).toBeNull();
    });

    it("opens another item and (single type) closes the previously open one", async () => {
        const user = userEvent.setup();
        render(<SingleExample />);

        await user.click(screen.getByRole("button", { name: "Second" }));

        expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
            "aria-expanded",
            "true"
        );
        expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
            "aria-expanded",
            "false"
        );
        expect(screen.getByText("Second panel")).toBeInTheDocument();
        expect(screen.queryByText("First panel")).toBeNull();
    });

    it("collapses the open item when collapsible and re-clicked", async () => {
        const user = userEvent.setup();
        render(<SingleExample />);

        await user.click(screen.getByRole("button", { name: "First" }));

        expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
            "aria-expanded",
            "false"
        );
        expect(screen.queryByText("First panel")).toBeNull();
    });

    it("toggles a panel via keyboard (Enter) when the trigger is focused", async () => {
        const user = userEvent.setup();
        render(<SingleExample />);

        const second = screen.getByRole("button", { name: "Second" });
        second.focus();
        await user.keyboard("{Enter}");

        expect(second).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByText("Second panel")).toBeInTheDocument();
    });

    it("supports multiple open panels with type=multiple", async () => {
        const user = userEvent.setup();
        render(
            <Accordion type="multiple" defaultValue={["a"]}>
                <AccordionItem value="a">
                    <AccordionTrigger>Alpha</AccordionTrigger>
                    <AccordionContent>Alpha panel</AccordionContent>
                </AccordionItem>
                <AccordionItem value="b">
                    <AccordionTrigger>Beta</AccordionTrigger>
                    <AccordionContent>Beta panel</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        await user.click(screen.getByRole("button", { name: "Beta" }));

        // Both remain open.
        expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
            "aria-expanded",
            "true"
        );
        expect(screen.getByRole("button", { name: "Beta" })).toHaveAttribute(
            "aria-expanded",
            "true"
        );
        expect(screen.getByText("Alpha panel")).toBeInTheDocument();
        expect(screen.getByText("Beta panel")).toBeInTheDocument();
    });
});
