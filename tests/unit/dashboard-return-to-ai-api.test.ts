import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/lib/auth/user-management-api", () => ({
  getCurrentDashboardActor: vi.fn(),
}));

vi.mock("@/lib/services/handoff-service", () => ({
  returnToAI: vi.fn(),
}));

vi.mock("@/lib/services/conversation-flow-service", () => ({
  isAIPaused: vi.fn(),
}));

import { POST } from "@/app/api/dashboard/conversations/[id]/return-to-ai/route";
import { getCurrentDashboardActor } from "@/lib/auth/user-management-api";
import { returnToAI } from "@/lib/services/handoff-service";
import { isAIPaused } from "@/lib/services/conversation-flow-service";

const mockedActor = vi.mocked(getCurrentDashboardActor);
const mockedReturnToAI = vi.mocked(returnToAI);
const mockedIsAIPaused = vi.mocked(isAIPaused);

describe("dashboard return-to-ai route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("unauthorized request is rejected", async () => {
    mockedActor.mockResolvedValueOnce(null);

    const req = new Request("http://localhost/api/dashboard/conversations/conv-1/return-to-ai", {
      method: "POST",
      body: JSON.stringify({ actor: "staff" }),
      headers: { "content-type": "application/json" },
    });

    const res = await POST(req, { params: Promise.resolve({ id: "conv-1" }) });
    expect(res.status).toBe(401);
  });

  test("authorized request succeeds", async () => {
    mockedActor.mockResolvedValueOnce({ userId: "u-1", role: "customer_service" });
    mockedReturnToAI.mockResolvedValueOnce(true);
    mockedIsAIPaused.mockResolvedValueOnce(false);

    const req = new Request("http://localhost/api/dashboard/conversations/conv-2/return-to-ai", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "content-type": "application/json" },
    });

    const res = await POST(req, { params: Promise.resolve({ id: "conv-2" }) });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.status).toBe("ai_active");
    expect(mockedReturnToAI).toHaveBeenCalledWith("conv-2", "u-1");
  });
});
