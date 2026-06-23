"use client";

import React from "react";
import { useAuthStore } from "@/store/auth.store";

interface CanProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Can({ permission, fallback, children }: CanProps) {
  const hasPermission = useAuthStore((s) => s.hasPermission);

  if (!hasPermission(permission)) {
    return fallback ?? null;
  }

  return <>{children}</>;
}
