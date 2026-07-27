import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  toaster: vi.fn(() => null),
}));

vi.mock("sonner", () => ({
  Toaster: mocks.toaster,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    promise: vi.fn(),
  },
}));

import { Toaster } from "../primitives/toast";

describe("Toaster", () => {
  beforeEach(() => {
    mocks.toaster.mockClear();
  });

  it("keeps notification history from rendering empty collapsed card backs", () => {
    render(<Toaster />);

    expect(mocks.toaster).toHaveBeenCalledWith(
      expect.objectContaining({
        expand: true,
        position: "bottom-right",
        visibleToasts: 1,
      }),
      undefined,
    );
  });

  it("supports shell-safe offsets without losing YunUI toast styling", () => {
    render(
      <Toaster
        offset={{ bottom: 176, right: 16 }}
        mobileOffset={{ bottom: 152, right: 12 }}
        toastOptions={{ classNames: { toast: "custom-toast" } }}
      />,
    );

    expect(mocks.toaster).toHaveBeenCalledWith(
      expect.objectContaining({
        offset: { bottom: 176, right: 16 },
        mobileOffset: { bottom: 152, right: 12 },
        toastOptions: expect.objectContaining({
          classNames: expect.objectContaining({
            toast: "custom-toast",
            title: "text-sm font-medium",
          }),
        }),
      }),
      undefined,
    );
  });
});
