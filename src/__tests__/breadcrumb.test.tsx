import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { YunUIProvider } from "../adapters/context";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "../primitives/breadcrumb";

function renderTrail() {
    return render(
        <YunUIProvider>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Intro</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </YunUIProvider>
    );
}

describe("Breadcrumb", () => {
    it("renders a labelled navigation landmark", () => {
        renderTrail();
        expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    });

    it("supports a custom aria-label", () => {
        render(
            <Breadcrumb aria-label="You are here">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Now</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
        expect(screen.getByRole("navigation", { name: "You are here" })).toBeInTheDocument();
    });

    it("renders adapter links with hrefs", () => {
        renderTrail();
        const home = screen.getByRole("link", { name: "Home" });
        expect(home).toHaveAttribute("href", "/");
        const docs = screen.getByRole("link", { name: "Docs" });
        expect(docs).toHaveAttribute("href", "/docs");
    });

    it("marks the current page with aria-current=page", () => {
        renderTrail();
        const current = screen.getByText("Intro");
        expect(current).toHaveAttribute("aria-current", "page");
    });

    it("hides separators from the accessibility tree", () => {
        const { container } = renderTrail();
        const seps = container.querySelectorAll('[role="presentation"][aria-hidden="true"]');
        expect(seps.length).toBe(2);
    });
});
