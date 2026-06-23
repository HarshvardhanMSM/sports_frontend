"use client";

import React from "react";
import { useProfile } from "@/hooks/useProfile";

export function ProfileLoader({ children }: { children: React.ReactNode }) {
  useProfile();
  return <>{children}</>;
}
