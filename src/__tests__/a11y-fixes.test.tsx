import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input, Textarea, IconButton, Checkbox } from "../primitives";
import { Switch, SegmentedSelect } from "../index";
import { getProviderName, ProviderNames } from "../ai/provider-icons";

// =============================================================================
// Regression tests for the accessibility / correctness fixes applied to src/.
// Each block targets one specific fix; assertions are scoped to that fix.
// =============================================================================

// -----------------------------------------------------------------------------
// 1. SegmentedSelect — each option is a <button type="button"> and the selected
//    one reports aria-pressed="true" (others "false").
// -----------------------------------------------------------------------------
describe("SegmentedSelect a11y", () => {
  const options = [
    { value: "list", label: "List" },
    { value: "grid", label: "Grid" },
    { value: "table", label: "Table" },
  ];

  it("renders each option as type=button with aria-pressed reflecting selection", () => {
    render(<SegmentedSelect options={options} value="grid" onChange={() => {}} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    for (const btn of buttons) {
      expect(btn).toHaveAttribute("type", "button");
    }

    expect(screen.getByRole("button", { name: "Grid" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "List" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Table" })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the clicked option's value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SegmentedSelect options={options} value="grid" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Table" }));
    expect(onChange).toHaveBeenCalledWith("table");
  });
});

// -----------------------------------------------------------------------------
// 2. IconButton — derives aria-label from `label` and defaults type="button".
//    It wraps itself in a TooltipProvider, so it renders standalone.
// -----------------------------------------------------------------------------
describe("IconButton a11y", () => {
  it("exposes an accessible name from the label prop and is a type=button", () => {
    render(<IconButton icon={<svg />} label="Like" />);

    const btn = screen.getByRole("button", { name: "Like" });
    expect(btn).toHaveAttribute("aria-label", "Like");
    expect(btn).toHaveAttribute("type", "button");
  });
});

// -----------------------------------------------------------------------------
// 3. Input — error sets aria-invalid="true" and aria-describedby pointing at the
//    element that holds the error text; no aria-invalid without an error.
// -----------------------------------------------------------------------------
describe("Input error a11y", () => {
  it("associates the error message via aria-describedby and marks aria-invalid", () => {
    render(<Input aria-label="Name" error="Required" />);

    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toHaveAttribute("aria-invalid", "true");

    const describedById = input.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();

    const describedEl = document.getElementById(describedById!);
    expect(describedEl).not.toBeNull();
    expect(describedEl!.textContent).toContain("Required");
  });

  it("sets neither aria-invalid nor an error-describedby when there is no error", () => {
    render(<Input aria-label="Name" />);
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });
});

// -----------------------------------------------------------------------------
// 4. Textarea — same error / aria-invalid / aria-describedby behavior as Input.
// -----------------------------------------------------------------------------
describe("Textarea error a11y", () => {
  it("associates the error message via aria-describedby and marks aria-invalid", () => {
    render(<Textarea aria-label="Bio" error="Required" />);

    const textarea = screen.getByRole("textbox", { name: "Bio" });
    expect(textarea).toHaveAttribute("aria-invalid", "true");

    const describedById = textarea.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();

    const describedEl = document.getElementById(describedById!);
    expect(describedEl).not.toBeNull();
    expect(describedEl!.textContent).toContain("Required");
  });

  it("sets neither aria-invalid nor an error-describedby when there is no error", () => {
    render(<Textarea aria-label="Bio" />);
    const textarea = screen.getByRole("textbox", { name: "Bio" });
    expect(textarea).not.toHaveAttribute("aria-invalid");
    expect(textarea).not.toHaveAttribute("aria-describedby");
  });
});

// -----------------------------------------------------------------------------
// 5. Switch & Checkbox — role + aria-checked reflect `checked`, and clicking
//    calls onCheckedChange with the negated value.
// -----------------------------------------------------------------------------
describe("Switch & Checkbox toggles", () => {
  it("Switch: role=switch, aria-checked tracks checked, click toggles", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(<Switch checked={false} onCheckedChange={onCheckedChange} />);

    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("aria-checked", "false");

    await user.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    rerender(<Switch checked={true} onCheckedChange={onCheckedChange} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("Checkbox: role=checkbox, aria-checked tracks checked, click toggles", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(<Checkbox checked={false} onCheckedChange={onCheckedChange} />);

    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("aria-checked", "false");

    await user.click(cb);
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    rerender(<Checkbox checked={true} onCheckedChange={onCheckedChange} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("Checkbox: integrates with controlled state", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [on, setOn] = useState(false);
      return <Checkbox checked={on} onCheckedChange={setOn} />;
    }
    render(<Controlled />);
    const cb = screen.getByRole("checkbox");
    await user.click(cb);
    expect(cb).toHaveAttribute("aria-checked", "true");
  });
});

// -----------------------------------------------------------------------------
// 6. getProviderName — direct hits resolve to the mapped display name; tightened
//    fuzzy matcher no longer false-resolves 2-char junk to a real provider.
// -----------------------------------------------------------------------------
describe("getProviderName resolution", () => {
  it("resolves known provider ids to their display name from ProviderNames", () => {
    expect(getProviderName("openai")).toBe("OpenAI");
    expect(getProviderName("openai")).toBe(ProviderNames["openai"]);
    expect(getProviderName("anthropic")).toBe(ProviderNames["anthropic"]);
  });

  it("does not false-resolve 2-char junk input to a real provider (capitalizes instead)", () => {
    // "ai" is a substring of vertexai/aionly/ai21 etc., but the tightened matcher
    // only matches when the INPUT contains a known key (>=3 chars), so 2-char junk
    // can never match — it falls back to capitalizing the input.
    const aiResult = getProviderName("ai");
    expect(aiResult).toBe("Ai");
    expect(Object.values(ProviderNames)).not.toContain(aiResult);

    const zzResult = getProviderName("zz");
    expect(zzResult).toBe("Zz");
    expect(Object.values(ProviderNames)).not.toContain(zzResult);
  });
});
