"use client";

import Image from "next/image";
import { useState } from "react";

type YoulyaLogoProps = {
  className?: string;
  compact?: boolean;
  preferImage?: boolean;
};

export function YoulyaLogo({ className = "", compact = false, preferImage = true }: YoulyaLogoProps) {
  const [failed, setFailed] = useState(false);
  const alt = "YOULYA HOME WEAR logo";

  if (failed || !preferImage) {
    return (
      <div className={`inline-flex items-center justify-center rounded-lg border border-border bg-card ${className}`} aria-label={alt}>
        <span className="text-xs font-extrabold tracking-[0.2em] text-foreground">YOULYA</span>
      </div>
    );
  }

  return (
    <div className={`relative ${compact ? "h-8 w-8" : "h-10 w-[120px]"} ${className}`} aria-label={alt}>
      <Image
        src="/brand/youlya-logo-light.jpeg"
        alt={alt}
        fill
        className="rounded-lg object-contain dark:hidden"
        onError={() => setFailed(true)}
        priority
        unoptimized
      />
      <Image
        src="/brand/youlya-logo-dark.jpeg"
        alt={alt}
        fill
        className="rounded-lg object-contain hidden dark:block"
        onError={() => setFailed(true)}
        priority
        unoptimized
      />
    </div>
  );
}
