alter table public.orders ENABLE ROW LEVEL SECURITY;

drop policy if exists orders_store_isolation on public.orders;
create policy orders_store_isolation
on public.orders
for all
using (store_id = (auth.jwt() ->> 'store_id')::uuid)
with check (store_id = (auth.jwt() ->> 'store_id')::uuid);

