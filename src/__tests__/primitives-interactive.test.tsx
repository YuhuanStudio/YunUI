import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox, Slider, Tabs, TabsList, TabsTrigger, TabsContent, Label } from "../primitives";
import { Switch } from "../index";

// -----------------------------------------------------------------------------
// Switch — custom controlled <button role="switch"> (NOT Radix). It is a fully
// controlled component: onCheckedChange(!checked) fires on click, but the
// `checked` prop must be driven by the parent for aria-checked to flip.
// -----------------------------------------------------------------------------
describe("Switch", () => {
  it("renders role=switch with aria-checked reflecting the checked prop", () => {
    const { rerender } = render(<Switch checked={false} onCheckedChange={() => {}} />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(sw).toHaveAttribute("type", "button");

    rerender(<Switch checked={true} onCheckedChange={() => {}} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onCheckedChange with the negated value on click", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("toggles aria-checked when wired to controlled state", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [on, setOn] = useState(false);
      return <Switch checked={on} onCheckedChange={setOn} />;
    }
    render(<Controlled />);
    const sw = screen.getByRole("switch");

    expect(sw).toHaveAttribute("aria-checked", "false");
    await user.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
    await user.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("does not fire onCheckedChange when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} disabled />);

    const sw = screen.getByRole("switch");
    expect(sw).toBeDisabled();
    await user.click(sw);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("forwards id so a Label can be associated with it", () => {
    render(<Switch id="notify" checked={false} onCheckedChange={() => {}} />);
    expect(screen.getByRole("switch")).toHaveAttribute("id", "notify");
  });
});

// -----------------------------------------------------------------------------
// Checkbox — custom controlled <button role="checkbox"> (NOT Radix). Renders a
// lucide <Check> icon only while checked.
// -----------------------------------------------------------------------------
describe("Checkbox", () => {
  it("renders role=checkbox with aria-checked from the checked prop", () => {
    const { rerender } = render(<Checkbox checked={false} onCheckedChange={() => {}} />);
    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("aria-checked", "false");
    expect(cb).toHaveAttribute("type", "button");

    rerender(<Checkbox checked={true} onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onCheckedChange with the negated value on click", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox checked={true} onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("toggles aria-checked when wired to controlled state", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [on, setOn] = useState(false);
      return <Checkbox checked={on} onCheckedChange={setOn} />;
    }
    render(<Controlled />);
    const cb = screen.getByRole("checkbox");

    expect(cb).toHaveAttribute("aria-checked", "false");
    await user.click(cb);
    expect(cb).toHaveAttribute("aria-checked", "true");
    await user.click(cb);
    expect(cb).toHaveAttribute("aria-checked", "false");
  });

  it("does not fire onCheckedChange when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox checked={false} onCheckedChange={onCheckedChange} disabled />);

    const cb = screen.getByRole("checkbox");
    expect(cb).toBeDisabled();
    await user.click(cb);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

// -----------------------------------------------------------------------------
// Slider — Radix Slider.Root. Exposes role="slider" with aria-valuenow /
// aria-valuemin / aria-valuemax, and supports keyboard increment/decrement.
// -----------------------------------------------------------------------------
describe("Slider", () => {
  it("exposes a slider role with value/min/max aria attributes", () => {
    render(<Slider defaultValue={[40]} min={0} max={100} step={1} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "40");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
  });

  it("increments aria-valuenow on ArrowRight and reports via onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Slider defaultValue={[50]} min={0} max={100} step={1} onValueChange={onValueChange} />
    );
    const slider = screen.getByRole("slider");

    slider.focus();
    await user.keyboard("{ArrowRight}");

    expect(slider).toHaveAttribute("aria-valuenow", "51");
    expect(onValueChange).toHaveBeenCalledWith([51]);
  });

  it("decrements aria-valuenow on ArrowLeft", async () => {
    const user = userEvent.setup();
    render(<Slider defaultValue={[50]} min={0} max={100} step={1} />);
    const slider = screen.getByRole("slider");

    slider.focus();
    await user.keyboard("{ArrowLeft}");
    expect(slider).toHaveAttribute("aria-valuenow", "49");
  });

  it("respects a disabled state (data-disabled on the thumb)", () => {
    render(<Slider defaultValue={[30]} min={0} max={100} disabled />);
    expect(screen.getByRole("slider")).toHaveAttribute("data-disabled");
  });
});

// -----------------------------------------------------------------------------
// Tabs — Radix Tabs. Triggers expose role="tab" with aria-selected; the active
// panel (role="tabpanel") is the only one rendered/visible.
// -----------------------------------------------------------------------------
describe("Tabs", () => {
  function Example() {
    return (
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account panel</TabsContent>
        <TabsContent value="password">Password panel</TabsContent>
      </Tabs>
    );
  }

  it("renders tab triggers and shows only the default panel", () => {
    render(<Example />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);

    const accountTab = screen.getByRole("tab", { name: "Account" });
    expect(accountTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Password" })).toHaveAttribute(
      "aria-selected",
      "false"
    );

    expect(screen.getByText("Account panel")).toBeInTheDocument();
    // Inactive Radix panels are not mounted by default.
    expect(screen.queryByText("Password panel")).toBeNull();
  });

  it("switches the active tab and panel on click", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole("tab", { name: "Password" }));

    expect(screen.getByRole("tab", { name: "Password" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
    expect(screen.getByText("Password panel")).toBeInTheDocument();
    expect(screen.queryByText("Account panel")).toBeNull();
  });

  it("exposes exactly one tabpanel for the active tab", () => {
    render(<Example />);
    const panels = screen.getAllByRole("tabpanel");
    expect(panels).toHaveLength(1);
    expect(panels[0]).toHaveTextContent("Account panel");
  });
});

// -----------------------------------------------------------------------------
// Label — plain <label> that forwards htmlFor and associates with a control.
// -----------------------------------------------------------------------------
describe("Label", () => {
  it("renders its text content", () => {
    render(<Label>Email address</Label>);
    expect(screen.getByText("Email address")).toBeInTheDocument();
  });

  it("associates with a control via htmlFor and is queryable by label text", () => {
    render(
      <div>
        <Label htmlFor="toggle">Notifications</Label>
        <Switch id="toggle" checked={false} onCheckedChange={() => {}} />
      </div>
    );
    // getByLabelText resolves the htmlFor -> id association to the switch.
    expect(screen.getByLabelText("Notifications")).toHaveAttribute("role", "switch");
  });

  it("merges a custom className with its base styles", () => {
    render(<Label className="custom-label">Field</Label>);
    expect(screen.getByText("Field")).toHaveClass("custom-label");
  });
});
