import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Users } from "lucide-react";
import { StatCard } from "../patterns/stat-card";

describe("StatCard", () => {
  it("renders label and value (default layout)", () => {
    render(<StatCard label="Users" value="1,234" />);
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("tones the value with the semantic color", () => {
    render(<StatCard label="Pending" value="5" tone="amber" />);
    expect(screen.getByText("5").className).toContain("text-amber-600");
  });

  it("inline variant renders the compact `card p-4` row", () => {
    const { container } = render(<StatCard inline icon={Users} label="Total" value="9" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("card");
    expect(root.className).toContain("p-4");
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("renders a trend percentage", () => {
    const { container } = render(
      <StatCard label="Requests" value="10" trend={{ value: 12.3, positive: true }} />
    );
    expect(container.textContent).toContain("12.3");
  });
});
