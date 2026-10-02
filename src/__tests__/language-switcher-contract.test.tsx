import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LanguageSwitcher } from "../ai/language-switcher";

const locales = [
  { value: "en", label: "English" },
  { value: "zh-TW", label: "繁體中文" },
];

describe("LanguageSwitcher interaction contract", () => {
  it("uses a disclosure group with native choices, closes on the current choice, and restores Escape focus", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<LanguageSwitcher locales={locales} currentLocale="en" onChange={onChange} variant="pill" />);
    const trigger = screen.getByRole("button", { name: "Language: English" });
    expect(trigger).not.toHaveAttribute("aria-haspopup");
    expect(trigger).toHaveAttribute("type", "button");

    await user.click(trigger);
    const panel = screen.getByRole("group", { name: "Language" });
    expect(trigger).toHaveAttribute("aria-controls", panel.id);
    const english = screen.getByRole("button", { name: "English" });
    expect(english).toHaveAttribute("aria-pressed", "true");
    await user.click(english);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("group", { name: "Language" })).not.toBeInTheDocument();

    await user.click(trigger);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("group", { name: "Language" })).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("keeps pending state on both trigger and open locale options", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<LanguageSwitcher locales={locales} currentLocale="en" onChange={onChange} variant="pill" />);
    const trigger = screen.getByRole("button", { name: "Language: English" });
    await user.click(trigger);
    rerender(<LanguageSwitcher locales={locales} currentLocale="en" onChange={onChange} variant="pill" pending />);
    const panel = screen.getByRole("group", { name: "Language" });
    expect(panel).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "繁體中文" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Language: English" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "繁體中文" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("keeps independent accessible relationships when two switchers are rendered", async () => {
    const user = userEvent.setup();
    render(
      <>
        <LanguageSwitcher locales={locales} currentLocale="en" onChange={() => {}} />
        <LanguageSwitcher locales={locales} currentLocale="zh-TW" onChange={() => {}} />
      </>,
    );
    const triggers = screen.getAllByRole("button", { name: /Language:/ });
    expect(triggers).toHaveLength(2);
    await user.click(triggers[0]!);
    const firstId = screen.getByRole("group", { name: "Language" }).id;
    await user.keyboard("{Escape}");
    await user.click(triggers[1]!);
    const secondId = screen.getByRole("group", { name: "Language" }).id;
    expect(firstId).not.toBe(secondId);
  });
});
