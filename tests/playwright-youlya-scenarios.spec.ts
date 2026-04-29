import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

type Scenario = {
  id: string;
  channel: string;
  locale: string;
  message_type: string;
  input: string;
  preconditions: Record<string, unknown>;
  expected: {
    intent: string;
    tools: string[];
    must_not_tools: string[];
    reply_contains_any: string[];
    handoff: boolean;
    risk: string;
  };
};

const APP_URL = process.env.APP_URL ?? 'http://localhost:3000';
const SCENARIOS_PATH =
  process.env.SCENARIOS_PATH ??
  path.join(process.cwd(), 'docs/data/youlya_human_test_scenarios.jsonl');

// Defaults to CONV so Phase 0 does not run DASH scenarios against message-turn.
// Use SCENARIO_PREFIX=DASH later for dashboard-specific tests.
// Use SCENARIO_PREFIX=ALL only when explicit.
const SCENARIO_PREFIX = process.env.SCENARIO_PREFIX ?? 'CONV';

function loadScenarios(): Scenario[] {
  const raw = fs.readFileSync(SCENARIOS_PATH, 'utf8').trim();
  if (!raw) throw new Error(`Scenario file is empty: ${SCENARIOS_PATH}`);

  const parsed = raw
    .split('\n')
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line) as Scenario;
      } catch (error) {
        throw new Error(`Invalid JSONL at line ${index + 1}: ${(error as Error).message}`);
      }
    })
    .filter((scenario) => scenario.id && scenario.id !== 'id');

  const ids = new Set<string>();
  for (const scenario of parsed) {
    if (ids.has(scenario.id)) throw new Error(`Duplicate scenario id: ${scenario.id}`);
    ids.add(scenario.id);
    if (!scenario.expected) throw new Error(`${scenario.id}: missing expected object`);
  }

  if (SCENARIO_PREFIX === 'ALL') return parsed;
  return parsed.filter((scenario) => scenario.id.startsWith(`${SCENARIO_PREFIX}-`));
}

const scenarios = loadScenarios();

test.describe(`Youlya AI Commerce OS scenarios (${SCENARIO_PREFIX})`, () => {
  test.beforeAll(() => {
    expect(scenarios.length, `No scenarios found for prefix ${SCENARIO_PREFIX}`).toBeGreaterThan(0);
  });

  for (const scenario of scenarios) {
    test(`${scenario.id} — ${scenario.expected.intent}`, async ({ request }) => {
      test.skip(
        scenario.id.startsWith('DASH-'),
        'Dashboard scenarios are Phase 2 and must use dashboard routes, not /api/internal/messages/turn.',
      );

      const res = await request.post(`${APP_URL}/api/internal/messages/turn`, {
        data: {
          scenarioId: scenario.id,
          storeSlug: 'youlya',
          channel: scenario.channel,
          locale: scenario.locale,
          messageType: scenario.message_type,
          text: scenario.input,
          preconditions: scenario.preconditions,
          testMode: true,
        },
      });

      expect(res.status(), `HTTP status for ${scenario.id}`).toBeLessThan(500);

      const body = (await res.json()) as {
        intent?: string;
        toolsCalled?: string[];
        reply?: string;
        handoff?: boolean;
      };

      expect(body.intent, `${scenario.id} intent`).toBe(scenario.expected.intent);

      for (const tool of scenario.expected.tools) {
        expect(body.toolsCalled ?? [], `${scenario.id} expected tool ${tool}`).toContain(tool);
      }

      for (const tool of scenario.expected.must_not_tools) {
        expect(body.toolsCalled ?? [], `${scenario.id} must NOT call ${tool}`).not.toContain(tool);
      }

      const fragments = scenario.expected.reply_contains_any ?? [];
      if (fragments.length > 0) {
        const reply = String(body.reply ?? '').toLowerCase();
        const matched = fragments.some((fragment) => reply.includes(fragment.toLowerCase()));
        expect(matched, `${scenario.id} reply should include one of: ${fragments.join(' | ')}`).toBeTruthy();
      }

      expect(Boolean(body.handoff), `${scenario.id} handoff`).toBe(Boolean(scenario.expected.handoff));
    });
  }
});
