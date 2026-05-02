"use client";

import Image from "next/image";
import { useState } from "react";
import { useTheme } from "next-themes";

type YoulyaLogoProps = {
  className?: string;
  compact?: boolean;
  preferImage?: boolean;
};

export function YoulyaLogo({ className = "", compact = false, preferImage = true }: YoulyaLogoProps) {
  const { resolvedTheme } = useTheme();
  const [failed, setFailed] = useState(false);
  const isDark = resolvedTheme !== "light";
  const src = isDark ? "/brand/youlya-logo-dark.jpeg" : "/brand/youlya-logo-light.jpeg";
  const alt = "YOULYA HOME WEAR logo";

  if (failed || !preferImage) {
    return (
      <div className={`inline-flex items-center justify-center rounded-lg border border-border bg-card ${className}`} aria-label={alt}>
        <span className="text-xs font-extrabold tracking-[0.2em] text-foreground">YOULYA</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={compact ? 32 : 120}
      height={compact ? 32 : 40}
      className={`rounded-lg object-contain ${className}`}
      onError={() => setFailed(true)}
      priority
      unoptimized
    />
  );
}
