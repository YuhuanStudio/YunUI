import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Flex, Grid, Column, Row, Stack } from "../primitives";

describe("Flex", () => {
    it("is a flex row by default and renders children", () => {
        render(<Flex data-testid="f">hi</Flex>);
        const el = screen.getByTestId("f");
        expect(el).toHaveClass("flex", "flex-row");
        expect(el).toHaveTextContent("hi");
    });

    it("maps gap, justify, align, and wrap to literal Tailwind classes", () => {
        render(
            <Flex data-testid="f" gap={4} justify="between" align="center" wrap>
                x
            </Flex>
        );
        expect(screen.getByTestId("f")).toHaveClass(
            "gap-4",
            "justify-between",
            "items-center",
            "flex-wrap"
        );
    });

    it("maps padding / px / py to the spacing scale", () => {
        render(<Flex data-testid="f" padding={6} px={2} py={8} />);
        expect(screen.getByTestId("f")).toHaveClass("p-6", "px-2", "py-8");
    });

    it("supports gap={0} (falsy but valid)", () => {
        render(<Flex data-testid="f" gap={0} />);
        expect(screen.getByTestId("f")).toHaveClass("gap-0");
    });

    it("renders the element given by `as`", () => {
        render(
            <Flex as="section" data-testid="f">
                s
            </Flex>
        );
        expect(screen.getByTestId("f").tagName).toBe("SECTION");
    });

    it("merges a custom className", () => {
        render(<Flex data-testid="f" className="text-red-500" />);
        expect(screen.getByTestId("f")).toHaveClass("flex", "text-red-500");
    });
});

describe("Grid", () => {
    it("maps columns to a mobile-first responsive ramp and renders children", () => {
        render(
            <Grid data-testid="g" columns={3}>
                cell
            </Grid>
        );
        const el = screen.getByTestId("g");
        // responsive by default: stacks on mobile, 3 cols at sm+
        expect(el).toHaveClass("grid", "grid-cols-1", "sm:grid-cols-3");
        expect(el).toHaveTextContent("cell");
    });

    it("uses literal grid-cols-N when responsive={false}", () => {
        render(<Grid data-testid="g" columns={3} responsive={false} />);
        expect(screen.getByTestId("g")).toHaveClass("grid", "grid-cols-3");
    });

    it("maps rows, gap, align, and padding", () => {
        render(<Grid data-testid="g" rows={2} gap={6} align="stretch" padding={4} />);
        expect(screen.getByTestId("g")).toHaveClass(
            "grid-rows-2",
            "gap-6",
            "items-stretch",
            "p-4"
        );
    });
});

describe("Column / Row / Stack", () => {
    it("Column is a flex column", () => {
        render(<Column data-testid="c">c</Column>);
        expect(screen.getByTestId("c")).toHaveClass("flex", "flex-col");
    });

    it("Row is a flex row", () => {
        render(<Row data-testid="r">r</Row>);
        expect(screen.getByTestId("r")).toHaveClass("flex", "flex-row");
    });

    it("Stack defaults to a column with gap-4", () => {
        render(<Stack data-testid="s">s</Stack>);
        expect(screen.getByTestId("s")).toHaveClass("flex", "flex-col", "gap-4");
    });

    it("Stack lets you override the default gap", () => {
        render(
            <Stack data-testid="s" gap={8}>
                s
            </Stack>
        );
        const el = screen.getByTestId("s");
        expect(el).toHaveClass("gap-8");
        expect(el).not.toHaveClass("gap-4");
    });
});
