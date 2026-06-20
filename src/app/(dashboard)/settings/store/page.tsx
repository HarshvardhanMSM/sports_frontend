"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StoreSettingsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/settings/general");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-sm text-slate-500 animate-pulse">Redirecting to General Settings...</div>
    </div>
  );
}
