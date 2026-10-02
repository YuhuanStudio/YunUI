import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModelCard } from "../ai/model-card";

describe("model card interaction boundary", () => {
  it("does not select the model when keyboard activation originates in its copy badge", () => {
    const select = vi.fn();
    render(<ModelCard name="Model" ids={["model-id"]} onClick={select} />);
    const copyBadge = screen.getByText("model-id").closest("button")!;
    fireEvent.keyDown(copyBadge, { key: "Enter" });
    fireEvent.keyDown(copyBadge, { key: " " });
    expect(select).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Model/ }));
    expect(select).toHaveBeenCalledOnce();
  });
  it("retains zero-valued host price and description", () => {
    render(<ModelCard name="Zero" description={0} price={0} />);
    expect(screen.getAllByText("0")).toHaveLength(2);
    expect(screen.queryByText("No description")).not.toBeInTheDocument();
  });
});
