import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from "../primitives/table";

describe("Table", () => {
    it("renders a semantic table with header, rows, and cells", () => {
        render(
            <Table>
                <TableCaption>Users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Ada</TableCell>
                        <TableCell>Admin</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );

        expect(screen.getByRole("table")).toBeInTheDocument();
        // column headers
        const headers = screen.getAllByRole("columnheader");
        expect(headers).toHaveLength(2);
        expect(headers[0]).toHaveTextContent("Name");
        // data cells
        const cells = screen.getAllByRole("cell");
        expect(cells).toHaveLength(2);
        expect(cells[0]).toHaveTextContent("Ada");
        // caption
        expect(screen.getByText("Users").tagName).toBe("CAPTION");
    });

    it("wraps the table in a horizontal overflow container", () => {
        const { container } = render(
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>x</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.tagName).toBe("DIV");
        expect(wrapper.className).toContain("overflow-x-auto");
        expect(wrapper.querySelector("table")).toBeTruthy();
    });

    it("passes className through to each part", () => {
        render(
            <Table className="t-table">
                <TableHeader className="t-head">
                    <TableRow className="t-row">
                        <TableHead className="t-th">H</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="t-body">
                    <TableRow>
                        <TableCell className="t-td">C</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
        expect(screen.getByRole("table")).toHaveClass("t-table");
        expect(screen.getByRole("columnheader")).toHaveClass("t-th");
        expect(screen.getByRole("cell")).toHaveClass("t-td");
    });

    it("makes a sortable TableHead a button with aria-sort and fires onSort", () => {
        const onSort = vi.fn();
        render(
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead onSort={onSort} sortDirection="asc" align="right">
                            Price
                        </TableHead>
                    </TableRow>
                </TableHeader>
            </Table>
        );
        const th = screen.getByRole("columnheader");
        expect(th).toHaveAttribute("aria-sort", "ascending");
        fireEvent.click(screen.getByRole("button", { name: /price/i }));
        expect(onSort).toHaveBeenCalledTimes(1);
    });

    it("renders a plain non-interactive TableHead when onSort is omitted", () => {
        render(
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                    </TableRow>
                </TableHeader>
            </Table>
        );
        expect(screen.getByRole("columnheader")).not.toHaveAttribute("aria-sort");
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("exposes short aliases that map to the same elements", () => {
        render(
            <Table>
                <Thead>
                    <Tr>
                        <Th>H</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>C</Td>
                    </Tr>
                </Tbody>
            </Table>
        );
        expect(screen.getByRole("columnheader")).toHaveTextContent("H");
        expect(screen.getByRole("cell")).toHaveTextContent("C");
    });
});
