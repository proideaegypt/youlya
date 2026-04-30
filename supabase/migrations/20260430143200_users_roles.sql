CREATE TABLE IF NOT EXISTS public.users_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (store_id, user_id)
);

ALTER TABLE public.users_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_roles_service_role_all ON public.users_roles;
CREATE POLICY users_roles_service_role_all
ON public.users_roles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
