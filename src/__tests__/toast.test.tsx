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

  it("keeps collapsed notification history from rendering empty card backs", () => {
    render(<Toaster />);

    expect(mocks.toaster).toHaveBeenCalledWith(
      expect.objectContaining({
        position: "bottom-right",
        visibleToasts: 1,
      }),
      undefined,
    );
  });
});
