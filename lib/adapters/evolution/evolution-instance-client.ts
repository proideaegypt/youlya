import "server-only";

export type EvolutionInstanceInfo = {
  instanceName: string;
  status: string;
  state?: string;
};

export type EvolutionQRResponse = {
  instance: EvolutionInstanceInfo;
  qrcode?: { base64: string };
};

export type EvolutionConnectionState = {
  instance: EvolutionInstanceInfo & { state: string };
};

function getEvolutionConfig() {
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const mock = process.env.EVOLUTION_MOCK === "true";
  return { apiUrl, apiKey, mock };
}

function evolutionHeaders(apiKey: string) {
  return { apikey: apiKey, "content-type": "application/json" };
}

export async function createEvolutionInstance(instanceName: string): Promise<EvolutionInstanceInfo> {
  const { apiUrl, apiKey, mock } = getEvolutionConfig();
  if (mock || !apiUrl || !apiKey) {
    console.log("[MOCK-EVOLUTION] create instance:", instanceName);
    return { instanceName, status: "created" };
  }
  const res = await fetch(`${apiUrl}/instance/create`, {
    method: "POST",
    headers: evolutionHeaders(apiKey),
    body: JSON.stringify({ instanceName }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`evolution_create_failed_${res.status}: ${text}`);
  }
  const data = (await res.json()) as { instance?: EvolutionInstanceInfo };
  return data.instance ?? { instanceName, status: "created" };
}

export async function fetchEvolutionQR(instanceName: string): Promise<EvolutionQRResponse> {
  const { apiUrl, apiKey, mock } = getEvolutionConfig();
  if (mock || !apiUrl || !apiKey) {
    console.log("[MOCK-EVOLUTION] fetch QR:", instanceName);
    return { instance: { instanceName, status: "connecting" }, qrcode: { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" } };
  }
  const res = await fetch(`${apiUrl}/instance/connect/${encodeURIComponent(instanceName)}`, {
    headers: evolutionHeaders(apiKey),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`evolution_qr_failed_${res.status}: ${text}`);
  }
  return (await res.json()) as EvolutionQRResponse;
}

export async function getEvolutionConnectionState(instanceName: string): Promise<EvolutionConnectionState> {
  const { apiUrl, apiKey, mock } = getEvolutionConfig();
  if (mock || !apiUrl || !apiKey) {
    console.log("[MOCK-EVOLUTION] connection state:", instanceName);
    return { instance: { instanceName, status: "connected", state: "open" } };
  }
  const res = await fetch(`${apiUrl}/instance/connectionState/${encodeURIComponent(instanceName)}`, {
    headers: evolutionHeaders(apiKey),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`evolution_state_failed_${res.status}: ${text}`);
  }
  return (await res.json()) as EvolutionConnectionState;
}

export async function logoutEvolutionInstance(instanceName: string): Promise<void> {
  const { apiUrl, apiKey, mock } = getEvolutionConfig();
  if (mock || !apiUrl || !apiKey) {
    console.log("[MOCK-EVOLUTION] logout:", instanceName);
    return;
  }
  const res = await fetch(`${apiUrl}/instance/logout/${encodeURIComponent(instanceName)}`, {
    method: "DELETE",
    headers: evolutionHeaders(apiKey),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`evolution_logout_failed_${res.status}: ${text}`);
  }
}
