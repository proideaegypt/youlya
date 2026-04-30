import { evolutionClient } from "@/lib/adapters/evolution/evolution-client";

export async function sendWhatsAppReply(
  remoteJid: string,
  text: string,
  instanceName: string,
  storeSlug = "youlya",
): Promise<void> {
  try {
    await evolutionClient.sendText(instanceName, remoteJid, text, storeSlug);
  } catch (error) {
    console.error("sendWhatsAppReply failed", error);
  }
}
