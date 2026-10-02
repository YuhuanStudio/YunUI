import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { YunUIProvider, type YunUIAdapters, type YunUIImageProps, type YunUILinkProps } from "../adapters/context";
import { StreamingText, type StreamingSource, type StreamingToken } from "../chat/chat-streaming-text";
import { ContextCards, type ContextChunk } from "../chat/chat-context-cards";

const sources: StreamingSource[] = [
  { id: "a", name: "First source", domain: "first.example", href: "https://first.example", image: "https://first.example/icon.png" },
  { id: "b", name: "Second source", domain: "second.example", href: "https://second.example" },
];

const chunks: ContextChunk[] = [
  { id: "a/b", title: "First context", body: "First excerpt", source: "Guide.pdf", badge: "PDF", badgeTone: "info", href: "https://docs.example/guide" },
  { id: "a_b", title: "Second context", body: "Second excerpt", source: "Report.csv", badge: "CSV", badgeTone: "success", href: "/reports/latest", selected: true },
];

function renderWithAdapters(ui: React.ReactNode, adapters: Partial<YunUIAdapters>) {
  return render(<YunUIProvider adapters={adapters}>{ui}</YunUIProvider>);
}

describe("StreamingText", () => {
  it("preserves host text whitespace and resolves citations by stable source ID", () => {
    const tokens: StreamingToken[] = [
      { id: "t1", text: "Claim " },
      { id: "cite", text: "[2]", cite: true, sourceId: "b" },
      { id: "t2", text: "  continues\nverbatim." },
    ];
    const { container } = render(<StreamingText content={tokens} sources={sources} />);
    const answer = container.querySelector("[data-yunui='streaming-text'] > p");
    expect(answer?.textContent).toBe("Claim [2]Ssecond.example  continues\nverbatim.");
    const citation = screen.getByRole("link", { name: "Second source (second.example)" });
    expect(citation).toHaveAttribute("href", "https://second.example");
    expect(citation).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.queryByRole("link", { name: "First source (first.example)" })).not.toBeInTheDocument();
  });

  it("keeps partial, empty and failed states host controlled and hides completion controls until complete", () => {
    const content: StreamingToken[] = [{ text: "partial " }, { text: "answer" }];
    const { rerender, container } = render(<StreamingText content={content} state="streaming" visibleCount={1} sources={sources} followUps={["Next question"]} onAction={vi.fn()} onFollowUp={vi.fn()} />);
    expect(container.querySelector("p")?.textContent).toContain("partial ");
    expect(screen.getByRole("status")).toHaveTextContent("Answer is streaming");
    expect(screen.queryByRole("button", { name: "Copy answer" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next question" })).not.toBeInTheDocument();

    rerender(<StreamingText content={[]} state="empty" />);
    expect(screen.getByRole("status")).toHaveTextContent("No answer was returned.");
    rerender(<StreamingText content={[{ text: "Received before failure.\n" }, { text: "More buffered text." }]} visibleCount={1} state="error" />);
    expect(container.querySelector("p")?.textContent).toContain("Received before failure.\nMore buffered text.");
    expect(screen.getByRole("status")).toHaveTextContent("This answer could not be completed.");
    rerender(<StreamingText content={[{ text: "Received before cancellation." }]} state="cancelled" />);
    expect(container.querySelector("p")?.textContent).toContain("Received before cancellation.");
    expect(screen.getByRole("status")).toHaveTextContent("Generation cancelled.");
  });

  it("disables unavailable actions and keeps a collapsed source list inert", async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(<StreamingText content={[{ text: "Done." }]} sources={sources} followUps={["Ask again"]} />);
    expect(screen.getByRole("button", { name: "Copy answer" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Ask again" })).toBeDisabled();
    const sourceToggle = screen.getByRole("button", { name: "2 sources" });
    const disclosure = document.getElementById(sourceToggle.getAttribute("aria-controls")!);
    expect(disclosure).toHaveAttribute("aria-hidden", "true");
    expect(disclosure).toHaveAttribute("inert");
    await user.click(sourceToggle);
    expect(sourceToggle).toHaveAttribute("aria-expanded", "true");
    await user.click(sourceToggle);
    expect(sourceToggle).toHaveAttribute("aria-expanded", "false");
    expect(disclosure).toHaveAttribute("aria-hidden", "true");
    expect(disclosure).toHaveAttribute("inert");
    expect(container.querySelectorAll("#" + sourceToggle.getAttribute("aria-controls") + " a")).toHaveLength(2);

    const onSourcesOpenChange = vi.fn();
    rerender(<StreamingText content={[]} sources={sources} sourcesOpen={false} />);
    expect(screen.getByRole("button", { name: "2 sources" })).toBeDisabled();
    rerender(<StreamingText content={[]} sources={sources} sourcesOpen={false} onSourcesOpenChange={onSourcesOpenChange} />);
    await user.click(screen.getByRole("button", { name: "2 sources" }));
    expect(onSourcesOpenChange).toHaveBeenCalledWith(true);
  });

  it("exposes distinct disclosure IDs across instances and only shows valid safe links", async () => {
    const user = userEvent.setup();
    render(<><StreamingText content={[]} sources={sources} defaultSourcesOpen/><StreamingText content={[]} sources={[{ id: "evil", name: "Unsafe", domain: "unsafe.example", href: "javascript:alert(1)", image: "data:image/svg+xml,hi" }]} defaultSourcesOpen/></>);
    const controls = screen.getAllByRole("button", { name: /\d+ sources?/ });
    expect(controls[0].getAttribute("aria-controls")).not.toBe(controls[1].getAttribute("aria-controls"));
    const unsafe = screen.getByText("unsafe.example");
    expect(unsafe.closest("a")).toBeNull();
    expect(unsafe.parentElement).not.toHaveAttribute("aria-label");
    expect(unsafe.parentElement).toHaveTextContent("Unsafe");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    await user.click(controls[0]);
    expect(controls[0]).toHaveAttribute("aria-expanded", "false");
  });

  it("uses all caller labels and sends action/follow-up payloads", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onFollowUp = vi.fn();
    render(<StreamingText content={[{ text: "Complete" }]} sources={sources} followUps={["Localized follow-up"]} labels={{ actions: "回答操作", copyAnswer: "Copy localized", sources: "資料" }} onAction={onAction} onFollowUp={onFollowUp} />);
    expect(screen.getByRole("group", { name: "回答操作" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy localized" }));
    await user.click(screen.getByRole("button", { name: "Localized follow-up" }));
    await user.click(screen.getByRole("button", { name: "2 資料" }));
    expect(onAction).toHaveBeenCalledWith("copy");
    expect(onFollowUp).toHaveBeenCalledWith("Localized follow-up", 0);
  });

  it("uses a singular default source count while preserving a custom source label", () => {
    const { rerender } = render(<StreamingText content={[]} sources={sources.slice(0, 1)} />);
    expect(screen.getByRole("button", { name: "1 source" })).toBeInTheDocument();
    rerender(<StreamingText content={[]} sources={sources.slice(0, 1)} labels={{ sources: "reference" }} />);
    expect(screen.getByRole("button", { name: "1 reference" })).toBeInTheDocument();
  });

  it("routes source links and avatars through YunUI adapters and retries a changed image after failure", () => {
    const injectedHrefs: string[] = [];
    const LinkAdapter = ({ href, children, ...props }: YunUILinkProps) => {
      injectedHrefs.push(href);
      return <a data-adapter-link href={href} {...props}>{children}</a>;
    };
    const ImageAdapter = ({ src, alt, width, height, className, onError }: YunUIImageProps) => (
      <img data-adapter-image src={src} alt={alt} width={width} height={height} className={className} onError={onError}/>
    );
    const firstSource: StreamingSource = { id: "adapter-source", name: "Adapter source", domain: "adapter.example", href: "https://adapter.example/page", image: "https://adapter.example/first.png" };
    const content: StreamingToken[] = [{ id: "adapter-cite", text: "", cite: true, sourceId: firstSource.id }];
    const view = renderWithAdapters(<><StreamingText content={content} sources={[firstSource]}/><ContextCards chunks={[{ ...chunks[0], href: "https://docs.example/guide" }]}/></>, { Link: LinkAdapter, Image: ImageAdapter });
    const firstImage = view.container.querySelector<HTMLImageElement>("[data-adapter-image]")!;
    expect(firstImage).toHaveAttribute("width", "16");
    expect(firstImage).toHaveAttribute("height", "16");
    expect(document.querySelectorAll("[data-adapter-link]")).toHaveLength(3);
    expect(injectedHrefs).toContain("https://adapter.example/page");
    expect(injectedHrefs).toContain("https://docs.example/guide");

    fireEvent.error(firstImage);
    expect(view.container.querySelectorAll("[data-adapter-image]")).toHaveLength(2);
    const changedSource = { ...firstSource, image: "https://adapter.example/second.png" };
    view.rerender(<YunUIProvider adapters={{ Link: LinkAdapter, Image: ImageAdapter }}><><StreamingText content={content} sources={[changedSource]}/><ContextCards chunks={[{ ...chunks[0], href: "https://docs.example/guide" }]}/></></YunUIProvider>);
    expect(view.container.querySelector("[data-adapter-image]")).toHaveAttribute("src", changedSource.image);
  });
});

describe("ContextCards", () => {
  it("uses collision-free instance-prefixed IDs and follows the host selection callback", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const { container } = render(<><ContextCards chunks={chunks} onSelectionChange={onSelectionChange}/><ContextCards chunks={[chunks[0]]}/></>);
    const articles = container.querySelectorAll("article");
    const labels = [...articles].map((article) => article.getAttribute("aria-labelledby"));
    expect(new Set(labels).size).toBe(3);
    expect(labels[0]).not.toBe(labels[1]);
    expect(labels[0]).not.toBe(labels[2]);
    await user.click(screen.getByRole("button", { name: "Include Guide.pdf" }));
    expect(onSelectionChange).toHaveBeenCalledWith("a/b", true);
    await user.click(screen.getByRole("button", { name: "Exclude Report.csv" }));
    expect(onSelectionChange).toHaveBeenCalledWith("a_b", false);
  });

  it("does not emit unsafe URLs, preserves safe external-link protections and omits no-op controls", async () => {
    const onSourceOpen = vi.fn();
    const user = userEvent.setup();
    const unsafeChunk: ContextChunk = { id: "unsafe", title: "Unsafe source", body: "Body", source: "Injected URL", badge: "URL", href: "javascript:alert(1)" };
    render(<><ContextCards chunks={[unsafeChunk]} onSourceOpen={onSourceOpen}/><ContextCards chunks={[chunks[0]]}/></>);
    await user.click(screen.getByRole("button", { name: "Open Injected URL" }));
    expect(onSourceOpen).toHaveBeenCalledWith(unsafeChunk);
    expect(containerFirstLink()).toBe(false);
    const safeLink = screen.getByRole("link", { name: "Open Guide.pdf" });
    expect(safeLink).toHaveAttribute("href", "https://docs.example/guide");
    expect(safeLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.queryByRole("button", { name: /Include|Exclude/ })).not.toBeInTheDocument();
  });

  it("renders localized empty state and badge tone from YunUI semantic classes", () => {
    const { container } = render(<ContextCards chunks={[]} labels={{ header: "Evidence", empty: "Nothing found", count: "zero" }} />);
    expect(screen.getByRole("heading", { name: "Evidence" })).toBeInTheDocument();
    expect(screen.getByText("Nothing found")).toBeInTheDocument();
    expect(screen.getByText("zero")).toBeInTheDocument();
    const { container: populated } = render(<ContextCards chunks={[chunks[0]]} />);
    expect(populated.querySelector(".bg-info-soft.text-info")).toBeInTheDocument();
    expect(container.querySelector("article")).toBeNull();
  });
});

function containerFirstLink() {
  return Boolean(screen.queryByRole("link", { name: "Open Injected URL" }));
}
