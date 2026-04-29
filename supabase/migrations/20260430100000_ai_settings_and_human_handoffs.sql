CREATE TABLE IF NOT EXISTS ai_settings (
  store_id TEXT PRIMARY KEY DEFAULT 'youlya',
  ai_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT
);

INSERT INTO ai_settings (store_id, ai_enabled)
VALUES ('youlya', TRUE)
ON CONFLICT (store_id) DO NOTHING;

ALTER TABLE ai_settings DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS human_handoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  reason TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_human_handoffs_open
  ON human_handoffs (requested_at DESC)
  WHERE resolved_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_human_handoffs_conversation_id
  ON human_handoffs (conversation_id);

ALTER TABLE human_handoffs DISABLE ROW LEVEL SECURITY;
