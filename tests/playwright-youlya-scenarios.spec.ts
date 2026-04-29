import { test, expect } from '@playwright/test';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { setKillSwitchForStore } from '@/lib/services/kill-switch-service';

type Scenario = {
  id: string;
  channel: string;
  locale: string;
  message_type: 'text' | 'voice' | 'image';
  input: string;
  preconditions: Record<string, unknown>;
  expected: {
    action?: 'ai_reply' | 'product_results' | 'order_created' | 'handoff' | 'error';
    action_any?: Array<'ai_reply' | 'product_results' | 'order_created' | 'handoff' | 'error'>;
    reply_contains_any?: string[];
  };
};

type TurnResponse = {
  reply?: string;
  action?: 'ai_reply' | 'product_results' | 'order_created' | 'handoff' | 'error';
  data?: unknown;
};

const APP_URL = process.env.APP_URL ?? 'http://localhost:3000';
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;
const TEST_STORE_ID = process.env.TEST_STORE_ID ?? '00000000-0000-0000-0000-000000000001';
const SCENARIOS_PATH =
  process.env.SCENARIOS_PATH ??
  path.join(process.cwd(), 'docs/data/youlya_human_test_scenarios.jsonl');

// Defaults to CONV so Phase 0 does not run DASH scenarios against message-turn.
const SCENARIO_PREFIX = process.env.SCENARIO_PREFIX ?? 'CONV';

function uuid(): string {
  return crypto.randomUUID();
}

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
    expect(INTERNAL_API_SECRET, 'INTERNAL_API_SECRET is required for internal contract tests').toBeTruthy();
  });

  for (const scenario of scenarios) {
    test(`${scenario.id}`, async ({ request }) => {
      test.skip(
        scenario.id.startsWith('DASH-'),
        'Dashboard scenarios are Phase 2 and must use dashboard routes, not /api/internal/messages/turn.',
      );

      const conversationId = uuid();
      const customerId = uuid();
      const providerMessageId = uuid();

      const tone =
        scenario.id === 'CONV-082'
          ? 'angry'
          : scenario.id === 'CONV-083'
            ? 'confused'
            : 'neutral';

      if (scenario.id === 'CONV-081') {
        setKillSwitchForStore(TEST_STORE_ID, true);
      }
      if (scenario.id === 'CONV-083') {
        // Required critical path: 3 unclear turns in same conversation should handoff.
        await request.post(`${APP_URL}/api/internal/messages/turn`, {
          headers: {
            'x-internal-secret': INTERNAL_API_SECRET as string,
          },
          data: {
            store_id: TEST_STORE_ID,
            conversation_id: conversationId,
            customer_id: customerId,
            channel: 'whatsapp_evolution',
            message_type: 'text',
            text: '؟؟',
            language: 'ar-EG',
            tone: 'confused',
            remote_jid: '201000000000@s.whatsapp.net',
            instance_name: 'YoulyaTest',
            provider_message_id: uuid(),
            _preconditions: scenario.preconditions ?? {},
          },
        });
        await request.post(`${APP_URL}/api/internal/messages/turn`, {
          headers: {
            'x-internal-secret': INTERNAL_API_SECRET as string,
          },
          data: {
            store_id: TEST_STORE_ID,
            conversation_id: conversationId,
            customer_id: customerId,
            channel: 'whatsapp_evolution',
            message_type: 'text',
            text: 'ممم',
            language: 'ar-EG',
            tone: 'confused',
            remote_jid: '201000000000@s.whatsapp.net',
            instance_name: 'YoulyaTest',
            provider_message_id: uuid(),
            _preconditions: scenario.preconditions ?? {},
          },
        });
      }
      const res = await request.post(`${APP_URL}/api/internal/messages/turn`, {
        headers: {
          'x-internal-secret': INTERNAL_API_SECRET as string,
        },
        data: {
          store_id: TEST_STORE_ID,
          conversation_id: conversationId,
          customer_id: customerId,
          channel: 'whatsapp_evolution',
          message_type: scenario.message_type,
          text: scenario.input,
          language: scenario.locale || 'ar-EG',
          tone,
          remote_jid: '201000000000@s.whatsapp.net',
          instance_name: 'YoulyaTest',
          provider_message_id: providerMessageId,
          _preconditions: scenario.preconditions ?? {},
        },
      });

      if (scenario.id === 'CONV-081') {
        setKillSwitchForStore(TEST_STORE_ID, false);
      }

      expect(res.status(), `HTTP status for ${scenario.id}`).toBeLessThan(500);

      const body = (await res.json()) as TurnResponse;

      expect(typeof body.reply, `${scenario.id} reply must be string`).toBe('string');
      expect(['ai_reply', 'product_results', 'order_created', 'handoff', 'error']).toContain(body.action);

      const expectedAction = scenario.expected.action;
      const expectedAny = scenario.expected.action_any;

      if (expectedAction) {
        expect(body.action, `${scenario.id} action`).toBe(expectedAction);
      } else if (expectedAny && expectedAny.length > 0) {
        expect(expectedAny, `${scenario.id} action_any`).toContain(body.action);
      }

      const fragments = scenario.expected.reply_contains_any ?? [];
      if (fragments.length > 0) {
        const reply = String(body.reply ?? '').toLowerCase();
        const matched = fragments.some((fragment) => reply.includes(fragment.toLowerCase()));
        expect(matched, `${scenario.id} reply should include one of: ${fragments.join(' | ')}`).toBeTruthy();
      }
    });
  }
});
