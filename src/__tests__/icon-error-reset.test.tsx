import type { YunUIImageProps } from "../adapters/context";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { YunUIProvider } from "../adapters/context";
import { ModelIcon, ProviderIcon } from "../ai/provider-icons";

function TestImage({ src, alt, onError }: YunUIImageProps) {
  return <img data-testid="test-icon" src={src} alt={alt} onError={() => onError?.()} />;
}

const adapters = { Image: TestImage, iconBasePath: "/assets/icons" };

function withProvider(children: React.ReactNode, iconBasePath = adapters.iconBasePath) {
  return <YunUIProvider adapters={{ ...adapters, iconBasePath }}>{children}</YunUIProvider>;
}

describe("icon image failures reset when the source props change", () => {
  it("retries ProviderIcon custom and built-in images after provider or iconUrl changes", async () => {
    const { rerender, container } = render(withProvider(
      <ProviderIcon provider="openai" iconUrl="/custom/openai-one.png" />,
    ));
    const getImage = () => container.querySelector("img")!;
    expect(getImage()).toHaveAttribute("src", "/custom/openai-one.png");

    fireEvent.error(getImage());
    await waitFor(() => expect(getImage()).toHaveAttribute("src", "/assets/icons/providers/openai.webp"));

    rerender(withProvider(<ProviderIcon provider="anthropic" iconUrl="/custom/anthropic.png" />));
    expect(getImage()).toHaveAttribute("src", "/custom/anthropic.png");

    fireEvent.error(getImage());
    await waitFor(() => expect(getImage()).toHaveAttribute("src", "/assets/icons/providers/anthropic.webp"));

    rerender(withProvider(<ProviderIcon provider="google" />));
    expect(getImage()).toHaveAttribute("src", "/assets/icons/providers/google.webp");
  });

  it("retries a new ModelIcon URL after the previous model URL failed", async () => {
    const { rerender } = render(withProvider(
      <ModelIcon iconUrl="/models/first.png" developer="openai" provider="openai" />,
    ));
    expect(screen.getByTestId("test-icon")).toHaveAttribute("src", "/models/first.png");

    fireEvent.error(screen.getByTestId("test-icon"));
    await waitFor(() => expect(screen.getByTestId("test-icon")).toHaveAttribute("src", "/assets/icons/models/openai.webp"));

    rerender(withProvider(<ModelIcon iconUrl="/models/second.png" developer="openai" provider="openai" />));
    expect(screen.getByTestId("test-icon")).toHaveAttribute("src", "/models/second.png");
  });

  it("resets ModelIcon's failed developer priority when the developer or provider changes", async () => {
    const { rerender } = render(withProvider(
      <ModelIcon developer="openai" provider="openai" />,
    ));
    expect(screen.getByTestId("test-icon")).toHaveAttribute("src", "/assets/icons/models/openai.webp");

    fireEvent.error(screen.getByTestId("test-icon"));
    await waitFor(() => expect(screen.getByTestId("test-icon")).toHaveAttribute("src", "/assets/icons/providers/openai.webp"));

    rerender(withProvider(<ModelIcon developer="anthropic" provider="anthropic" />));
    expect(screen.getByTestId("test-icon")).toHaveAttribute("src", "/assets/icons/models/anthropic.webp");
  });

  it("retries built-in ProviderIcon images after the icon base path changes", async () => {
    const { rerender } = render(withProvider(<ProviderIcon provider="openai" />, "/first/icons"));
    fireEvent.error(screen.getByTestId("test-icon"));
    await waitFor(() => expect(screen.queryByTestId("test-icon")).toBeNull());

    rerender(withProvider(<ProviderIcon provider="openai" />, "/second/icons"));
    expect(screen.getByTestId("test-icon")).toHaveAttribute("src", "/second/icons/providers/openai.webp");
  });
});
