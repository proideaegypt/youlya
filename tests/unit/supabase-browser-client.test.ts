import { beforeEach, describe, expect, test, vi } from "vitest";

const createBrowserClientMock = vi.fn((_url: string, _key: string) => ({ auth: {} }));

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: (url: string, key: string) => createBrowserClientMock(url, key),
}));

describe("getSupabaseBrowserClient", () => {
  beforeEach(() => {
    vi.resetModules();
    createBrowserClientMock.mockClear();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  test("throws when public env is missing", async () => {
    const { getSupabaseBrowserClient } = await import("@/lib/supabase/browser");
    expect(() => getSupabaseBrowserClient()).toThrow("missing_public_supabase_env");
  });

  test("creates and reuses browser client", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    const { getSupabaseBrowserClient } = await import("@/lib/supabase/browser");

    const first = getSupabaseBrowserClient();
    const second = getSupabaseBrowserClient();

    expect(first).toBe(second);
    expect(createBrowserClientMock).toHaveBeenCalledTimes(1);
    expect(createBrowserClientMock).toHaveBeenCalledWith("https://example.supabase.co", "anon-key");
  });
});
