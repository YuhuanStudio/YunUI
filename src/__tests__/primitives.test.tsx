import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button, Card, Badge, Spinner, EmptyState, Input } from "../primitives";

describe("Button", () => {
  it("maps variant + size to the global .btn classes", () => {
    render(<Button variant="primary" size="lg">Go</Button>);
    expect(screen.getByRole("button", { name: "Go" })).toHaveClass("btn", "btn-primary", "btn-lg");
  });

  it("is disabled while loading", () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("asChild renders the child with button styling and no extra <button>", () => {
    render(<Button asChild variant="secondary"><a href="/x">Link</a></Button>);
    expect(screen.getByRole("link", { name: "Link" })).toHaveClass("btn", "btn-secondary");
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("Card", () => {
  it("renders the .card utility class", () => {
    render(<Card data-testid="c">x</Card>);
    expect(screen.getByTestId("c")).toHaveClass("card");
  });

  it("adds hover affordances when `hover`", () => {
    render(<Card hover data-testid="c">x</Card>);
    expect(screen.getByTestId("c").className).toContain("hover:border-ring");
  });
});

describe("Badge", () => {
  it("applies the semantic variant color", () => {
    render(<Badge variant="success">ok</Badge>);
    expect(screen.getByText("ok").className).toContain("bg-green-50");
  });
});

describe("Spinner", () => {
  it("exposes a status role for assistive tech", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="Nothing here" description="No items yet" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByText("No items yet")).toBeInTheDocument();
  });
});

describe("Input", () => {
  it("shows an error message when `error` is set", () => {
    render(<Input error="Required" defaultValue="" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});
