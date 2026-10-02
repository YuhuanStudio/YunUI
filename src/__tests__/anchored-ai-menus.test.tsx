import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { AccountMenu } from "../ai/account-menu";
import { LanguageSwitcher } from "../ai/language-switcher";

const originalInnerWidth = window.innerWidth;
const originalInnerHeight = window.innerHeight;
const originalOffsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetParent");

function mockAnchorAndPanel(
  anchor: HTMLElement,
  panel: HTMLElement,
  { left, top, width, height = 40, panelWidth }: { left: number; top: number; width: number; height?: number; panelWidth: number },
) {
  Object.defineProperties(panel, {
    offsetParent: { configurable: true, value: anchor },
    offsetLeft: { configurable: true, value: 0 },
    offsetWidth: { configurable: true, value: panelWidth },
    scrollHeight: { configurable: true, value: 180 },
  });
  anchor.getBoundingClientRect = () => ({
    x: left, y: top, top, right: left + width, bottom: top + height, left,
    width, height, toJSON: () => ({}),
  });
}

afterEach(() => {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: originalInnerWidth });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: originalInnerHeight });
  if (originalOffsetParent) Object.defineProperty(HTMLElement.prototype, "offsetParent", originalOffsetParent);
  else delete (HTMLElement.prototype as { offsetParent?: HTMLElement | null }).offsetParent;
});

describe("viewport positioning for AI menus", () => {
  it("shifts a right-anchored AccountMenu left and flips it above when needed", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 400 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 320 });
    Object.defineProperty(HTMLElement.prototype, "offsetParent", { configurable: true, get() { return this.parentElement; } });
    const user = userEvent.setup();
    const { container } = render(<AccountMenu user={{ name: "Ada" }} signInHref="/sign-in" items={[{ key: "settings", label: "Settings" }]} />);
    await user.click(screen.getByRole("button", { name: "Ada" }));

    const anchor = container.querySelector(".relative") as HTMLElement;
    const menu = screen.getByRole("menu");
    mockAnchorAndPanel(anchor, menu, { left: 360, top: 200, width: 40, panelWidth: 224 });
    fireEvent(window, new Event("resize"));

    await waitFor(() => expect(Number.parseFloat(menu.style.marginRight)).toBeGreaterThan(0));
    expect(menu.className).toContain("bottom-full");
  });

  it("uses right margin for a right-aligned LanguageSwitcher panel and keeps left alignment on margin-left", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 400 });
    Object.defineProperty(HTMLElement.prototype, "offsetParent", { configurable: true, get() { return this.parentElement; } });
    const user = userEvent.setup();
    const { container, rerender } = render(
      <LanguageSwitcher locales={[{ value: "en", label: "English" }, { value: "zh", label: "中文" }]} currentLocale="en" onChange={() => {}} />,
    );
    await user.click(screen.getByRole("button", { name: "Language: English" }));
    let anchor = container.querySelector(".relative") as HTMLElement;
    let panel = screen.getByRole("group", { name: "Language" });
    mockAnchorAndPanel(anchor, panel, { left: 360, top: 80, width: 40, panelWidth: 160 });
    fireEvent(window, new Event("resize"));
    await waitFor(() => expect(Number.parseFloat(panel.style.marginRight)).toBeGreaterThan(0));

    await user.keyboard("{Escape}");
    rerender(
      <LanguageSwitcher align="left" locales={[{ value: "en", label: "English" }, { value: "zh", label: "中文" }]} currentLocale="en" onChange={() => {}} />,
    );
    await user.click(screen.getByRole("button", { name: "Language: English" }));
    anchor = container.querySelector(".relative") as HTMLElement;
    panel = screen.getByRole("group", { name: "Language" });
    mockAnchorAndPanel(anchor, panel, { left: -16, top: 80, width: 40, panelWidth: 160 });
    fireEvent(window, new Event("resize"));
    await waitFor(() => expect(Number.parseFloat(panel.style.marginLeft)).toBeGreaterThan(0));
    expect(panel.style.marginRight).toBe("");
  });
});
