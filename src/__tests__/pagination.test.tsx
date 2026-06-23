import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../primitives/pagination";

describe("Pagination", () => {
    it("returns null when there is a single page", () => {
        const { container } = render(
            <Pagination page={1} totalPages={1} onPageChange={() => {}} />
        );
        expect(container.firstChild).toBeNull();
    });

    it("renders a numbered button per page for small ranges", () => {
        render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);
        expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Go to page 2" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Go to page 3" })).toBeInTheDocument();
    });

    it("calls onPageChange with the clicked page", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();
        render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />);
        await user.click(screen.getByRole("button", { name: "Go to page 3" }));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it("marks the active page with aria-current=page", () => {
        render(<Pagination page={2} totalPages={5} onPageChange={() => {}} />);
        const active = screen.getByRole("button", { name: "Go to page 2" });
        expect(active).toHaveAttribute("aria-current", "page");
        expect(
            screen.getByRole("button", { name: "Go to page 1" })
        ).not.toHaveAttribute("aria-current");
    });

    it("disables previous at the first page and next at the last", () => {
        const { rerender } = render(
            <Pagination page={1} totalPages={5} onPageChange={() => {}} />
        );
        expect(screen.getByRole("button", { name: "Go to previous page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Go to next page" })).not.toBeDisabled();

        rerender(<Pagination page={5} totalPages={5} onPageChange={() => {}} />);
        expect(screen.getByRole("button", { name: "Go to next page" })).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Go to previous page" })
        ).not.toBeDisabled();
    });

    it("prev/next move by one page", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();
        render(<Pagination page={3} totalPages={10} onPageChange={onPageChange} />);
        await user.click(screen.getByRole("button", { name: "Go to previous page" }));
        expect(onPageChange).toHaveBeenCalledWith(2);
        await user.click(screen.getByRole("button", { name: "Go to next page" }));
        expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it("renders ellipsis truncation for many pages", () => {
        render(<Pagination page={6} totalPages={20} onPageChange={() => {}} />);
        // first and last always visible
        expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Go to page 20" })).toBeInTheDocument();
        // siblings around current
        expect(screen.getByRole("button", { name: "Go to page 5" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Go to page 6" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Go to page 7" })).toBeInTheDocument();
        // distant pages collapsed
        expect(screen.queryByRole("button", { name: "Go to page 10" })).toBeNull();
        // two ellipsis gaps (one each side)
        expect(screen.getAllByText("…")).toHaveLength(2);
    });

    it("respects a wider siblingCount", () => {
        render(
            <Pagination page={10} totalPages={20} siblingCount={2} onPageChange={() => {}} />
        );
        expect(screen.getByRole("button", { name: "Go to page 8" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Go to page 12" })).toBeInTheDocument();
    });
});
