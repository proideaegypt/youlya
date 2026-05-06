import { describe, expect, test } from "vitest";
import { validateHaidiOutput } from "@/lib/services/haidi-output-validator";
import fs from "node:fs";
import path from "node:path";

const APP_REPLY = "App fallback reply";

describe("haidi-prompt-v22-compliance", () => {
  const promptPath = path.join(process.cwd(), "docs", "HAIDI_AI_SALES_AGENT_PROMPT.md");
  const promptContent = fs.readFileSync(promptPath, "utf-8");

  test("prompt file contains 'Return valid JSON only' in system prompt", () => {
    expect(promptContent).toContain("Return valid JSON only");
  });

  test("prompt version is v2.2", () => {
    expect(promptContent).toContain("v2.2");
  });

  test("prompt states app owns commerce decisions", () => {
    expect(promptContent).toContain("app action is order_created");
    expect(promptContent).toContain("If app says blocked");
  });

  test("prompt states Haidi cannot confirm order independently", () => {
    expect(promptContent).toContain("Never create or confirm an order yourself");
    expect(promptContent).toContain("Never say order confirmed unless app action is order_created");
  });

  test("prompt states handoff only for explicit requests", () => {
    expect(promptContent).toContain("handoff");
    expect(promptContent).toContain("asks for a human");
  });
});

describe("n8n-workflow-json-mode-compliance", () => {
  const backupPath = path.join(process.cwd(), "n8n", "backups", "workflow-joqfame4HXG775JO-haidi-openai.json");
  const backupContent = fs.readFileSync(backupPath, "utf-8");

  test("backup workflow has response_format json_object", () => {
    expect(backupContent).toContain("json_object");
    expect(backupContent).toContain("response_format");
  });

  test("backup workflow system content includes 'Return valid JSON only'", () => {
    expect(backupContent).toContain("Return valid JSON only");
  });

  test("backup workflow user content includes 'Return JSON only'", () => {
    expect(backupContent).toContain("Return JSON only");
  });

  test("backup workflow user content includes 'Input JSON'", () => {
    expect(backupContent).toContain("Input JSON");
  });
});

describe("n8n-workflow-handoff-bypass", () => {
  const backupPath = path.join(process.cwd(), "n8n", "backups", "workflow-joqfame4HXG775JO-haidi-openai.json");
  const backup = JSON.parse(fs.readFileSync(backupPath, "utf-8"));

  test("has Check Handoff Bypass node", () => {
    const node = backup.nodes.find((n: { name: string }) => n.name === "Check Handoff Bypass");
    expect(node).toBeDefined();
    expect(node.type).toBe("n8n-nodes-base.if");
  });

  test("has Bypass Haidi node", () => {
    const node = backup.nodes.find((n: { name: string }) => n.name === "Bypass Haidi");
    expect(node).toBeDefined();
    expect(node.type).toBe("n8n-nodes-base.code");
  });

  test("handoff bypass connects to Prepare Reply", () => {
    const bypassConn = backup.connections["Bypass Haidi"];
    expect(bypassConn).toBeDefined();
    const targets = bypassConn.main[0].map((c: { node: string }) => c.node);
    expect(targets).toContain("Prepare Reply");
  });

  test("Check Handoff Bypass true branch goes to Bypass Haidi", () => {
    const ifConn = backup.connections["Check Handoff Bypass"];
    expect(ifConn).toBeDefined();
    const trueBranch = ifConn.main[0].map((c: { node: string }) => c.node);
    expect(trueBranch).toContain("Bypass Haidi");
  });

  test("Check Handoff Bypass false branch goes to Build Haidi Prompt", () => {
    const ifConn = backup.connections["Check Handoff Bypass"];
    expect(ifConn).toBeDefined();
    const falseBranch = ifConn.main[1].map((c: { node: string }) => c.node);
    expect(falseBranch).toContain("Build Haidi Prompt");
  });
});

describe("haidi-output-validator-v22", () => {
  const appReply = "App fallback reply";

  test("blocks Haidi from overriding app handoff action", () => {
    const result = validateHaidiOutput(
      {
        final_reply: "Hello there",
        intent_label: "greeting",
      },
      "handoff",
      appReply
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("cannot override app handoff");
    }
  });

  test("allows handoff intent when app action is handoff", () => {
    const result = validateHaidiOutput(
      {
        final_reply: "تمام يا قمر، هحولك لفريق الدعم",
        intent_label: "handoff",
      },
      "handoff",
      appReply
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.intent_label).toBe("handoff");
    }
  });

  test("blocks Haidi from overriding app order_created action", () => {
    const result = validateHaidiOutput(
      {
        final_reply: "Your order is done",
        intent_label: "greeting",
      },
      "order_created",
      appReply
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("cannot override app order_created");
    }
  });

  test("allows confirm_order intent when app action is order_created", () => {
    const result = validateHaidiOutput(
      {
        final_reply: "تم تأكيد الأوردر بنجاح",
        intent_label: "confirm_order",
      },
      "order_created",
      appReply
    );
    expect(result.ok).toBe(true);
  });

  test("normal product search can use Haidi", () => {
    const result = validateHaidiOutput(
      {
        final_reply: "أكيد يا قمر، عندي بيجامات شتوي",
        intent_label: "product_search",
      },
      "product_results",
      appReply,
      { products: [{ price: 950, available: true }] }
    );
    expect(result.ok).toBe(true);
  });

  test("customer service request does not trigger unsafe order claim", () => {
    const result = validateHaidiOutput(
      {
        final_reply: "عايزة أكلم حد من الدعم",
        intent_label: "support",
      },
      "ai_reply",
      appReply
    );
    expect(result.ok).toBe(true);
  });

  test("normal unclear message does not handoff", () => {
    const result = validateHaidiOutput(
      {
        final_reply: "ممكن توضحي أكتر؟",
        intent_label: "unclear",
      },
      "ai_reply",
      appReply
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.intent_label).toBe("unclear");
    }
  });

  test("plain text string input falls back", () => {
    const result = validateHaidiOutput(
      "This is plain text, not JSON",
      "ai_reply",
      appReply
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("not an object");
    }
  });

  test("empty JSON object falls back", () => {
    const result = validateHaidiOutput(
      {},
      "ai_reply",
      appReply
    );
    expect(result.ok).toBe(false);
  });
});
