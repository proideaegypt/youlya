import { evolutionClient } from "@/lib/adapters/evolution/evolution-client";

export async function sendWhatsAppReply(remoteJid: string, text: string, instanceName: string): Promise<void> {
  try {
    await evolutionClient.sendText(instanceName, remoteJid, text);
  } catch (error) {
    console.error("sendWhatsAppReply failed", error);
  }
}
