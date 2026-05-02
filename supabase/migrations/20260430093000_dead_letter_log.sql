CREATE TABLE IF NOT EXISTS dead_letter_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT,
  provider_message_id TEXT,
  raw_input JSONB NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  retry_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_dead_letter_log_conversation_id
  ON dead_letter_log (conversation_id);

CREATE INDEX IF NOT EXISTS idx_dead_letter_log_provider_message_id
  ON dead_letter_log (provider_message_id);

ALTER TABLE dead_letter_log DISABLE ROW LEVEL SECURITY;
