import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { YunUIProvider, type YunUIAdapters } from "../adapters/context";
import {
  ModelCard,
  CapabilitySelector,
  IDBadge,
  ModelTypeIcon,
  Navbar,
  Footer,
  type NavLink,
  type FooterSection,
  type FooterSocial,
} from "../ai";

// All AI components read framework deps (Link/Image/useT) from the adapter
// context. The defaults (plain <a>, plain <img>, identity translator) are
// already jsdom-safe, but we pass an explicit identity `useT` so namespaced
// keys (e.g. IDBadge's "clickToCopy") resolve to a stable string.
const adapters: Partial<YunUIAdapters> = { useT: () => (k: string) => k };

function renderWithProvider(ui: React.ReactNode) {
  return render(<YunUIProvider adapters={adapters}>{ui}</YunUIProvider>);
}

describe("ModelCard", () => {
  it("renders the model name", () => {
    renderWithProvider(<ModelCard name="GPT-4o" />);
    expect(screen.getByText("GPT-4o")).toBeInTheDocument();
  });

  it("renders ids as click-to-copy IDBadges", () => {
    renderWithProvider(<ModelCard name="M" ids={["gpt-4o", "gpt-4o-mini"]} />);
    expect(screen.getByText("gpt-4o")).toBeInTheDocument();
    expect(screen.getByText("gpt-4o-mini")).toBeInTheDocument();
  });

  it("shows the no-description fallback when description is omitted", () => {
    renderWithProvider(<ModelCard name="M" labels={{ noDescription: "Nothing here" }} />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders the provided description over the fallback", () => {
    renderWithProvider(
      <ModelCard name="M" description="A multimodal model" labels={{ noDescription: "Nothing here" }} />
    );
    expect(screen.getByText("A multimodal model")).toBeInTheDocument();
    expect(screen.queryByText("Nothing here")).toBeNull();
  });

  it("renders the unofficial label only when nonofficial is set", () => {
    const { rerender } = renderWithProvider(
      <ModelCard name="M" labels={{ nonofficial: "Unofficial!" }} />
    );
    expect(screen.queryByText("Unofficial!")).toBeNull();
    rerender(
      <YunUIProvider adapters={adapters}>
        <ModelCard name="M" nonofficial labels={{ nonofficial: "Unofficial!" }} />
      </YunUIProvider>
    );
    expect(screen.getByText("Unofficial!")).toBeInTheDocument();
  });

  it("renders the suspended label when suspended is set", () => {
    renderWithProvider(<ModelCard name="M" suspended labels={{ suspended: "Paused" }} />);
    expect(screen.getByText("Paused")).toBeInTheDocument();
  });

  it("renders context, a non-free tier chip, and price", () => {
    renderWithProvider(<ModelCard name="M" context="128K" tier="pro" price="$0.50/M" />);
    expect(screen.getByText("128K")).toBeInTheDocument();
    expect(screen.getByText("pro")).toBeInTheDocument();
    expect(screen.getByText("$0.50/M")).toBeInTheDocument();
  });

  it("hides the tier chip when tier is 'free'", () => {
    renderWithProvider(<ModelCard name="M" tier="free" />);
    expect(screen.queryByText("free")).toBeNull();
  });

  it("renders the developer label and avatar image when iconUrl is given", () => {
    renderWithProvider(
      <ModelCard name="M" developer={{ label: "OpenAI", iconUrl: "/icons/openai.png" }} />
    );
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByAltText("OpenAI")).toHaveAttribute("src", "/icons/openai.png");
  });

  it("renders a host-supplied icon slot", () => {
    renderWithProvider(<ModelCard name="M" icon={<span data-testid="slot">★</span>} />);
    expect(screen.getByTestId("slot")).toBeInTheDocument();
  });

  it("shows at most 4 known capability chips and ignores unknown keys", () => {
    const { container } = renderWithProvider(
      <ModelCard
        name="M"
        capabilities={[
          "streaming",
          "vision",
          "thinking",
          "function_calling",
          "image_edit", // 5th known → sliced off (max 4)
          "totally_unknown", // not in CAPABILITY_ICONS → filtered out
        ]}
      />
    );
    expect(container.querySelector('[title="streaming"]')).not.toBeNull();
    expect(container.querySelector('[title="vision"]')).not.toBeNull();
    expect(container.querySelector('[title="thinking"]')).not.toBeNull();
    expect(container.querySelector('[title="function_calling"]')).not.toBeNull();
    expect(container.querySelector('[title="image_edit"]')).toBeNull();
    expect(container.querySelector('[title="totally_unknown"]')).toBeNull();
  });

  it("acts as a button (role + click) only when onClick is provided", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProvider(<ModelCard name="Clickable" onClick={onClick} />);
    const card = screen.getByRole("button");
    await user.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("fires onClick on Enter and Space when interactive", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProvider(<ModelCard name="Clickable" onClick={onClick} />);
    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("has no button role when onClick is absent", () => {
    renderWithProvider(<ModelCard name="Static" />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("CapabilitySelector", () => {
  it("renders LLM capabilities by default (one button per option)", () => {
    renderWithProvider(<CapabilitySelector selected={[]} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /chat/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /streaming/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /function_calling/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /vision/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /thinking/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("renders image-generation capabilities for modelType=image_generation", () => {
    renderWithProvider(
      <CapabilitySelector selected={[]} onChange={() => {}} modelType="image_generation" />
    );
    expect(screen.getByRole("button", { name: /image_edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /negative_prompt/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^chat$/i })).toBeNull();
  });

  it("renders audio capabilities for modelType=tts (audio bucket)", () => {
    renderWithProvider(<CapabilitySelector selected={[]} onChange={() => {}} modelType="tts" />);
    expect(screen.getByRole("button", { name: /tts/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /stt/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /audio_translation/i })).toBeInTheDocument();
  });

  it("adds a capability when an unselected option is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProvider(<CapabilitySelector selected={["chat"]} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /vision/i }));
    expect(onChange).toHaveBeenCalledWith(["chat", "vision"]);
  });

  it("removes a capability when an already-selected option is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProvider(<CapabilitySelector selected={["chat", "vision"]} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /^chat$/i }));
    expect(onChange).toHaveBeenCalledWith(["vision"]);
  });

  it("disables all option buttons and does not fire onChange when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProvider(<CapabilitySelector selected={[]} onChange={onChange} disabled />);
    const chat = screen.getByRole("button", { name: /^chat$/i });
    expect(chat).toBeDisabled();
    await user.click(chat);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("IDBadge", () => {
  it("renders the text", () => {
    renderWithProvider(<IDBadge text="gpt-4o-2024-05-13" />);
    expect(screen.getByText("gpt-4o-2024-05-13")).toBeInTheDocument();
  });

  it("exposes a click-to-copy title (namespaced i18n key)", () => {
    renderWithProvider(<IDBadge text="abc" />);
    expect(screen.getByTitle("clickToCopy")).toBeInTheDocument();
  });

  it("copies the text to the clipboard on click", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    try {
      renderWithProvider(<IDBadge text="copy-me" />);
      await user.click(screen.getByText("copy-me"));
      expect(writeText).toHaveBeenCalledWith("copy-me");
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe("ModelTypeIcon", () => {
  it("renders the chat icon for type 'chat'", () => {
    const { container } = render(<ModelTypeIcon type="chat" />);
    expect(container.querySelector(".lucide-message-square")).not.toBeNull();
  });

  it("matches type case-insensitively", () => {
    const { container } = render(<ModelTypeIcon type="CHAT" />);
    expect(container.querySelector(".lucide-message-square")).not.toBeNull();
  });

  it("renders the embedding (hash) icon for type 'embedding'", () => {
    const { container } = render(<ModelTypeIcon type="embedding" />);
    expect(container.querySelector(".lucide-hash")).not.toBeNull();
  });

  it("falls back to the Bot icon for an unknown type", () => {
    const { container } = render(<ModelTypeIcon type="does-not-exist" />);
    expect(container.querySelector(".lucide-bot")).not.toBeNull();
    expect(container.querySelector(".lucide-message-square")).toBeNull();
  });
});

describe("Navbar", () => {
  const links: NavLink[] = [
    { href: "/pricing", label: "Pricing" },
    { href: "/docs", label: "Docs" },
  ];

  it("renders the app name and a home link", () => {
    renderWithProvider(<Navbar appName="Yunxin" homeHref="/" />);
    expect(screen.getByText("Yunxin")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Yunxin/i })).toHaveAttribute("href", "/");
  });

  it("renders nav links with hrefs in the public variant", () => {
    renderWithProvider(<Navbar appName="Yunxin" links={links} />);
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("href", "/pricing");
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
  });

  it("renders auth links with custom labels and hrefs", () => {
    renderWithProvider(
      <Navbar
        appName="Yunxin"
        labels={{ signIn: "Log in", signUp: "Join" }}
        loginHref="/login"
        signupHref="/signup"
      />
    );
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: /Join/ })).toHaveAttribute("href", "/signup");
  });

  it("omits auth links and the mobile menu toggle in the minimal variant", () => {
    renderWithProvider(<Navbar appName="Yunxin" variant="minimal" labels={{ menu: "Open menu" }} />);
    expect(screen.queryByRole("link", { name: /Sign In/i })).toBeNull();
    // The mobile menu toggle is public-only (the ThemeToggle button still renders).
    expect(screen.queryByRole("button", { name: "Open menu" })).toBeNull();
  });

  it("toggles the mobile menu via the menu button", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Navbar appName="Yunxin" links={links} labels={{ menu: "Open menu" }} />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("renders a custom language switcher slot", () => {
    renderWithProvider(<Navbar appName="Yunxin" languageSwitcher={<div data-testid="lang">EN</div>} />);
    expect(screen.getByTestId("lang")).toBeInTheDocument();
  });
});

describe("Footer", () => {
  const sections: FooterSection[] = [
    {
      title: "Product",
      links: [
        { label: "Pricing", href: "/pricing" },
        { label: "Models", href: "/models" },
      ],
    },
  ];
  const social: FooterSocial[] = [
    { icon: <span>gh</span>, href: "https://github.com/x", label: "GitHub" },
    { icon: <span>mail</span>, href: "mailto:hi@x.com", label: "Email" },
  ];

  it("renders the app name and a home link", () => {
    renderWithProvider(<Footer appName="Yunxin" homeHref="/" />);
    expect(screen.getByRole("link", { name: /Yunxin/i })).toHaveAttribute("href", "/");
  });

  it("renders an optional tagline", () => {
    renderWithProvider(<Footer appName="Yunxin" tagline="The API gateway" />);
    expect(screen.getByText("The API gateway")).toBeInTheDocument();
  });

  it("renders section titles and links with hrefs", () => {
    renderWithProvider(<Footer appName="Yunxin" sections={sections} />);
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("href", "/pricing");
    expect(screen.getByRole("link", { name: "Models" })).toHaveAttribute("href", "/models");
  });

  it("renders the default copyright when none is provided", () => {
    renderWithProvider(<Footer appName="Yunxin" />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} Yunxin. All rights reserved.`)).toBeInTheDocument();
  });

  it("renders a custom copyright when provided", () => {
    renderWithProvider(<Footer appName="Yunxin" copyright="Made with care" />);
    expect(screen.getByText("Made with care")).toBeInTheDocument();
  });

  it("opens external social links in a new tab, but not internal/mailto ones", () => {
    renderWithProvider(<Footer appName="Yunxin" social={social} />);
    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("href", "https://github.com/x");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");

    const email = screen.getByRole("link", { name: "Email" });
    expect(email).toHaveAttribute("href", "mailto:hi@x.com");
    expect(email).not.toHaveAttribute("target");
  });

  it("exposes both social anchors via aria-label", () => {
    renderWithProvider(<Footer appName="Yunxin" social={social} />);
    const links = within(document.querySelector("footer")!).getAllByRole("link", {
      name: /GitHub|Email/,
    });
    expect(links).toHaveLength(2);
  });
});
