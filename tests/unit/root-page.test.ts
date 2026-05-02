import { describe, expect, test, vi } from "vitest";

const redirectMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (path: string) => redirectMock(path),
}));

describe("root page", () => {
  test("redirects to dashboard", async () => {
    const page = await import("@/app/page");
    page.default();
    expect(redirectMock).toHaveBeenCalledWith("/dashboard");
  });
});
