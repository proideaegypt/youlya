CREATE TABLE IF NOT EXISTS processed_messages (
  provider_message_id TEXT PRIMARY KEY,
  conversation_id UUID NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  result_action TEXT
);

CREATE INDEX IF NOT EXISTS idx_processed_messages_conversation_id
  ON processed_messages (conversation_id);

ALTER TABLE processed_messages DISABLE ROW LEVEL SECURITY;
