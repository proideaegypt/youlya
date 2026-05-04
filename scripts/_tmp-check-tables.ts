import { createClient } from '@supabase/supabase-js';
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.log('DB not configured'); process.exit(0); }
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const tables = ['order_items', 'conversations', 'conversation_state', 'ai_tool_calls', 'human_handoffs', 'failed_events', 'processed_messages', 'last_product_recommendations'];

async function main() {
  for (const table of tables) {
    try {
      const { count, error } = await client.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(table + ': ERROR - ' + error.message);
      } else {
        console.log(table + ': count=' + (count ?? 0));
      }
    } catch (e) {
      console.log(table + ': EXCEPTION');
    }
  }
}
main();
