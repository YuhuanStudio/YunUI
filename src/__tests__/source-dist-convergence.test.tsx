import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AgentTimeline } from "../ai";
import { ChatComposer } from "../chat";
import { CodeBlock } from "../content";
import { Dialog, DialogContent, DialogTitle, Switch } from "../index";
import { SessionItem } from "../patterns";

describe("source and package regression contracts", () => {
    it("keeps the composer text aligned to the compact top edge", () => {
        render(<ChatComposer value="Draft" onChange={() => {}} onSend={() => {}} />);
        const textbox = screen.getByRole("textbox");

        expect(textbox.parentElement).toHaveClass("items-start", "px-3", "pt-2");
        expect(textbox).toHaveClass("min-h-7", "py-0");
    });

    it("names the built-in dialog close button", () => {
        render(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Example dialog</DialogTitle>
                </DialogContent>
            </Dialog>,
        );

        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("forwards native aria and data attributes through Switch", () => {
        render(
            <Switch
                checked={false}
                onCheckedChange={() => {}}
                aria-label="Notifications"
                data-testid="notification-switch"
            />,
        );

        expect(screen.getByRole("switch", { name: "Notifications" })).toHaveAttribute(
            "data-testid",
            "notification-switch",
        );
    });

    it("makes scrollable agent output and approval arguments keyboard reachable", () => {
        render(
            <AgentTimeline
                blocks={[
                    { kind: "tool", id: "tool", verb: "Run", status: "done", output: "result" },
                    {
                        kind: "approval",
                        id: "approval",
                        title: "Approve command",
                        verb: "shell",
                        argsText: "long args",
                        allowLabel: "Allow",
                        denyLabel: "Deny",
                    },
                ]}
            />,
        );
        fireEvent.click(screen.getByRole("button", { name: /Run/ }));

        expect(screen.getByRole("region", { name: "Run output" })).toHaveAttribute("tabindex", "0");
        expect(screen.getByRole("region", { name: "Approve command: shell" })).toHaveAttribute("tabindex", "0");
    });

    it("allows long session names to shrink without displacing status badges", () => {
        render(<SessionItem name="A very long session name" current currentLabel="Current" />);

        const name = screen.getByText("A very long session name");
        expect(name).toHaveClass("min-w-0", "flex-1", "truncate");
        expect(name.parentElement).toHaveClass("min-w-0");
    });

    it("uses readable secondary contrast for code actions", () => {
        render(<CodeBlock language="text">example</CodeBlock>);

        expect(screen.getByText("Copy")).toHaveClass("text-(--text-secondary)");
    });
});
