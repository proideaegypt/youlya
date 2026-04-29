import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Youlya AI Commerce OS"),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default("ar-EG"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
});

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ENV: z.string().default("local"),
  APP_URL: z.string().default("http://localhost:3000"),
  MOCK_MODE: z.string().default("true"),
  ALLOW_TEST_MODE: z.string().default("true"),
  INTERNAL_API_SECRET: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SHOPIFY_STORE_URL: z.string().optional(),
  SHOPIFY_ADMIN_API_KEY: z.string().optional(),
  SHOPIFY_ADMIN_ACCESS_TOKEN: z.string().optional(),
  EVOLUTION_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  SHIPPING_CAIRO_EGP: z.coerce.number().default(70),
  SHIPPING_ALEXANDRIA_EGP: z.coerce.number().default(90),
  FREE_SHIPPING_THRESHOLD_EGP: z.coerce.number().default(1200),
  MAX_CART_ITEMS: z.coerce.number().default(5),
});

export function getPublicEnv() {
  return publicSchema.parse(process.env);
}

export function getServerEnv() {
  return serverSchema.parse(process.env);
}

export function isMockMode() {
  const env = getServerEnv();
  return env.MOCK_MODE === "true";
}

export function assertInternalSecret(req: Request): boolean {
  const env = getServerEnv();
  if (!env.INTERNAL_API_SECRET) return false;
  const provided =
    req.headers.get("x-internal-secret") ??
    req.headers.get("x-internal-api-secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    null;
  return provided === env.INTERNAL_API_SECRET;
}
