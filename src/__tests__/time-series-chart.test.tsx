import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TimeSeriesChart, type TimeSeriesDefinition, type TimeSeriesPoint } from "../primitives/time-series-chart";

const twoSeries: TimeSeriesDefinition[] = [
  { key: "decode", label: "Decode" },
  { key: "prefill", label: "Prefill", tone: "info", dashed: true },
];

afterEach(() => vi.unstubAllGlobals());

describe("TimeSeriesChart", () => {
  it("sorts numeric x values, lets the last duplicate win, and keeps null/maxGap samples disconnected", () => {
    const data: TimeSeriesPoint[] = [
      { x: 6, values: { decode: 61, prefill: 33 } },
      { x: 3, values: { decode: 30, prefill: 20 } },
      { x: 0, values: { decode: 0, prefill: 10 } },
      { x: 2, values: { decode: 20, prefill: 16 } },
      { x: 1, values: { decode: null, prefill: Number.NaN } },
      { x: 6, values: { decode: 66, prefill: 36 } },
      { x: Number.NaN, values: { decode: 999, prefill: 999 } },
    ];
    render(<TimeSeriesChart data={data} series={twoSeries} ariaLabel="Fixture rates" activeX={6} maxGap={2} formatY={(value) => `${value} units`} />);

    expect(document.querySelector('[data-yunui="time-series-readout"]')).toHaveTextContent("66 units");
    expect(document.querySelector('[data-yunui="time-series-readout"]')).toHaveTextContent("36 units");
    const paths = document.querySelectorAll('[data-yunui="time-series-chart"] svg path[stroke]');
    // x=0 and x=6 are isolated by a missing value / maxGap; only x=2→3 is connected.
    expect(paths).toHaveLength(2);
    for (const path of paths) expect(path.getAttribute("d")).not.toMatch(/NaN|Infinity/);
    expect(document.querySelectorAll('[data-yunui="time-series-chart"] svg circle')).toHaveLength(6);
  });

  it("renders a constant one-point series with a visible marker and no divide-by-zero output", () => {
    render(<TimeSeriesChart data={[{ x: 5, values: { decode: 12 } }]} series={[{ key: "decode", label: "Decode" }]} ariaLabel="Single rate" activeX={5} formatX={(value) => `x=${value}`} />);
    const svg = screen.getByRole("group", { name: "Single rate" }).querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelectorAll("circle")).toHaveLength(2);
    expect(svg?.innerHTML).not.toMatch(/NaN|Infinity/);
    expect(document.querySelector('[data-yunui="time-series-readout"]')).toHaveTextContent("x=5");
    expect(document.querySelector('[data-yunui="time-series-readout"]')).toHaveTextContent("12");
  });

  it("supports pointer-nearest and Home/End/arrow keyboard selection with host callbacks", () => {
    const onActiveXChange = vi.fn();
    const { container } = render(
      <TimeSeriesChart
        data={[{ x: 10, values: { decode: 1, prefill: 4 } }, { x: 20, values: { decode: 2, prefill: 5 } }, { x: 40, values: { decode: 3, prefill: 6 } }]}
        series={twoSeries}
        ariaLabel="Throughput samples"
        onActiveXChange={onActiveXChange}
        formatX={(value) => `T${value}`}
      />,
    );
    const group = screen.getByRole("group", { name: "Throughput samples" });
    group.focus();
    fireEvent.keyDown(group, { key: "Home" });
    expect(onActiveXChange).toHaveBeenLastCalledWith(10);
    fireEvent.keyDown(group, { key: "ArrowRight" });
    expect(onActiveXChange).toHaveBeenLastCalledWith(20);
    fireEvent.keyDown(group, { key: "End" });
    expect(onActiveXChange).toHaveBeenLastCalledWith(40);
    expect(document.querySelector('[data-yunui="time-series-chart"]')).toHaveAttribute("data-active-x", "40");

    const svg = container.querySelector("svg")!;
    svg.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 640, bottom: 252, width: 640, height: 252, toJSON: () => ({}) });
    fireEvent.pointerMove(svg, { clientX: 340, clientY: 90, pointerId: 1 });
    expect(onActiveXChange).toHaveBeenLastCalledWith(20);
    expect(document.querySelector('[data-yunui="time-series-readout"]')).toHaveTextContent("T20");
  });

  it("toggles each legend series and keeps the readout for all series", () => {
    render(<TimeSeriesChart data={[{ x: 1, values: { decode: 10, prefill: 20 } }, { x: 2, values: { decode: 12, prefill: 22 } }]} series={twoSeries} ariaLabel="Rates" activeX={2} />);
    const decode = screen.getByRole("button", { name: "Decode" });
    expect(decode).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(decode);
    expect(decode).toHaveAttribute("aria-pressed", "false");
    const paths = [...document.querySelectorAll('[data-yunui="time-series-chart"] svg path[stroke]')];
    expect(paths).toHaveLength(1);
    expect(paths[0]?.getAttribute("stroke")).toBe("var(--info)");
    expect(document.querySelector('[data-yunui="time-series-readout"]')).toHaveTextContent("Decode12");
    expect(document.querySelector('[data-yunui="time-series-readout"]')).toHaveTextContent("Prefill22");
  });

  it("adapts x-axis density to long labels on a narrow plot and localizes legend/hint/missing values", async () => {
    vi.stubGlobal("ResizeObserver", undefined);
    const { container } = render(
      <TimeSeriesChart
        data={[{ x: 1, values: { decode: null, prefill: 2 } }, { x: 2, values: { decode: 3, prefill: 4 } }, { x: 3, values: { decode: 5, prefill: 6 } }, { x: 4, values: { decode: 7, prefill: 8 } }, { x: 5, values: { decode: 9, prefill: 10 } }, { x: 6, values: { decode: 11, prefill: 12 } }]}
        series={twoSeries}
        ariaLabel="Rates"
        activeX={1}
        legendLabel="圖例"
        keyboardHint="使用方向鍵查看資料"
        missingValueLabel="尚未量測"
        formatX={(value) => `12:34:${String(value).padStart(2, "0")}`}
      />,
    );
    const group = screen.getByRole("group", { name: "Rates" });
    group.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 320, bottom: 252, width: 320, height: 252, toJSON: () => ({}) });
    fireEvent(window, new Event("resize"));
    await waitFor(() => expect(container.querySelectorAll('svg text[data-axis="x"]').length).toBeLessThanOrEqual(4));
    expect(container.querySelectorAll('svg text[data-axis="x"]').length).toBeGreaterThan(0);
    expect(screen.getByRole("group", { name: "Rates 圖例" })).toBeInTheDocument();
    expect(container.querySelector("figcaption")).toHaveTextContent("使用方向鍵查看資料");
    expect(container.querySelector('[data-yunui="time-series-readout"]')).toHaveTextContent("尚未量測");
  });

  it("uses the caller's hidden-series message when every legend series is turned off", () => {
    render(<TimeSeriesChart data={[{ x: 1, values: { decode: 10 } }, { x: 2, values: { decode: 20 } }]} series={[{ key: "decode", label: "Decode" }]} ariaLabel="Rates" hiddenLabel="全部序列已隱藏" />);
    fireEvent.click(screen.getByRole("button", { name: "Decode" }));
    expect(screen.getByRole("status")).toHaveTextContent("全部序列已隱藏");
  });

  it("distinguishes empty data from samples with no finite values", () => {
    const { rerender } = render(<TimeSeriesChart data={[]} series={twoSeries} ariaLabel="Empty rates" emptyLabel="No samples in this window" unavailableLabel="Rate is unavailable" />);
    expect(screen.getByRole("status")).toHaveTextContent("No samples in this window");
    rerender(<TimeSeriesChart data={[{ x: 1, values: { decode: null, prefill: Number.POSITIVE_INFINITY } }]} series={twoSeries} ariaLabel="Unavailable rates" emptyLabel="No samples in this window" unavailableLabel="Rate is unavailable" />);
    expect(screen.getByRole("status")).toHaveTextContent("Rate is unavailable");
    expect(screen.queryByRole("group", { name: "Unavailable rates" })).not.toHaveAttribute("tabindex", "0");
  });

  it("treats a controlled activeX without a callback as read-only", () => {
    render(<TimeSeriesChart data={[{ x: 1, values: { decode: 10 } }, { x: 2, values: { decode: 20 } }]} series={[{ key: "decode", label: "Decode" }]} ariaLabel="Read only" activeX={1} />);
    const group = screen.getByRole("group", { name: "Read only" });
    group.focus();
    fireEvent.keyDown(group, { key: "End" });
    expect(document.querySelector('[data-yunui="time-series-chart"]')).toHaveAttribute("data-active-x", "1");
    expect(document.querySelector('[data-yunui="time-series-readout"]')).toHaveTextContent("10");
  });

  it("keeps controlled and keyboard selections on pointer leave, but clears transient hover selection", () => {
    const onControlledChange = vi.fn();
    const controlled = render(<TimeSeriesChart data={[{ x: 1, values: { decode: 10 } }, { x: 2, values: { decode: 20 } }]} series={[{ key: "decode", label: "Decode" }]} ariaLabel="Controlled selection" activeX={1} onActiveXChange={onControlledChange} />);
    const controlledGroup = screen.getByRole("group", { name: "Controlled selection" });
    fireEvent.pointerLeave(controlledGroup);
    expect(onControlledChange).not.toHaveBeenCalled();
    expect(controlled.container.querySelector('[data-yunui="time-series-chart"]')).toHaveAttribute("data-active-x", "1");
    controlled.unmount();

    const keyboard = render(<TimeSeriesChart data={[{ x: 1, values: { decode: 10 } }, { x: 2, values: { decode: 20 } }]} series={[{ key: "decode", label: "Decode" }]} ariaLabel="Keyboard selection" />);
    const keyboardGroup = screen.getByRole("group", { name: "Keyboard selection" });
    fireEvent.keyDown(keyboardGroup, { key: "End" });
    fireEvent.pointerLeave(keyboardGroup);
    expect(keyboard.container.querySelector('[data-yunui="time-series-chart"]')).toHaveAttribute("data-active-x", "2");
    keyboard.unmount();

    const pointer = render(<TimeSeriesChart data={[{ x: 1, values: { decode: 10 } }, { x: 2, values: { decode: 20 } }]} series={[{ key: "decode", label: "Decode" }]} ariaLabel="Pointer selection" />);
    const pointerGroup = screen.getByRole("group", { name: "Pointer selection" });
    const svg = pointer.container.querySelector("svg")!;
    svg.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 640, bottom: 252, width: 640, height: 252, toJSON: () => ({}) });
    fireEvent.pointerMove(svg, { clientX: 600, clientY: 90, pointerId: 1 });
    expect(pointer.container.querySelector('[data-yunui="time-series-chart"]')).toHaveAttribute("data-active-x", "2");
    fireEvent.pointerLeave(pointerGroup);
    expect(pointer.container.querySelector('[data-yunui="time-series-chart"]')).not.toHaveAttribute("data-active-x");
  });

  it("keeps a latest-sample readout mounted when the active point changes", () => {
    const data: TimeSeriesPoint[] = [{ x: 1, values: { decode: 10 } }, { x: 2, values: { decode: 20 } }];
    const { rerender } = render(<TimeSeriesChart data={data} series={[{ key: "decode", label: "Decode" }]} ariaLabel="Stable readout" formatX={(value) => `T${value}`} />);
    const readout = document.querySelector('[data-yunui="time-series-readout"]');
    expect(readout).toHaveTextContent("T2");
    rerender(<TimeSeriesChart data={data} series={[{ key: "decode", label: "Decode" }]} ariaLabel="Stable readout" activeX={1} formatX={(value) => `T${value}`} />);
    expect(document.querySelector('[data-yunui="time-series-readout"]')).toBe(readout);
    expect(readout).toHaveTextContent("T1");
  });
});
