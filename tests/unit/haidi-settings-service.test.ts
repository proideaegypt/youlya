import { describe, it, expect, beforeEach } from "vitest";
import { getHaidiSettings, updateHaidiSettings } from "@/lib/services/haidi-settings-service";
import { getMockState } from "@/lib/adapters/supabase/mock-store";

describe("haidi-settings-service", () => {
  beforeEach(() => {
    getMockState().haidiSettingsByStore.clear();
  });

  it("returns defaults when no settings exist", async () => {
    const s = await getHaidiSettings("youlya");
    expect(s.storeId).toBe("youlya");
    expect(s.defaultLanguage).toBe("ar-EG");
    expect(s.tone).toBe("warm");
    expect(s.emojiLevel).toBe("normal");
    expect(s.replyLength).toBe("balanced");
    expect(s.upsellMode).toBe("soft");
    expect(s.maxUpsellsPerConversation).toBe(1);
    expect(s.recommendAlternativesWhenOOS).toBe(true);
    expect(s.recommendComplementaryProducts).toBe(true);
    expect(s.useUrgencyOnlyFromRealStock).toBe(true);
    expect(s.useSocialProofOnlyFromRealData).toBe(true);
    expect(s.maxProductsShownPerReply).toBe(3);
    expect(s.maxSearchResultsInternal).toBe(10);
    expect(s.handoffOnHumanRequest).toBe(true);
    expect(s.handoffAfterUnclearCount).toBe(3);
    expect(s.handoffOnAngryTone).toBe(true);
    expect(s.humanHandoffEnabled).toBe(true);
    expect(s.handoffCustomerServiceEnabled).toBe(true);
    expect(s.handoffManagerRequestEnabled).toBe(true);
    expect(s.pauseAiAfterHandoff).toBe(true);
    expect(s.sendHandoffAcknowledgement).toBe(true);
    expect(s.notifyHumanTeam).toBe(true);
    expect(s.defaultHandoffAssignee).toBeNull();
    expect(s.customerServiceReplyTemplateAr).toBe("تمام يا فندم، هسجل طلبك وهيتواصل معاكي حد من الفريق حالًا.");
    expect(s.managerRequestReplyTemplateAr).toBe("تمام يا فندم، هسجل طلبك كطلب تواصل مع الإدارة وهيتواصل معاكي حد من الفريق حالًا.");
    expect(s.handoffFinalAckTemplateAr).toBe("تم تسجيل الطلب، وسيتواصل معاكي حد من الفريق.");
    expect(s.globalAiPaused).toBe(false);
    expect(s.ordersPaused).toBe(false);
    expect(s.promptVersion).toBe("v1");
  });

  it("updates settings and reflects changes", async () => {
    await updateHaidiSettings("youlya", { tone: "playful", maxUpsellsPerConversation: 2 }, "test");
    const s = await getHaidiSettings("youlya");
    expect(s.tone).toBe("playful");
    expect(s.maxUpsellsPerConversation).toBe(2);
    expect(s.defaultLanguage).toBe("ar-EG"); // unchanged
  });

  it("does not expose secrets in settings", async () => {
    const s = await getHaidiSettings("youlya");
    const json = JSON.stringify(s);
    expect(json).not.toContain("SECRET");
    expect(json).not.toContain("TOKEN");
    expect(json).not.toContain("KEY");
  });

  it("pauses and resumes AI globally", async () => {
    await updateHaidiSettings("youlya", { globalAiPaused: true }, "test");
    let s = await getHaidiSettings("youlya");
    expect(s.globalAiPaused).toBe(true);

    await updateHaidiSettings("youlya", { globalAiPaused: false }, "test");
    s = await getHaidiSettings("youlya");
    expect(s.globalAiPaused).toBe(false);
  });

  it("pauses and resumes orders", async () => {
    await updateHaidiSettings("youlya", { ordersPaused: true }, "test");
    let s = await getHaidiSettings("youlya");
    expect(s.ordersPaused).toBe(true);

    await updateHaidiSettings("youlya", { ordersPaused: false }, "test");
    s = await getHaidiSettings("youlya");
    expect(s.ordersPaused).toBe(false);
  });

  it("isolates settings per store", async () => {
    await updateHaidiSettings("store-a", { tone: "premium" }, "test");
    await updateHaidiSettings("store-b", { tone: "concise" }, "test");
    const a = await getHaidiSettings("store-a");
    const b = await getHaidiSettings("store-b");
    expect(a.tone).toBe("premium");
    expect(b.tone).toBe("concise");
  });
});
