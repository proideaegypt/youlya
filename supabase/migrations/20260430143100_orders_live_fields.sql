ALTER TABLE IF EXISTS public.orders
  ADD COLUMN IF NOT EXISTS channel text,
  ADD COLUMN IF NOT EXISTS total_price numeric,
  ADD COLUMN IF NOT EXISTS line_items_json jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS safety_status text,
  ADD COLUMN IF NOT EXISTS created_by text;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS orders_service_role_all ON public.orders;
CREATE POLICY orders_service_role_all
ON public.orders
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
