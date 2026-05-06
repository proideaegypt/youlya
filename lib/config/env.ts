import { z } from "zod";

const isTestModeRuntime =
  process.env.TEST_MODE === "true" || process.env.NODE_ENV === "test" || process.env.MOCK_MODE === "true";

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
  NEXT_PUBLIC_APP_URL: z.string().optional(),

  MOCK_MODE: z.string().default("true"),
  TEST_MODE: z.string().default(isTestModeRuntime ? "true" : "false"),
  ALLOW_TEST_MODE: z.string().default("true"),
  OWNER_APPROVES_LIVE_ORDER: z.string().default("false"),
  INTERNAL_API_SECRET: z.string().optional(),

  SUPABASE_URL: z.string().default(isTestModeRuntime ? "mock" : ""),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),

  EVOLUTION_API_URL: z.string().optional(),
  EVOLUTION_API_KEY: z.string().optional(),
  EVOLUTION_MOCK: z.string().default(isTestModeRuntime ? "true" : "false"),

  SHOPIFY_STORE_DOMAIN: z.string().optional(),
  SHOPIFY_ADMIN_API_TOKEN: z.string().optional(),
  SHOPIFY_STORE_URL: z.string().optional(),
  SHOPIFY_ADMIN_API_KEY: z.string().optional(),
  SHOPIFY_ADMIN_ACCESS_TOKEN: z.string().optional(),
  SHOPIFY_API_VERSION: z.string().default("2024-01"),

  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o"),

  SETTINGS_ENCRYPTION_KEY: z.string().optional(),

  SHIPPING_CAIRO_EGP: z.coerce.number().default(70),
  SHIPPING_ALEXANDRIA_EGP: z.coerce.number().default(90),
  FREE_SHIPPING_THRESHOLD_EGP: z.coerce.number().default(1200),
  MAX_CART_ITEMS: z.coerce.number().default(5),
});

type ServerEnv = z.infer<typeof serverSchema>;

function validateProductionRequired(env: ServerEnv) {
  if (env.NODE_ENV !== "production") return;

  const required: Array<keyof ServerEnv> = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_ANON_KEY",
    "INTERNAL_API_SECRET",
    "EVOLUTION_API_URL",
    "EVOLUTION_API_KEY",
    "SHOPIFY_STORE_DOMAIN",
    "SHOPIFY_ADMIN_API_TOKEN",
    "OPENAI_API_KEY",
  ];

  const missing = required.filter((key) => !String(env[key] ?? "").trim() || env[key] === "mock");
  if (missing.length > 0) {
    throw new Error(`Missing required production env vars: ${missing.join(", ")}`);
  }
}

export function getPublicEnv() {
  return publicSchema.parse(process.env);
}

export function getServerEnv() {
  const parsed = serverSchema.parse(process.env);
  validateProductionRequired(parsed);
  return parsed;
}

export function isMockMode() {
  const env = getServerEnv();
  return env.MOCK_MODE === "true" || env.TEST_MODE === "true";
}

export function isOwnerApprovedLiveOrder() {
  const env = getServerEnv();
  return env.OWNER_APPROVES_LIVE_ORDER === "true";
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
