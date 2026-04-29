export type ScenarioExpected = {
  intent: string;
  tools: string[];
  must_not_tools: string[];
  reply_contains_any: string[];
  handoff: boolean;
  risk: string;
};

export type ScenarioRecord = {
  id: string;
  channel: string;
  locale: string;
  message_type: string;
  input: string;
  preconditions: Record<string, unknown>;
  expected: ScenarioExpected;
};

