type SendMediaInput = { url: string; caption?: string };

export interface EvolutionClient {
  sendText(instanceName: string, remoteJid: string, text: string, storeSlug?: string): Promise<void>;
  sendMedia(instanceName: string, remoteJid: string, url: string, caption?: string, storeSlug?: string): Promise<void>;
}

const RETRIES_MS = [1000, 3000, 10000];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetry(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

async function createFailedEvent(errorCode: string, errorMessage: string, payload: unknown, storeSlug?: string) {
  const appUrl = process.env.APP_INTERNAL_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  if (!appUrl || !secret) return;
  try {
    await fetch(`${appUrl}/api/internal/failed-events`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-internal-secret": secret },
      body: JSON.stringify({
        storeSlug: storeSlug ?? "youlya",
        source: "evolution_client",
        provider: "evolution",
        errorCode,
        errorMessage,
        payload,
        retryCount: 3,
      }),
    });
  } catch {
    // never throw
  }
}

async function sendWithRetry(
  instanceName: string,
  remoteJid: string,
  body: Record<string, unknown>,
  endpoint: string,
  storeSlug?: string,
): Promise<void> {
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const mock = process.env.EVOLUTION_MOCK === "true";
  if (mock || !apiUrl || !apiKey) {
    console.log("[MOCK-EVOLUTION] Would send:", JSON.stringify({ instanceName, remoteJid, ...body }));
    return;
  }

  let lastError = "";
  for (let i = 0; i <= RETRIES_MS.length; i += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const res = await fetch(`${apiUrl}${endpoint}/${instanceName}`, {
        method: "POST",
        headers: { apikey: apiKey, "content-type": "application/json" },
        body: JSON.stringify({ number: remoteJid, ...body }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) return;
      lastError = `HTTP ${res.status}`;
      if (!shouldRetry(res.status) || i === RETRIES_MS.length) break;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error instanceof Error ? error.message : "unknown error";
      if (i === RETRIES_MS.length) break;
    }
    await sleep(RETRIES_MS[i]);
  }

  console.error("evolution send failed", { endpoint, instanceName, remoteJid, lastError });
  await createFailedEvent("EVOLUTION_SEND_FAILED", lastError, { endpoint, instanceName, remoteJid, body }, storeSlug);
}

export const evolutionClient: EvolutionClient = {
  async sendText(instanceName: string, remoteJid: string, text: string, storeSlug?: string): Promise<void> {
    await sendWithRetry(instanceName, remoteJid, { text }, "/message/sendText", storeSlug);
  },
  async sendMedia(
    instanceName: string,
    remoteJid: string,
    url: string,
    caption?: string,
    storeSlug?: string,
  ): Promise<void> {
    const mediaBody: SendMediaInput = { url, caption };
    await sendWithRetry(instanceName, remoteJid, mediaBody, "/message/sendMedia", storeSlug);
  },
};
