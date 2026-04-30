CREATE TABLE IF NOT EXISTS failed_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id text NOT NULL,
  source text NOT NULL,
  provider text,
  error_code text,
  error_message text,
  payload jsonb,
  retry_count int DEFAULT 0,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE failed_events ENABLE ROW LEVEL SECURITY;
