import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { KeyboardEvent, MouseEvent } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContentImage } from "../content/content-image";

class ControlledIntersectionObserver implements IntersectionObserver {
  static instances: ControlledIntersectionObserver[] = [];
  readonly root: Element | Document | null;
  readonly rootMargin: string;
  readonly scrollMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  readonly observed = new Set<Element>();
  disconnected = false;

  constructor(private readonly callback: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
    this.root = options.root ?? null;
    this.rootMargin = options.rootMargin ?? "0px";
    this.scrollMargin = options.scrollMargin ?? "0px";
    this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold ?? 0];
    ControlledIntersectionObserver.instances.push(this);
  }

  observe(target: Element) { this.observed.add(target); }
  unobserve(target: Element) { this.observed.delete(target); }
  disconnect() { this.disconnected = true; this.observed.clear(); }
  takeRecords(): IntersectionObserverEntry[] { return []; }

  enter(target: Element) {
    this.callback([{ target, isIntersecting: true } as IntersectionObserverEntry], this);
  }
}

beforeEach(() => {
  ControlledIntersectionObserver.instances = [];
  vi.stubGlobal("IntersectionObserver", ControlledIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function intersectFirst(image: HTMLImageElement) {
  const observer = ControlledIntersectionObserver.instances.at(-1)!;
  const target = Array.from(observer.observed)[0];
  expect(target).toBeTruthy();
  act(() => observer.enter(target));
  return observer;
}

function getImage(name: string) {
  return screen.getByRole("img", { name }) as HTMLImageElement;
}

describe("ContentImage", () => {
  it("observes against its nearest scroll container even when other panels exist", () => {
    render(<>
      <div data-scroll-container="true">Another panel</div>
      <div data-scroll-container="true">
        <div data-scroll-container="true" data-testid="image-panel">
          <ContentImage src="/nested.jpg" alt="Nested" />
        </div>
      </div>
    </>);
    expect(ControlledIntersectionObserver.instances.at(-1)?.root).toBe(screen.getByTestId("image-panel"));
  });
  it("lazy-loads, exposes a named keyboard zoom action, and restores focus after close", async () => {
    const onLoad = vi.fn();
    render(<ContentImage src="/forest.jpg" alt="A forest" onLoad={onLoad} />);
    const image = getImage("A forest");
    expect(image).not.toHaveAttribute("src");
    expect(image).not.toHaveAttribute("srcset");

    intersectFirst(image);
    await waitFor(() => expect(image).toHaveAttribute("src", "/forest.jpg"));
    fireEvent.load(image);
    expect(onLoad).toHaveBeenCalledOnce();
    expect(image).toHaveAttribute("role", "button");
    expect(image).toHaveAttribute("aria-label", "Zoom image: A forest");
    expect(image.className).toContain("focus-visible:ring-inset");
    image.focus();
    fireEvent.keyDown(image, { key: "Enter" });

    const dialog = await screen.findByRole("dialog", { name: "Image preview: A forest" });
    const closeButton = dialog.querySelector<HTMLButtonElement>('button[title="Close (Esc)"]')!;
    fireEvent.keyDown(closeButton, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Image preview: A forest" })).not.toBeInTheDocument());
    await waitFor(() => expect(image).toHaveFocus());
  });

  it("does not open before load, after failure, or when a caller prevents click", async () => {
    const onError = vi.fn();
    const preventClick = vi.fn((event: MouseEvent<HTMLImageElement>) => event.preventDefault());
    const { rerender } = render(<ContentImage src="/broken.jpg" alt="Broken" role="button" tabIndex={0} onError={onError} onClick={preventClick} />);
    const failedImage = getImage("Broken");
    expect(failedImage).not.toHaveAttribute("role");
    expect(failedImage).not.toHaveAttribute("tabindex");
    intersectFirst(failedImage);
    await waitFor(() => expect(failedImage).toHaveAttribute("src", "/broken.jpg"));

    fireEvent.click(failedImage);
    expect(preventClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.error(failedImage);
    expect(onError).toHaveBeenCalledOnce();
    expect(screen.getByText(/Image failed to load/)).toBeInTheDocument();
    expect(failedImage).not.toHaveAttribute("role", "button");
    expect(failedImage).not.toHaveAttribute("tabindex");

    rerender(<ContentImage src="/healthy.jpg" alt="Healthy" />);
    const healthyImage = getImage("Healthy");
    expect(screen.queryByText(/Image failed to load/)).not.toBeInTheDocument();
    expect(healthyImage).not.toHaveAttribute("src");
    expect(healthyImage).not.toHaveAttribute("role", "button");
  });

  it("ignores stale observer and image events after the source changes", async () => {
    const onLoad = vi.fn();
    const { rerender } = render(<ContentImage src="/first.jpg" alt="First" onLoad={onLoad} />);
    const firstImage = getImage("First");
    const oldObserver = intersectFirst(firstImage);
    await waitFor(() => expect(firstImage).toHaveAttribute("src", "/first.jpg"));

    rerender(<ContentImage src="/second.jpg" alt="Second" onLoad={onLoad} srcSet="/second@2x.jpg 2x" />);
    const secondImage = getImage("Second");
    expect(oldObserver.disconnected).toBe(true);
    expect(secondImage).not.toHaveAttribute("src");
    expect(secondImage).not.toHaveAttribute("srcset");

    act(() => oldObserver.enter(firstImage.parentElement!));
    fireEvent.load(firstImage);
    expect(onLoad).not.toHaveBeenCalled();
    expect(secondImage).not.toHaveAttribute("role", "button");

    intersectFirst(secondImage);
    await waitFor(() => {
      expect(secondImage).toHaveAttribute("src", "/second.jpg");
      expect(secondImage).toHaveAttribute("srcset", "/second@2x.jpg 2x");
    });
    fireEvent.load(secondImage);
    expect(secondImage).toHaveAttribute("role", "button");
  });

  it("retries a failed request when srcSet changes even if src stays the same", async () => {
    const { rerender } = render(<ContentImage src="/responsive.jpg" srcSet="/responsive-old.jpg 2x" alt="Responsive" />);
    const firstImage = getImage("Responsive");
    const firstObserver = intersectFirst(firstImage);
    await waitFor(() => expect(firstImage).toHaveAttribute("srcset", "/responsive-old.jpg 2x"));
    fireEvent.error(firstImage);
    expect(screen.getByText(/Image failed to load/)).toBeInTheDocument();

    rerender(<ContentImage src="/responsive.jpg" srcSet="/responsive-new.jpg 2x" alt="Responsive" />);
    const retryImage = getImage("Responsive");
    expect(retryImage).not.toBe(firstImage);
    expect(firstObserver.disconnected).toBe(true);
    expect(screen.queryByText(/Image failed to load/)).not.toBeInTheDocument();
    expect(retryImage).not.toHaveAttribute("src");
    expect(retryImage).not.toHaveAttribute("srcset");

    intersectFirst(retryImage);
    await waitFor(() => expect(retryImage).toHaveAttribute("srcset", "/responsive-new.jpg 2x"));
    fireEvent.load(retryImage);
    expect(retryImage).toHaveAttribute("role", "button");
  });

  it("closes and resets on source changes and does not reopen after lightbox is disabled", async () => {
    const { rerender } = render(<ContentImage src="/before.jpg" alt="Changing" />);
    const firstImage = getImage("Changing");
    const firstObserver = intersectFirst(firstImage);
    await waitFor(() => expect(firstImage).toHaveAttribute("src", "/before.jpg"));
    fireEvent.load(firstImage);
    fireEvent.click(firstImage);
    expect(await screen.findByRole("dialog", { name: "Image preview: Changing" })).toBeInTheDocument();

    rerender(<ContentImage src="/after.jpg" alt="Changing" />);
    const secondImage = getImage("Changing");
    expect(firstObserver.disconnected).toBe(true);
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Image preview: Changing" })).not.toBeInTheDocument());
    expect(secondImage).not.toHaveAttribute("src");
    expect(secondImage).not.toHaveAttribute("role", "button");

    intersectFirst(secondImage);
    await waitFor(() => expect(secondImage).toHaveAttribute("src", "/after.jpg"));
    fireEvent.load(secondImage);
    fireEvent.click(secondImage);
    expect(await screen.findByRole("dialog", { name: "Image preview: Changing" })).toBeInTheDocument();

    rerender(<ContentImage src="/after.jpg" alt="Changing" enableLightbox={false} />);
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Image preview: Changing" })).not.toBeInTheDocument());
    rerender(<ContentImage src="/after.jpg" alt="Changing" enableLightbox />);
    expect(screen.queryByRole("dialog", { name: "Image preview: Changing" })).not.toBeInTheDocument();
  });

  it("eager-loads when IntersectionObserver is unavailable", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<ContentImage src="/fallback.jpg" alt="Fallback" />);
    const image = getImage("Fallback");
    await waitFor(() => expect(image).toHaveAttribute("src", "/fallback.jpg"));
    fireEvent.load(image);
    expect(image).toHaveAttribute("role", "button");
  });

  it("leaves linked Markdown images as links instead of nested zoom controls", async () => {
    const anchorClick = vi.fn((event: MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    render(<a href="/article" onClick={anchorClick}><ContentImage src="/cover.jpg" alt="Cover" /></a>);
    const image = getImage("Cover");
    intersectFirst(image);
    await waitFor(() => expect(image).toHaveAttribute("src", "/cover.jpg"));
    fireEvent.load(image);

    expect(image).not.toHaveAttribute("role", "button");
    expect(image).not.toHaveAttribute("tabindex");
    expect(image.parentElement?.querySelector("button")).toBeNull();
    fireEvent.click(image);
    expect(anchorClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("supports Space and preserves caller keyboard handlers", async () => {
    const preventKey = vi.fn((event: KeyboardEvent<HTMLImageElement>) => event.preventDefault());
    const { rerender } = render(<ContentImage src="/space.jpg" alt="Space" onKeyDown={preventKey} />);
    let image = getImage("Space");
    intersectFirst(image);
    await waitFor(() => expect(image).toHaveAttribute("src", "/space.jpg"));
    fireEvent.load(image);
    image.focus();
    fireEvent.keyDown(image, { key: " " });
    expect(preventKey).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(<ContentImage src="/space.jpg" alt="Space" />);
    image = screen.getByRole("button", { name: "Zoom image: Space" }) as HTMLImageElement;
    fireEvent.keyDown(image, { key: " " });
    expect(await screen.findByRole("dialog", { name: "Image preview: Space" })).toBeInTheDocument();
  });
});
