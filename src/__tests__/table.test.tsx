import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
