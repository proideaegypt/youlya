ALTER TABLE IF EXISTS public.conversations
  ADD COLUMN IF NOT EXISTS state_json jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS ai_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS agent_handling boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_killed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS external_conversation_id text;

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS conversations_service_role_all ON public.conversations;
CREATE POLICY conversations_service_role_all
ON public.conversations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
