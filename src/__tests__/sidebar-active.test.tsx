import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { YunUIProvider } from "../adapters/context";
import { Sidebar } from "../patterns/sidebar";

const sections = [
    {
        title: "Main",
        items: [
            { label: "Overview", href: "/dashboard" },
            { label: "Playground", href: "/dashboard/playground" },
            { label: "Reports", href: "/reports" },
            { label: "Providers", href: "/dashboard/admin/providers", match: ["/dashboard/admin/models"] },
        ],
    },
];

function activeLabels(currentPath: string): string[] {
    render(
        <YunUIProvider>
            <Sidebar appName="Test" sections={sections} currentPath={currentPath} />
        </YunUIProvider>,
    );
    return sections[0].items
        .map((item) => screen.getByText(item.label).closest("a, button"))
        .filter((el): el is HTMLElement => !!el && el.className.includes("active"))
        .map((el) => el.textContent?.trim() ?? "");
}

describe("Sidebar active state", () => {
    it("lights only the deepest matching item, not every ancestor", () => {
        expect(activeLabels("/dashboard/playground")).toEqual(["Playground"]);
    });

    it("still lights a section root on its own page", () => {
        expect(activeLabels("/dashboard")).toEqual(["Overview"]);
    });

    it("does not match a sibling that merely shares a prefix string", () => {
        expect(activeLabels("/reports-archive")).toEqual([]);
    });

    it("honours an explicit match prefix", () => {
        expect(activeLabels("/dashboard/admin/models")).toEqual(["Providers"]);
    });
});
