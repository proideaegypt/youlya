"use client";

import { useEffect, useMemo, useState } from "react";

type BuildInfo = {
  appName: string;
  version: string;
  versionName: string | null;
  commit: string;
  branch: string;
  tag: string | null;
  builtAt: string;
  dirty: boolean;
};

function formatBuiltAt(iso: string): string {
  if (!iso) return "unknown";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "unknown";
  return d.toISOString().slice(0, 16).replace("T", " ");
}

export function BuildIdentityFooter() {
  const [info, setInfo] = useState<BuildInfo | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/build-info", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("failed"))))
      .then((data: BuildInfo) => {
        if (active) setInfo(data);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const text = useMemo(() => {
    if (!info) {
      return failed ? "build info unavailable" : "Loading build info...";
    }

    const commit = info.commit === "unknown" ? "unknown" : info.commit;
    const tag = info.tag ? ` · tag ${info.tag}` : "";
    const versionName = info.versionName ? ` ${info.versionName}` : "";
    const dirty = info.dirty ? " · dirty" : "";
    const mode = process.env.NODE_ENV ? ` · ${process.env.NODE_ENV}` : "";

    return `${info.appName} · v${info.version}${versionName} · commit ${commit}${tag} · built ${formatBuiltAt(info.builtAt)}${dirty}${mode}`;
  }, [failed, info]);

  return <p className="text-center text-xs text-zinc-500">{text}</p>;
}
