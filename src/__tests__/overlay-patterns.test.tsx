import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Badge, Modal } from "../primitives";
import { FAQ } from "../patterns";
import { YunUIProvider } from "../adapters/context";

/**
 * Overlay + pattern coverage for YunUI.
 *
 * Adapter-coupled components (Modal renders translated aria-labels/badges via
 * useYunUI().useT) are wrapped in <YunUIProvider> with the identity translator,
 * so t("close") -> "close", t("unsaved") -> "unsaved".
 *
 * Tooltip is intentionally skipped: the exported Tooltip primitives wrap
 * @radix-ui/react-tooltip, which only mounts content into a portal after a real
 * pointer-hover open delay using layout/pointer APIs jsdom doesn't implement.
 */

const renderWithProvider = (ui: React.ReactElement) =>
  render(<YunUIProvider adapters={{ useT: () => (k) => k }}>{ui}</YunUIProvider>);

describe("Modal", () => {
  it("renders nothing when isOpen is false", () => {
    renderWithProvider(
      <Modal isOpen={false} onClose={() => {}} title="Hidden">
        <p>Body</p>
      </Modal>
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByText("Hidden")).toBeNull();
  });

  it("renders a dialog with title and children when open", () => {
    renderWithProvider(
      <Modal isOpen onClose={() => {}} title="My Modal">
        <p>Hello content</p>
      </Modal>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");

    const title = screen.getByRole("heading", { name: "My Modal" });
    expect(title).toHaveAttribute("id", "modal-title");

    expect(screen.getByText("Hello content")).toBeInTheDocument();
  });

  it("renders the optional subtitle and footer", () => {
    renderWithProvider(
      <Modal
        isOpen
        onClose={() => {}}
        title="Titled"
        subtitle="A subtitle"
        footer={<button>Save</button>}
      >
        body
      </Modal>
    );
    expect(screen.getByText("A subtitle")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("shows the translated close button by default and hides it when showCloseButton is false", () => {
    const { rerender } = renderWithProvider(
      <Modal isOpen onClose={() => {}} title="X">
        body
      </Modal>
    );
    expect(screen.getByRole("button", { name: "close" })).toBeInTheDocument();

    rerender(
      <YunUIProvider adapters={{ useT: () => (k) => k }}>
        <Modal isOpen onClose={() => {}} title="X" showCloseButton={false}>
          body
        </Modal>
      </YunUIProvider>
    );
    expect(screen.queryByRole("button", { name: "close" })).toBeNull();
  });

  it("renders the unsaved badge only when showUnsavedBadge is set", () => {
    const { rerender } = renderWithProvider(
      <Modal isOpen onClose={() => {}} title="X">
        body
      </Modal>
    );
    expect(screen.queryByText("unsaved")).toBeNull();

    rerender(
      <YunUIProvider adapters={{ useT: () => (k) => k }}>
        <Modal isOpen onClose={() => {}} title="X" showUnsavedBadge>
          body
        </Modal>
      </YunUIProvider>
    );
    expect(screen.getByText("unsaved")).toBeInTheDocument();
  });

  it("calls onClose after the close button is clicked (post-animation)", async () => {
    const onClose = vi.fn();
    renderWithProvider(
      <Modal isOpen onClose={onClose} title="Closable">
        body
      </Modal>
    );

    // handleClose defers onClose by ANIMATION_DURATION; wait for it with real timers.
    fireEvent.click(screen.getByRole("button", { name: "close" }));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("invokes onBackdropClick (not onClose) when the backdrop itself is clicked", () => {
    const onClose = vi.fn();
    const onBackdropClick = vi.fn();

    renderWithProvider(
      <Modal isOpen onClose={onClose} onBackdropClick={onBackdropClick} title="Backdrop">
        body
      </Modal>
    );

    // fireEvent.click on the dialog root → e.target === e.currentTarget (the backdrop).
    fireEvent.click(screen.getByRole("dialog"));
    expect(onBackdropClick).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("FAQ", () => {
  const items = [
    { question: "What is YunUI?", answer: "A component library." },
    { question: "Is it free?", answer: "Yes, Apache-2.0." },
  ];

  it("renders every question as a toggle button", () => {
    render(<FAQ items={items} />);
    expect(screen.getByRole("button", { name: /What is YunUI\?/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Is it free\?/ })).toBeInTheDocument();
  });

  it("renders answers (always in the DOM; visibility is CSS-driven)", () => {
    render(<FAQ items={items} />);
    expect(screen.getByText("A component library.")).toBeInTheDocument();
    expect(screen.getByText("Yes, Apache-2.0.")).toBeInTheDocument();
  });

  it("opens the first item by default (expanded panel)", () => {
    render(<FAQ items={items} />);
    const firstAnswerPanel = screen.getByText("A component library.");
    expect(firstAnswerPanel.className).toContain("max-h-60");
    expect(firstAnswerPanel.className).toContain("opacity-100");
  });

  it("toggles an item open and closed on click", async () => {
    const user = userEvent.setup();
    render(<FAQ items={items} defaultOpenIndex={null} />);

    const secondAnswerPanel = screen.getByText("Yes, Apache-2.0.");
    expect(secondAnswerPanel.className).toContain("max-h-0");
    expect(secondAnswerPanel.className).toContain("opacity-0");

    const secondButton = screen.getByRole("button", { name: /Is it free\?/ });

    await user.click(secondButton);
    expect(secondAnswerPanel.className).toContain("max-h-60");
    expect(secondAnswerPanel.className).toContain("opacity-100");

    await user.click(secondButton);
    expect(secondAnswerPanel.className).toContain("max-h-0");
    expect(secondAnswerPanel.className).toContain("opacity-0");
  });

  it("supports defaultOpenIndex=null (all collapsed initially)", () => {
    render(<FAQ items={items} defaultOpenIndex={null} />);
    const firstAnswerPanel = screen.getByText("A component library.");
    expect(firstAnswerPanel.className).toContain("max-h-0");
    expect(firstAnswerPanel.className).toContain("opacity-0");
  });
});

describe("Badge (primitive)", () => {
  const variantClass: Record<string, string> = {
    default: "bg-muted",
    success: "bg-success-soft",
    warning: "bg-warning-soft",
    error: "bg-error-soft",
    info: "bg-info-soft",
  };

  it("applies the shared base classes", () => {
    render(<Badge>base</Badge>);
    const el = screen.getByText("base");
    expect(el.className).toContain("inline-flex");
    expect(el.className).toContain("rounded-md");
    expect(el.className).toContain("text-xs");
    expect(el.className).toContain("font-medium");
  });

  it("defaults to the `default` variant", () => {
    render(<Badge>plain</Badge>);
    expect(screen.getByText("plain").className).toContain("bg-muted");
  });

  it.each(Object.entries(variantClass))(
    "renders the %s variant with its distinctive class",
    (variant, klass) => {
      render(
        <Badge variant={variant as "default" | "success" | "warning" | "error" | "info"}>
          {variant}
        </Badge>
      );
      expect(screen.getByText(variant).className).toContain(klass);
    }
  );

  it("merges a custom className", () => {
    render(<Badge className="custom-x">tagged</Badge>);
    expect(screen.getByText("tagged").className).toContain("custom-x");
  });

  it("forwards arbitrary span attributes", () => {
    render(<Badge data-testid="badge-attr" title="hint">attr</Badge>);
    const el = screen.getByTestId("badge-attr");
    expect(el).toHaveAttribute("title", "hint");
  });
});
