import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AccountMenu, type AccountMenuItem } from "../ai/account-menu";

const items: AccountMenuItem[] = [
  { key: "settings", label: "Settings", href: "/settings" },
  { key: "usage", label: "Usage", onSelect: vi.fn() },
];

describe("AccountMenu keyboard and identity state", () => {
  it("opens at the first item, supports menu arrows, and restores trigger focus on Escape", async () => {
    const user = userEvent.setup();
    const onUsage = vi.fn();
    render(
      <AccountMenu
        user={{ name: "Ada Lovelace", email: "ada@example.test" }}
        signInHref="/sign-in"
        items={[items[0]!, { key: "usage", label: "Usage", onSelect: onUsage }]}
        onSignOut={() => {}}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Ada Lovelace" });
    await user.click(trigger);
    const menu = screen.getByRole("menu");
    expect(trigger).toHaveAttribute("aria-controls", menu.id);
    const settings = screen.getByRole("menuitem", { name: "Settings" });
    const usage = screen.getByRole("menuitem", { name: "Usage" });
    await waitFor(() => expect(settings).toHaveFocus());

    await user.keyboard("{ArrowDown}");
    expect(usage).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(settings).toHaveFocus();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(onUsage).not.toHaveBeenCalled();
  });

  it("selects an action and closes the host menu", async () => {
    const user = userEvent.setup();
    const onUsage = vi.fn();
    render(
      <AccountMenu
        user={{ name: "Ada" }}
        signInHref="/sign-in"
        items={[{ key: "usage", label: "Usage", onSelect: onUsage }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Ada" }));
    await user.click(screen.getByRole("menuitem", { name: "Usage" }));
    expect(onUsage).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("does not reopen a stale signed-in menu after the session disappears and returns", async () => {
    const user = userEvent.setup();
    const initialUser = { name: "Ada", email: "ada@example.test" };
    const { rerender } = render(<AccountMenu user={initialUser} signInHref="/sign-in" items={[{ key: "usage", label: "Usage" }]} />);
    await user.click(screen.getByRole("button", { name: "Ada" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    rerender(<AccountMenu user={null} signInHref="/sign-in" />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    rerender(<AccountMenu user={{ name: "Ada" }} signInHref="/sign-in" />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ada" })).toBeInTheDocument();
  });

  it("holds its navbar space while user data is unknown", () => {
    const { container } = render(<AccountMenu user={undefined} signInHref="/sign-in" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
