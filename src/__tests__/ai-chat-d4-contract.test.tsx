import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AgentRunStatus } from "../ai/agent-run-status";
import { AgentTimeline } from "../ai/agent-timeline";
import { ApprovalQuestion } from "../ai/approval-question";
import { ThinkingBlock } from "../ai/thinking-block";

describe("approved D4 chat component structure", () => {
  it("renders host-fed thinking as a compact sparkle disclosure with an inert closed trace", () => {
    const onOpenChange = vi.fn();
    render(
      <ThinkingBlock
        content="Partial reasoning text"
        isStreaming
        open={false}
        onOpenChange={onOpenChange}
        labels={{ title: "Checking the source", active: "Running" }}
        steps={[{ id: "read", label: "Read the source", status: "running", detail: "Two files received" }]}
      />,
    );

    const section = document.querySelector<HTMLElement>("[data-yunui='thinking-block']");
    expect(section).toHaveAttribute("data-yunui", "thinking-block");
    expect(section?.className).not.toMatch(/border|shadow|bg-card/);
    const trigger = screen.getByRole("button", { name: /Checking the source/ });
    expect(trigger.querySelector("svg.lucide-sparkles")).toBeInTheDocument();
    const trace = section?.querySelector("[aria-hidden='true'][inert]");
    expect(trace).toBeInTheDocument();
    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("stacks narrow-step metadata beneath the label without dropping zero ReactNode data", () => {
    render(
      <ThinkingBlock
        content=""
        defaultOpen
        steps={[{
          id: "long-step",
          label: "Review ChatComposer and AgentTimeline integration details",
          status: "done",
          meta: 0,
          detail: 0,
        }]}
      />,
    );
    const section = document.querySelector<HTMLElement>("[data-yunui='thinking-block']")!;
    const row = section.querySelector<HTMLElement>("[data-yunui='thinking-block-step'] > div")!;
    expect(section.className).toContain("@container/think");
    expect(row.className).toContain("grid-cols-[0.875rem_minmax(0,1fr)]");
    expect(row.className).toContain("@min-[360px]/think:grid-cols-");
    expect(screen.getByText("Review ChatComposer and AgentTimeline integration details")).toBeInTheDocument();
    expect(section.querySelector("[data-yunui='thinking-block-step-meta']")).toHaveTextContent("0");
    expect(section.querySelector("[data-yunui='thinking-block-step-detail']")).toHaveTextContent("0");
  });

  it("keeps task/tool history as unboxed rows and tool approval separate from questionnaires", () => {
    const onApprove = vi.fn();
    render(
      <AgentTimeline
        blocks={[
          { kind: "task", id: "task", label: "Check sources", status: "failed", details: [{ id: "why", label: "One source failed", meta: "1 error" }] },
          { kind: "tool", id: "tool", verb: "Run", status: "done", summary: "verify.ts" },
          { kind: "approval", id: "approval", title: "Run command?", verb: "shell", message: "This will execute the requested command.", allowLabel: "Allow", denyLabel: "Deny" },
        ]}
        onApprove={onApprove}
      />,
    );

    const taskRow = screen.getByText("Check sources").closest("[data-yunui='agent-task-row']");
    expect(taskRow).toBeInTheDocument();
    expect(taskRow?.className).not.toMatch(/border|shadow|bg-card/);
    const approval = screen.getByText("Run command?").closest("[data-yunui='agent-approval-row']");
    expect(approval).toBeInTheDocument();
    expect(approval?.className).not.toMatch(/border|shadow|bg-\(--warning\)/);
    expect(approval?.querySelector("[class*='bg-(--warning)']")).toBeNull();
    expect(screen.getByRole("button", { name: "Allow" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Deny" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Allow" }));
    expect(onApprove).toHaveBeenCalledWith("approval");
    expect(screen.queryByText(/approved/i)).not.toBeInTheDocument();
  });

  it("uses one activity indicator and no status card or duplicate pulse for a live run", () => {
    const { container, rerender } = render(<AgentRunStatus label="Searching sources" phase="acting" />);
    const status = screen.getByRole("status");
    expect(status.className).not.toMatch(/border|shadow|bg-card/);
    expect(container.querySelectorAll("[data-run-status-indicator]")).toHaveLength(1);
    expect(container.querySelector("[data-run-status-pulse]")).toBeNull();

    rerender(<AgentRunStatus label="Run cancelled" phase="cancelled" />);
    expect(screen.getByRole("status")).toHaveAttribute("data-phase", "cancelled");
    expect(container.querySelector(".lucide-x")).toBeInTheDocument();
    expect(container.querySelector(".lucide-brain")).toBeNull();
  });

  it("renders a host output node directly and retains legacy plain-text tool output", () => {
    const richOutput = <div data-host-code-block><pre>formatted code</pre><button type="button">Copy code</button></div>;
    render(
      <AgentTimeline blocks={[
        { kind: "tool", id: "rich", verb: "Inspect", status: "done", output: "legacy fallback", outputContent: richOutput },
      ]} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Inspect/ }));
    const region = screen.getByRole("region", { name: "Inspect output" });
    expect(region.querySelector("[data-host-code-block]")).toBeInTheDocument();
    expect(region).toHaveTextContent("formatted code");
    expect(region).not.toHaveTextContent("legacy fallback");
    expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
  });

  it("keeps reasoning, tool, task and diff controls unique across colliding Unicode IDs and instances", () => {
    const onToggleRow = vi.fn();
    const makeBlocks = () => [
      { kind: "reasoning" as const, id: "a/b", label: "Compare sources", content: "Reasoning text", defaultOpen: false },
      { kind: "tool" as const, id: "a_b", verb: "Read", status: "done" as const, files: [
        { id: "ø/1", file: "first.ts", additions: 1, lines: [{ id: "line-1", text: "+one", tone: "add" as const }] },
        { id: "ø_1", file: "second.ts", additions: 2, lines: [{ id: "line-2", text: "+two", tone: "add" as const }] },
      ] },
      { kind: "task" as const, id: "雪/é", label: "Verify Unicode IDs", status: "done" as const, details: [{ id: "meta", label: "Sources checked", meta: "2" }] },
    ];
    const { container } = render(
      <>
        <AgentTimeline blocks={makeBlocks()} onToggleRow={onToggleRow} />
        <AgentTimeline blocks={makeBlocks()} />
      </>,
    );
    const controls = Array.from(container.querySelectorAll<HTMLButtonElement>("button[aria-controls]"));
    const controlIds = controls.map((control) => control.getAttribute("aria-controls"));
    expect(new Set(controlIds).size).toBe(controlIds.length);
    for (const id of controlIds) expect(document.getElementById(id!)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /Verify Unicode IDs/ })[0]!);
    expect(onToggleRow).toHaveBeenCalledWith("雪/é", true);
    fireEvent.click(screen.getAllByRole("button", { name: /Read/ })[0]!);
    const firstDiff = screen.getAllByRole("button", { name: "Show diff for first.ts" })[0]!;
    expect(firstDiff).toHaveAttribute("aria-controls");
    fireEvent.click(firstDiff);
    expect(document.getElementById(firstDiff.getAttribute("aria-controls")!)).toBeInTheDocument();
  });

  it("keeps questionnaire choices flat with YunUI radio controls and only one outer surface", () => {
    render(
      <ApprovalQuestion
        questions={[{ id: "scope", title: "Choose a scope", type: "single", options: [{ id: "small", label: "Small scope" }, { id: "large", label: "Large scope" }] }]}
        activeQuestionId="scope"
        answers={{}}
        onAnswersChange={vi.fn()}
      />,
    );
    const question = screen.getByRole("region");
    expect(question).toHaveAttribute("data-yunui", "approval-question");
    expect(question.className).toContain("border");
    expect(question.className).toContain("shadow-none");
    expect(question.querySelectorAll('[role="radio"]')).toHaveLength(2);
    const label = screen.getByText("Small scope").closest("label");
    expect(label?.className).not.toMatch(/rounded|border|shadow/);
  });
});
