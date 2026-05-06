// Safe DB state checker — no destructive operations
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.log("Missing Supabase env vars");
  process.exit(1);
}

async function check() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/store_shipping_settings?select=store_id&limit=1`, {
    headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
  });
  if (!res.ok) {
    console.log("store_shipping_settings: ERROR", res.status, await res.text());
    return;
  }
  const data = await res.json();
  console.log("store_shipping_settings:", data.length > 0 ? `FOUND (${data.length} rows)` : "EMPTY");

  const zones = await fetch(`${SUPABASE_URL}/rest/v1/shipping_zones?select=id,governorate&limit=3`, {
    headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
  });
  const zonesData = await zones.json();
  console.log("shipping_zones:", zonesData.length > 0 ? `FOUND ${zonesData.length} zones` : "EMPTY");

  const ai = await fetch(`${SUPABASE_URL}/rest/v1/ai_agent_settings?select=store_id&limit=1`, {
    headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
  });
  const aiData = await ai.json();
  console.log("ai_agent_settings:", aiData.length > 0 ? "FOUND" : "EMPTY");

  const roles = await fetch(`${SUPABASE_URL}/rest/v1/store_user_roles?select=user_id,role&limit=3`, {
    headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
  });
  const rolesData = await roles.json();
  console.log("store_user_roles:", rolesData.length > 0 ? `FOUND ${rolesData.length} roles` : "EMPTY");
  if (rolesData.length > 0) {
    rolesData.forEach((r) => console.log(`  - ${r.role}`));
  }

  const profiles = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?select=user_id&limit=1`, {
    headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
  });
  const profilesData = await profiles.json();
  console.log("user_profiles:", profilesData.length > 0 ? "FOUND" : "EMPTY");
}

check().catch(console.error);
