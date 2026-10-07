import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BarChart, DonutChart, Heatmap, type ChartDatum } from "../primitives/distribution-charts";

const data: ChartDatum[] = [
  { id: "small", label: "Small", value: 2, tone: "info" },
  { id: "zero", label: "Zero", value: 0, tone: "success" },
  { id: "negative", label: "Negative", value: -1 },
  { id: "missing", label: "Missing", value: null },
  { id: "bad", label: "Bad", value: Number.NaN },
];

describe("BarChart", () => {
  it("keeps zero visible while marking null and non-finite values unavailable", () => {
    render(<BarChart data={data} ariaLabel="Distribution" unavailableLabel="Not reported" />);

    expect(screen.getByRole("group", { name: "Distribution" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Zero: 0" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Missing: Not reported" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Negative: Not reported" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Bad: Not reported" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Zero: 0" }).getAttribute("style")).toContain("height: 1px");
  });

  it("uses click and native keyboard activation only when a selection callback is provided", () => {
    const activeAtSelection: Element[] = [];
    const onSelect = vi.fn(() => { if (document.activeElement) activeAtSelection.push(document.activeElement); });
    render(<BarChart data={data} ariaLabel="Distribution" onSelect={onSelect} />);
    const bar = screen.getByRole("button", { name: "Small: 2" });
    fireEvent.click(bar);
    fireEvent.keyDown(bar, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenNthCalledWith(1, data[0]);
    expect(activeAtSelection[0]).toBe(bar);

    const unavailable = screen.getByRole("button", { name: "Missing: Unavailable" });
    fireEvent.click(unavailable);
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it("renders a host-replaceable empty state", () => {
    render(<BarChart data={[]} ariaLabel="Distribution" emptyLabel="Nothing measured" />);
    expect(screen.getByRole("img", { name: "Distribution" }).textContent).toBe("Nothing measured");
  });
});

describe("DonutChart", () => {
  it("excludes unavailable/invalid values from shares and reports zero as a real value", () => {
    render(<DonutChart data={data} ariaLabel="Share" unavailableLabel="Not reported" />);
    const chart = screen.getByRole("group", { name: "Share" });
    expect(within(chart).getAllByText("2")).toHaveLength(2); // center total and legend value
    expect(within(chart).getByText("0")).toBeTruthy();
    expect(within(chart).getAllByText("Not reported")).toHaveLength(3);
    expect(chart.textContent).toContain("100.0%");
  });

  it("shows a neutral all-zero ring without NaN and selects a legend item", () => {
    const activeAtSelection: Element[] = [];
    const onSelect = vi.fn(() => { if (document.activeElement) activeAtSelection.push(document.activeElement); });
    const zeroes: ChartDatum[] = [{ id: "a", label: "A", value: 0 }, { id: "b", label: "B", value: 0 }];
    render(<DonutChart data={zeroes} ariaLabel="Zero chart" center="No total" onSelect={onSelect} />);
    const chart = screen.getByRole("group", { name: "Zero chart" });
    expect(chart.textContent).toContain("No total");
    expect(chart.textContent).not.toContain("NaN");
    fireEvent.click(within(chart).getByRole("button", { name: /A/ }));
    expect(onSelect).toHaveBeenCalledWith(zeroes[0]);
    expect(activeAtSelection[0]).toBe(within(chart).getByRole("button", { name: /A/ }));
    expect(chart.querySelector("[aria-hidden='true']")?.getAttribute("style")).toContain("min(208px, 100%)");
  });

  it("shows zero for all-zero data and disables unavailable legend selection", () => {
    const onSelect = vi.fn();
    const zeroes: ChartDatum[] = [{ id: "zero", label: "Zero", value: 0 }, { id: "missing", label: "Missing", value: null }];
    render(<DonutChart data={zeroes} ariaLabel="Zero and missing" onSelect={onSelect} />);
    const chart = screen.getByRole("group", { name: "Zero and missing" });
    expect(within(chart).getAllByText("0")).toHaveLength(2);
    const missing = within(chart).getByRole("button", { name: /Missing/ });
    expect((missing as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(missing);
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe("Heatmap", () => {
  const props = {
    rows: ["R1", "R2"],
    columns: ["C1", "C2", "C3"],
    data: [[0, 5, null], [-2, Number.NaN, 1]],
    ariaLabel: "Latency grid",
    formatValue: (value: number) => `${value}ms`,
    unavailableLabel: "No sample",
  } as const;

  it("distinguishes zero from missing cells and exposes an accessible grid", () => {
    render(<Heatmap {...props} />);
    const grid = screen.getByRole("grid", { name: "Latency grid" });
    expect(within(grid).getByRole("gridcell", { name: "R1, C1: 0ms" })).toBeTruthy();
    expect(within(grid).getByRole("gridcell", { name: "R1, C3: No sample" })).toBeTruthy();
    expect(within(grid).getAllByRole("gridcell", { name: /No sample/ })).toHaveLength(2);
  });

  it("moves one roving tab stop with arrows and Home/End, and selects the focused cell", () => {
    const activeAtSelection: Element[] = [];
    const onSelect = vi.fn(() => { if (document.activeElement) activeAtSelection.push(document.activeElement); });
    render(<Heatmap {...props} onSelect={onSelect} />);
    const first = screen.getByRole("gridcell", { name: "R1, C1: 0ms" });
    expect(first.getAttribute("tabindex")).toBe("0");
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    const second = screen.getByRole("gridcell", { name: "R1, C2: 5ms" });
    expect(document.activeElement).toBe(second);
    expect(second.getAttribute("style")).toContain("--accent-on-solid-strong");
    expect(screen.getByText("R1 · C2: 5ms")).toBeTruthy();
    fireEvent.keyDown(second, { key: "End" });
    const third = screen.getByRole("gridcell", { name: "R1, C3: No sample" });
    expect(document.activeElement).toBe(third);
    fireEvent.click(third);
    expect(onSelect).toHaveBeenCalledWith(0, 2);
    expect(activeAtSelection[0]).toBe(third);
    expect(screen.getByText("R1 · C3: No sample")).toBeTruthy();
    expect(screen.getAllByRole("gridcell").filter((cell) => cell.getAttribute("tabindex") === "0")).toHaveLength(1);
  });

  it("updates a persistent readout on hover without relying on a floating tooltip", () => {
    render(<Heatmap {...props} />);
    const cell = screen.getByRole("gridcell", { name: "R2, C1: -2ms" });
    fireEvent.mouseEnter(cell);
    expect(screen.getByText("R2 · C1: -2ms")).toBeTruthy();
    expect(cell.querySelector("span[aria-hidden='true']")).toBeNull();
  });

  it("renders an empty state when either axis is empty", () => {
    render(<Heatmap rows={[]} columns={props.columns} data={[]} ariaLabel="Empty grid" emptyLabel="No matrix" />);
    expect(screen.getByRole("img", { name: "Empty grid" }).textContent).toBe("No matrix");
  });
});
