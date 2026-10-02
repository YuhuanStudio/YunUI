import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { AgentTimeline, type AgentTimelineBlock, type AgentTimelineEntry, type AgentTimelineIconName } from "../ai/agent-timeline";
import { AgentRunStatus } from "../ai/agent-run-status";
import { ApprovalQuestion, type ApprovalQuestionAnswers, type ApprovalQuestionData } from "../ai/approval-question";
import { ThinkingBlock } from "../ai/thinking-block";

const legacyIconMetadata: Record<AgentTimelineIconName, string> = {
  terminal: "terminal icon",
  search: "search icon",
  globe: "globe icon",
  image: "image icon",
  file: "file icon",
  tool: "tool icon",
};

function legacyBlockKind(block: AgentTimelineBlock): string {
  switch (block.kind) {
    case "reasoning": return "reasoning";
    case "tool": return "tool";
    case "approval": return "approval";
    default: {
      const exhaustive: never = block;
      return exhaustive;
    }
  }
}

function HostedQuestionnaire() {
  const [activeQuestionId, setActiveQuestionId] = useState("scope");
  const [answers, setAnswers] = useState<ApprovalQuestionAnswers>({});
  const [submitted, setSubmitted] = useState<ApprovalQuestionAnswers | null>(null);
  const questions: ApprovalQuestionData[] = [
    {
      id: "scope",
      title: "Choose scope",
      type: "single",
      options: [
        { id: "large", label: "Large" },
        { id: "small", label: "Small" },
      ],
    },
    {
      id: "sources",
      title: "Choose sources",
      type: "multiple",
      options: [
        { id: "docs", label: "Docs" },
        { id: "web", label: "Web" },
      ],
    },
  ];
  return (
    <>
      <ApprovalQuestion
        questions={questions}
        activeQuestionId={activeQuestionId}
        answers={answers}
        onAnswersChange={setAnswers}
        onActiveQuestionChange={setActiveQuestionId}
        onSubmit={(finalAnswers) => setSubmitted(finalAnswers)}
      />
      {submitted ? <output data-testid="submitted">{JSON.stringify(submitted)}</output> : null}
    </>
  );
}

function ControlledRadioHarness() {
  const [answers, setAnswers] = useState<ApprovalQuestionAnswers>({});
  return (
    <>
      <ApprovalQuestion
        questions={[{ id: "scope", title: "Choose scope", type: "single", options: [{ id: "large", label: "Large" }, { id: "small", label: "Small" }] }]}
        activeQuestionId="scope"
        answers={answers}
        onAnswersChange={setAnswers}
      />
      <output data-testid="radio-answer">{JSON.stringify(answers)}</output>
    </>
  );
}

describe("D3 agent process integrations", () => {
  it("preserves the legacy AgentTimelineBlock union while accepting new entries separately", () => {
    const oldBlocks: AgentTimelineBlock[] = [
      { kind: "reasoning", id: "r", label: "Thinking", content: "Partial" },
      { kind: "tool", id: "t", verb: "Run", status: "error", output: "Failed" },
      { kind: "approval", id: "a", title: "Approve", verb: "shell", allowLabel: "Allow", denyLabel: "Deny" },
    ];
    const entries: AgentTimelineEntry[] = [
      { kind: "task", id: "task", label: "Index sources", amount: "3 files", status: "running", step: 2, details: [{ id: "read", label: "Read documents", meta: "2/3" }] },
      { kind: "tool", id: "cancelled", verb: "Search", status: "cancelled" },
    ];
    const { rerender } = render(<AgentTimeline blocks={oldBlocks} />);
    expect(legacyIconMetadata.terminal).toBe("terminal icon");
    expect(oldBlocks.map(legacyBlockKind)).toEqual(["reasoning", "tool", "approval"]);
    expect(screen.getByText("Thinking")).toBeInTheDocument();
    expect(screen.getByText("Run")).toBeInTheDocument();
    rerender(<AgentTimeline blocks={entries} />);
    expect(screen.getByText("Index sources")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("uses host summary counts and reports controlled group/row disclosures", () => {
    const onOpenChange = vi.fn();
    const onToggleRow = vi.fn();
    const onToggleDiff = vi.fn();
    render(
      <AgentTimeline
        open={false}
        onOpenChange={onOpenChange}
        labels={{ summary: ({ steps, tools }) => `${steps} steps · ${tools} tools` }}
        onToggleRow={onToggleRow}
        onToggleDiff={onToggleDiff}
        blocks={[
          { kind: "tool", id: "write", verb: "Write", status: "done", summary: "2 files", details: [{ id: "line", text: "+line", tone: "add", mono: true }], files: [{ id: "file", file: "a.ts", additions: 1, deletions: 0, lines: [{ id: "diff", text: "+line", tone: "add" }] }] },
          { kind: "task", id: "task", label: "Verify", status: "pending" },
        ]}
      />,
    );

    const summary = screen.getByRole("button", { name: /2 steps · 1 tools/ });
    fireEvent.click(summary);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    const collapsed = screen.getByText("Write").closest("[aria-hidden]");
    expect(collapsed).toHaveAttribute("aria-hidden", "true");
    expect(collapsed).toHaveAttribute("inert");
  });

  it("keeps host-fed task, tool, and diff data interactive without inventing completion", () => {
    const onToggleRow = vi.fn();
    const onToggleDiff = vi.fn();
    render(
      <AgentTimeline
        labels={{ completed: "Finished", toolOutput: (verb) => `${verb} result`, showDiff: (file) => `Review ${file}` }}
        onToggleRow={onToggleRow}
        onToggleDiff={onToggleDiff}
        blocks={[
          { kind: "tool", id: "tool", verb: "Edit", status: "running", output: "partial output", files: [{ id: "file", file: "result.ts", additions: 2, deletions: 1, lines: [{ id: "line", text: "+new", tone: "add" }] }] },
          { kind: "task", id: "task", label: "Build index", status: "failed", details: [{ id: "failure", label: "Failed on one source", meta: "1 error" }] },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Edit/ }));
    expect(onToggleRow).toHaveBeenCalledWith("tool", true);
    expect(screen.getByRole("region", { name: "Edit result" })).toHaveTextContent("partial output");
    fireEvent.click(screen.getByRole("button", { name: "Review result.ts" }));
    expect(onToggleDiff).toHaveBeenCalledWith("file", true);
    expect(screen.getByText("+new")).toBeInTheDocument();
    expect(screen.getByText("Build index")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("keeps the existing tool-decision callbacks and terminal run phase data-driven", () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();
    render(
      <>
        <AgentRunStatus label="Run cancelled" phase="cancelled" />
        <AgentTimeline blocks={[{ kind: "approval", id: "approval-id", title: "Confirm command", verb: "shell", allowLabel: "Allow", denyLabel: "Deny" }]} onApprove={onApprove} onReject={onReject} />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Allow" }));
    fireEvent.click(screen.getByRole("button", { name: "Deny" }));
    expect(onApprove).toHaveBeenCalledWith("approval-id");
    expect(onReject).toHaveBeenCalledWith("approval-id");
    expect(screen.getByRole("status")).toHaveAttribute("data-phase", "cancelled");
    expect(screen.getByRole("status")).not.toHaveAttribute("data-active");
  });

  it("keeps pending host decisions from being sent twice or looking decided", () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();
    render(
      <AgentTimeline
        blocks={[{ kind: "approval", id: "pending-approval", title: "Confirm", verb: "shell", allowLabel: "Allow", denyLabel: "Deny", busy: true }]}
        onApprove={onApprove}
        onReject={onReject}
      />,
    );
    expect(screen.getByRole("button", { name: "Allow" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Deny" })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Waiting for host");
    fireEvent.click(screen.getByRole("button", { name: "Allow" }));
    expect(onApprove).not.toHaveBeenCalled();
    expect(onReject).not.toHaveBeenCalled();
    expect(screen.queryByText("approved")).not.toBeInTheDocument();
  });

  it("renders the ThinkingBlock legacy content and host-supplied partial steps", () => {
    const onStepSelect = vi.fn();
    const { rerender } = render(<ThinkingBlock content="Partial reasoning" isStreaming defaultOpen />);
    expect(screen.getByText("Partial reasoning")).toBeInTheDocument();
    rerender(
      <ThinkingBlock
        content=""
        open
        steps={[{ id: "search", label: "Searching sources", detail: "2 sources read", status: "running", mono: true }]}
        selectedStepId="search"
        onStepSelect={onStepSelect}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Searching sources/ }));
    expect(onStepSelect).toHaveBeenCalledWith("search");
    expect(screen.getByText("2 sources read")).toBeInTheDocument();
  });

  it("collects stable question and option IDs, advances only on explicit Next, and submits host answers", () => {
    render(<HostedQuestionnaire />);
    fireEvent.click(screen.getByLabelText("Small"));
    expect(screen.getByRole("heading", { name: "Choose scope" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("heading", { name: "Choose sources" })).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Docs"));
    fireEvent.click(screen.getByLabelText("Web"));
    fireEvent.click(screen.getByRole("button", { name: "Submit answers" }));
    expect(screen.getByTestId("submitted")).toHaveTextContent('"scope":{"optionIds":["small"]}');
    expect(screen.getByTestId("submitted")).toHaveTextContent('"sources":{"optionIds":["docs","web"]}');
  });

  it("disables all questionnaire controls while the host is submitting", () => {
    const onSubmit = vi.fn();
    const answers: ApprovalQuestionAnswers = { scope: { optionIds: ["small"] } };
    render(
      <ApprovalQuestion
        questions={[{ id: "scope", title: "Choose scope", type: "single", options: [{ id: "small", label: "Small" }] }]}
        activeQuestionId="scope"
        answers={answers}
        onAnswersChange={vi.fn()}
        onSubmit={onSubmit}
        submitting
      />,
    );
    expect(screen.getByRole("region")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByLabelText("Small")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Submitting…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Skip" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Submitting…" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("uses the primitive keyboard contracts and keeps Other answers keyed by stable IDs", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ControlledRadioHarness />);
    const large = screen.getByRole("radio", { name: "Large" });
    await user.click(large);
    expect(large).toHaveFocus();
    fireEvent.keyDown(large, { key: "ArrowDown", code: "ArrowDown" });
    await waitFor(() => expect(screen.getByTestId("radio-answer")).toHaveTextContent('"scope":{"optionIds":["small"]}'));
    fireEvent.keyUp(large, { key: "ArrowDown", code: "ArrowDown" });

    const onMultiAnswersChange = vi.fn();
    rerender(
      <ApprovalQuestion
        questions={[{ id: "details", title: "Choose details", type: "multiple", options: [{ id: "docs", label: "Docs" }], other: { id: "other", label: "Other", placeholder: "Describe other" } }]}
        activeQuestionId="details"
        answers={{}}
        onAnswersChange={onMultiAnswersChange}
      />,
    );
    const docs = screen.getByRole("checkbox", { name: "Docs" });
    docs.focus();
    await user.keyboard(" ");
    expect(onMultiAnswersChange).toHaveBeenLastCalledWith({ details: { optionIds: ["docs"] } });

    const onOtherAnswersChange = vi.fn();
    rerender(
      <ApprovalQuestion
        questions={[{ id: "details", title: "Choose details", type: "multiple", options: [{ id: "docs", label: "Docs" }], other: { id: "other", label: "Other", placeholder: "Describe other" } }]}
        activeQuestionId="details"
        answers={{ details: { optionIds: ["docs"] } }}
        onAnswersChange={onOtherAnswersChange}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Other" }));
    expect(onOtherAnswersChange).toHaveBeenLastCalledWith({ details: { optionIds: ["docs", "other"] } });
    rerender(
      <ApprovalQuestion
        questions={[{ id: "details", title: "Choose details", type: "multiple", options: [{ id: "docs", label: "Docs" }, { id: "images", label: "Images" }], other: { id: "other", label: "Other", placeholder: "Describe other" } }]}
        activeQuestionId="details"
        answers={{ details: { optionIds: ["docs", "other"] } }}
        onAnswersChange={onOtherAnswersChange}
      />,
    );
    await user.type(screen.getByRole("textbox", { name: "Describe other" }), "reference book");
    expect(onOtherAnswersChange).toHaveBeenLastCalledWith({ details: { optionIds: ["docs", "other"], otherText: "k" } });
    rerender(
      <ApprovalQuestion
        questions={[{ id: "details", title: "Choose details", type: "multiple", options: [{ id: "docs", label: "Docs" }, { id: "images", label: "Images" }], other: { id: "other", label: "Other", placeholder: "Describe other" } }]}
        activeQuestionId="details"
        answers={{ details: { optionIds: ["docs", "other"], otherText: "reference book" } }}
        onAnswersChange={onOtherAnswersChange}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Images" }));
    expect(onOtherAnswersChange).toHaveBeenLastCalledWith({ details: { optionIds: ["docs", "other", "images"], otherText: "reference book" } });
  });

  it("keeps control IDs collision-free for labels with punctuation and non-ASCII IDs", async () => {
    const user = userEvent.setup();
    const onAnswersChange = vi.fn();
    render(
      <ApprovalQuestion
        questions={[{ id: "q/中文", title: "Pick both", type: "multiple", options: [{ id: "choice/one", label: "Slash choice" }, { id: "choice_one", label: "Underscore choice" }] }]}
        activeQuestionId="q/中文"
        answers={{}}
        onAnswersChange={onAnswersChange}
      />,
    );
    const slash = screen.getByRole("checkbox", { name: "Slash choice" });
    const underscore = screen.getByRole("checkbox", { name: "Underscore choice" });
    expect(slash.id).not.toBe(underscore.id);
    await user.click(screen.getByText("Underscore choice"));
    expect(onAnswersChange).toHaveBeenLastCalledWith({ "q/中文": { optionIds: ["choice_one"] } });
    await user.click(screen.getByText("Slash choice"));
    expect(onAnswersChange).toHaveBeenLastCalledWith({ "q/中文": { optionIds: ["choice/one"] } });
  });

  it("retains usable default action labels when a host translation is undefined", () => {
    const onSubmit = vi.fn();
    const answers = { q: { optionIds: ["yes"] } };
    render(<ApprovalQuestion questions={[{ id: "q", title: "Scope", type: "single", options: [{ id: "yes", label: "Yes" }] }]} activeQuestionId="q" answers={answers} onAnswersChange={() => {}} onSubmit={onSubmit} labels={{ submit: undefined, next: undefined }} />);
    const submit = screen.getByRole("button", { name: "Submit answers" });
    expect(submit).toBeEnabled();
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith(answers);
  });

  it("requests host dismissal without silently hiding or approving the question", () => {
    const onDismiss = vi.fn();
    const onSubmit = vi.fn();
    const props = { questions: [{ id: "q", title: "Confirm scope", type: "single" as const, options: [{ id: "yes", label: "Yes" }] }], activeQuestionId: "q", answers: {}, onAnswersChange: vi.fn(), onDismiss, onSubmit };
    const { rerender } = render(<ApprovalQuestion {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss questions" }));
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Confirm scope" })).toBeInTheDocument();
    rerender(<ApprovalQuestion {...props} submitting />);
    expect(screen.getByRole("button", { name: "Dismiss questions" })).toBeDisabled();
  });
});
