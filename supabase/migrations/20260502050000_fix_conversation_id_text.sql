-- Fix conversation_id type mismatch in tables created with UUID
-- where the app sends string identifiers (e.g., "pilot-test-001").
-- This is a forward-only, safe migration that handles existing constraints.

-- 1) processed_messages
ALTER TABLE processed_messages ALTER COLUMN conversation_id TYPE TEXT;

-- 2) human_handoffs
ALTER TABLE human_handoffs ALTER COLUMN conversation_id TYPE TEXT;

-- 3) dead_letter_log
ALTER TABLE dead_letter_log ALTER COLUMN conversation_id TYPE TEXT;

-- 4) handoff_tickets
-- Drop potential FK constraints before altering type
DO $$
BEGIN
  ALTER TABLE handoff_tickets DROP CONSTRAINT IF EXISTS handoff_tickets_conversation_id_fkey;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'handoff_tickets FK drop skipped: %', SQLERRM;
END $$;
ALTER TABLE handoff_tickets ALTER COLUMN conversation_id TYPE TEXT;

-- 5) ai_tool_calls
DO $$
BEGIN
  ALTER TABLE ai_tool_calls DROP CONSTRAINT IF EXISTS ai_tool_calls_conversation_id_fkey;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'ai_tool_calls FK drop skipped: %', SQLERRM;
END $$;
ALTER TABLE ai_tool_calls ALTER COLUMN conversation_id TYPE TEXT;
