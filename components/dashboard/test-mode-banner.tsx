"use client";

import { AlertTriangle } from "lucide-react";

export function TestModeBanner() {
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";
  if (!isTestMode) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-xs font-bold text-white">
      <AlertTriangle className="h-4 w-4" />
      <span>وضع الاختبار مفعل — لا توجد طلبات حقيقية</span>
    </div>
  );
}
