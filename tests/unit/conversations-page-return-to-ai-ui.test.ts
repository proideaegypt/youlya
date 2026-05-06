import { describe, expect, test, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/lib/services/message-history-service", () => ({
  listConversations: vi.fn(async () => [
    {
      id: "conv-ui-1",
      customer_id: "201012345678",
      channel: "whatsapp",
      status: "handoff",
      ai_paused: true,
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]),
  getConversationTimeline: vi.fn(async () => []),
  maskCustomerIdentifier: vi.fn((s: string) => s),
}));
vi.mock("@/components/dashboard/record-date-filter", () => ({
  RecordDateFilter: () => null,
}));
vi.mock("@/components/dashboard/record-export-menu", () => ({
  RecordExportMenu: () => null,
}));
vi.mock("@/components/dashboard/return-to-ai-button", () => ({
  ReturnToAiButton: () => "إرجاع المحادثة للذكاء الاصطناعي",
}));

import ConversationsPage from "@/app/dashboard/conversations/page";

describe("conversations page return-to-ai UI", () => {
  test("shows return-to-ai button and paused warning when ai_paused=true", async () => {
    const element = await ConversationsPage({
      searchParams: Promise.resolve({}),
    });

    const html = renderToStaticMarkup(element);
    expect(html).toContain("الذكاء الاصطناعي متوقف لهذه المحادثة");
    expect(html).toContain("إرجاع المحادثة للذكاء الاصطناعي");
  });
});
