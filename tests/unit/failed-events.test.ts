import { describe, expect, test } from "vitest";
import { POST } from "@/app/api/internal/failed-events/route";

function req(body: unknown, secret?: string) {
  return new Request("http://localhost/api/internal/failed-events", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret ? { "x-internal-secret": secret } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("failed-events route", () => {
  test("without auth returns 401", async () => {
    process.env.INTERNAL_API_SECRET = "s";
    const res = await POST(req({ storeSlug: "youlya", source: "x" }));
    expect(res.status).toBe(401);
  });

  test("with auth returns 201", async () => {
    process.env.INTERNAL_API_SECRET = "s";
    const res = await POST(
      req(
        {
          storeSlug: "youlya",
          source: "n8n",
          provider: "evolution",
          errorCode: "E",
          errorMessage: "m",
          payload: { a: 1 },
          retryCount: 1,
        },
        "s",
      ),
    );
    expect(res.status).toBe(201);
  });
});
