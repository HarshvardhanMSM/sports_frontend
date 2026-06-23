"use client";

import React, { useEffect, useState } from "react";
import { FiLock } from "react-icons/fi";
import { useAuthStore } from "@/store/auth.store";
import { getRoutePermission } from "@/config/route-permissions";
import { usePathname } from "next/navigation";

interface PermissionGuardProps {
  permission?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({
  permission,
  fallback,
  children,
}: PermissionGuardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const pathname = usePathname();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const isPermissionsLoaded = useAuthStore((s) => s.isPermissionsLoaded);

  const requiredSlug = permission ?? getRoutePermission(pathname);

  if (!mounted || !isPermissionsLoaded) {
    return <>{children}</>;
  }

  if (requiredSlug && !hasPermission(requiredSlug)) {
    return fallback ?? (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FiLock className="size-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">
          Access Denied
        </h2>
        <p className="text-sm text-slate-500 max-w-md">
          You don&apos;t have permission to access this page. Please contact
          your administrator if you believe this is a mistake.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
