"use client";

import { MessageCircle, Share2, Camera, Smartphone } from "lucide-react";

export type ChannelType =
  | "whatsapp_evolution"
  | "whatsapp_meta"
  | "facebook"
  | "instagram"
  | string;

export type ChannelIdentityProps = {
  channel: ChannelType;
  customerPhone?: string;
  profileName?: string;
  username?: string;
  providerUserId?: string;
  compact?: boolean;
};

const channelConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; labelAr: string; labelEn: string }> = {
  whatsapp_evolution: { icon: Smartphone, labelAr: "واتساب Evolution", labelEn: "WhatsApp Evolution" },
  whatsapp_meta: { icon: MessageCircle, labelAr: "واتساب Meta", labelEn: "WhatsApp Meta" },
  facebook: { icon: Share2, labelAr: "فيسبوك", labelEn: "Facebook" },
  instagram: { icon: Camera, labelAr: "إنستغرام", labelEn: "Instagram" },
};

function getChannelConfig(channel: ChannelType) {
  const key = String(channel).toLowerCase().replace(/\s+/g, "_");
  return (
    channelConfig[key] ??
    channelConfig[key.replace("whatsapp_", "")] ??
    channelConfig[key.replace("_whatsapp", "")] ??
    channelConfig[key.replace("evolution", "whatsapp_evolution")] ??
    channelConfig[key.replace("meta", "whatsapp_meta")] ?? {
      icon: MessageCircle,
      labelAr: String(channel),
      labelEn: String(channel),
    }
  );
}

export function ChannelIdentity({ channel, customerPhone, profileName, username, providerUserId, compact }: ChannelIdentityProps) {
  const config = getChannelConfig(channel);
  const Icon = config.icon;

  const identifier = customerPhone || profileName || username || providerUserId || "—";

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
        <Icon className="h-3 w-3" />
        {config.labelAr}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{config.labelAr}</p>
        <p className="text-[10px] text-muted-foreground truncate">{identifier}</p>
      </div>
    </div>
  );
}

export function ChannelBadge({ channel }: { channel: ChannelType }) {
  const config = getChannelConfig(channel);
  const Icon = config.icon;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
      <Icon className="h-3 w-3" />
      {config.labelAr}
    </span>
  );
}
