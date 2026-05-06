-- Emergency schema fix for production
-- Date: 2026-05-05
-- Purpose: Align empty/under-used tables with app v2.19.7 expectations
-- Safety: Only empty tables are dropped; non-empty tables are altered safely.
-- Tables with data (stores, products, product_variants, conversation_state, processed_messages, human_handoffs, ai_settings) are handled carefully.

BEGIN;

-- 1) Fix processed_messages (8 rows, UUID values are valid text strings)
ALTER TABLE processed_messages ALTER COLUMN conversation_id TYPE TEXT;

-- 2) Fix human_handoffs (4 rows, UUID values are valid text strings)
ALTER TABLE human_handoffs ALTER COLUMN conversation_id TYPE TEXT;

-- 3) Add ai_paused to conversation_state (12 rows)
ALTER TABLE conversation_state ADD COLUMN IF NOT EXISTS ai_paused BOOLEAN NOT NULL DEFAULT FALSE;

-- 4) Drop FK constraints and policies on empty tables referencing conversations.id / customers.id / stores.id
DROP POLICY IF EXISTS last_product_recommendations_store_isolation ON last_product_recommendations;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_conversation_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_customer_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_store_id_fkey;
ALTER TABLE last_product_recommendations DROP CONSTRAINT IF EXISTS last_product_recommendations_conversation_id_fkey;
ALTER TABLE last_product_recommendations DROP CONSTRAINT IF EXISTS last_product_recommendations_customer_id_fkey;
ALTER TABLE last_product_recommendations DROP CONSTRAINT IF EXISTS last_product_recommendations_store_id_fkey;
ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_conversation_id_fkey;
ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_customer_id_fkey;
ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_store_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_conversation_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_cart_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_store_id_fkey;
ALTER TABLE ai_tool_calls DROP CONSTRAINT IF EXISTS ai_tool_calls_conversation_id_fkey;
ALTER TABLE ai_tool_calls DROP CONSTRAINT IF EXISTS ai_tool_calls_store_id_fkey;
ALTER TABLE handoff_tickets DROP CONSTRAINT IF EXISTS handoff_tickets_conversation_id_fkey;
ALTER TABLE handoff_tickets DROP CONSTRAINT IF EXISTS handoff_tickets_customer_id_fkey;
ALTER TABLE handoff_tickets DROP CONSTRAINT IF EXISTS handoff_tickets_store_id_fkey;
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_store_id_fkey;
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_customer_id_fkey;
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_store_id_fkey;
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_store_id_fkey;
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_cart_id_fkey;
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_variant_id_fkey;

-- 5) Alter conversations (empty) - change id/store_id/customer_id to text, add missing columns
ALTER TABLE conversations ALTER COLUMN id TYPE TEXT;
ALTER TABLE conversations ALTER COLUMN store_id TYPE TEXT;
ALTER TABLE conversations ALTER COLUMN customer_id TYPE TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS ai_paused BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS external_conversation_id TEXT;

-- 6) Alter customers (empty)
ALTER TABLE customers ALTER COLUMN id TYPE TEXT;
ALTER TABLE customers ALTER COLUMN store_id TYPE TEXT;
ALTER TABLE customers ALTER COLUMN external_customer_id TYPE TEXT;

-- 7) Alter messages (empty)
ALTER TABLE messages ALTER COLUMN store_id TYPE TEXT;
ALTER TABLE messages ALTER COLUMN conversation_id TYPE TEXT;
ALTER TABLE messages ALTER COLUMN customer_id TYPE TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS transcript TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS image_caption TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS ai_agent_draft TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS final_reply TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'delivered';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS n8n_execution_id TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS evolution_message_id TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS error_code TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS text TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
UPDATE messages SET text = body WHERE text IS NULL AND body IS NOT NULL;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_message_type_check;
ALTER TABLE messages ADD CONSTRAINT messages_message_type_check CHECK (message_type IN ('text','audio','image','system','voice'));

-- 8) Alter carts (empty)
ALTER TABLE carts ALTER COLUMN store_id TYPE TEXT;
ALTER TABLE carts ALTER COLUMN conversation_id TYPE TEXT;
ALTER TABLE carts ALTER COLUMN customer_id TYPE TEXT;

-- 9) Alter cart_items (empty)
ALTER TABLE cart_items ALTER COLUMN store_id TYPE TEXT;

-- 10) Alter orders (empty)
ALTER TABLE orders ALTER COLUMN store_id TYPE TEXT;
ALTER TABLE orders ALTER COLUMN conversation_id TYPE TEXT;
ALTER TABLE orders ALTER COLUMN customer_id TYPE TEXT;
ALTER TABLE orders ALTER COLUMN cart_id TYPE UUID; -- keep as UUID since carts.id stays UUID

-- 11) Alter last_product_recommendations (empty)
ALTER TABLE last_product_recommendations ALTER COLUMN store_id TYPE TEXT;
ALTER TABLE last_product_recommendations ALTER COLUMN conversation_id TYPE TEXT;
ALTER TABLE last_product_recommendations ALTER COLUMN customer_id TYPE TEXT;

-- 12) Alter ai_tool_calls (empty)
ALTER TABLE ai_tool_calls ALTER COLUMN store_id TYPE TEXT;
ALTER TABLE ai_tool_calls ALTER COLUMN conversation_id TYPE TEXT;

-- 13) Drop and recreate handoff_tickets (empty, schema too different)
DROP TABLE IF EXISTS handoff_tickets CASCADE;
CREATE TABLE handoff_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT NOT NULL,
  conversation_id TEXT NOT NULL,
  customer_id TEXT,
  reason TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'NORMAL',
  status TEXT NOT NULL DEFAULT 'open',
  assigned_user_id TEXT,
  assigned_to TEXT,
  ai_summary TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  resolved_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_handoff_store_conversation_open ON handoff_tickets (store_id, conversation_id, status);
ALTER TABLE handoff_tickets ENABLE ROW LEVEL SECURITY;

-- 14) Create conversation_events (missing table)
CREATE TABLE IF NOT EXISTS conversation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT NOT NULL,
  conversation_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('tool_call','handoff','error','ai_reply','human_reply','system','status_change','cart_update')),
  summary TEXT NOT NULL DEFAULT '',
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_conversation_events_conversation_id ON conversation_events (conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_events_store_conversation ON conversation_events (store_id, conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_events_event_type ON conversation_events (event_type);
ALTER TABLE conversation_events DISABLE ROW LEVEL SECURITY;

COMMIT;

-- 15) Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
