import { beforeEach, describe, expect, test, vi } from "vitest";
import { evolutionClient } from "@/lib/adapters/evolution/evolution-client";

describe("evolution client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.EVOLUTION_API_URL = "https://evo.test";
    process.env.EVOLUTION_API_KEY = "k";
    process.env.EVOLUTION_MOCK = "false";
  });

  test("sendText success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));
    await expect(evolutionClient.sendText("YoulyaMain", "2010@s.whatsapp.net", "hi")).resolves.toBeUndefined();
  });

  test("sendText 429 retries then resolves", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 429 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    await expect(evolutionClient.sendText("YoulyaMain", "2010@s.whatsapp.net", "hi")).resolves.toBeUndefined();
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  test("mock mode does not call HTTP", async () => {
    process.env.EVOLUTION_MOCK = "true";
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    await evolutionClient.sendText("YoulyaMain", "2010@s.whatsapp.net", "hi");
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
