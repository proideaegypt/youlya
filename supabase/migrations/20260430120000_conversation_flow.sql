CREATE TABLE IF NOT EXISTS conversation_state (
  conversation_id text PRIMARY KEY,
  stage text NOT NULL DEFAULT 'idle',
  cart_json jsonb DEFAULT '[]',
  customer_name text,
  customer_phone text,
  customer_address text,
  store_id text DEFAULT 'youlya',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE conversation_state DISABLE ROW LEVEL SECURITY;
