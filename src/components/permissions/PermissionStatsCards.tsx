"use client";

import { FiKey, FiGrid, FiLayers } from "react-icons/fi";
import type { ModuleGroup } from "@/types/role.types";

interface PermissionStatsCardsProps {
  totalPermissions: number;
  totalModules: number;
  moduleGroups: ModuleGroup[];
}

const MODULE_ICONS: Record<string, React.ReactNode> = {
  product: <FiLayers className="size-5" />,
  order: <FiLayers className="size-5" />,
  user: <FiLayers className="size-5" />,
  inventory: <FiLayers className="size-5" />,
};

const MODULE_COLORS: Record<string, { bg: string; icon: string }> = {
  product:   { bg: "bg-blue-50",   icon: "text-blue-600" },
  order:     { bg: "bg-emerald-50", icon: "text-emerald-600" },
  user:      { bg: "bg-amber-50",  icon: "text-amber-600" },
  inventory: { bg: "bg-violet-50", icon: "text-violet-600" },
};

const FALLBACK_COLORS = [
  { bg: "bg-indigo-50", icon: "text-indigo-600" },
  { bg: "bg-rose-50",  icon: "text-rose-600" },
  { bg: "bg-cyan-50",  icon: "text-cyan-600" },
  { bg: "bg-orange-50",icon: "text-orange-600" },
];

function getColor(idx: number) {
  return FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
}

export default function PermissionStatsCards({
  totalPermissions,
  totalModules,
  moduleGroups,
}: PermissionStatsCardsProps) {
  const topModules = moduleGroups.slice(0, 4);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
          <FiKey className="size-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Permissions</p>
          <p className="text-2xl font-bold text-slate-800">{totalPermissions}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50">
          <FiGrid className="size-6 text-slate-600" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Modules</p>
          <p className="text-2xl font-bold text-slate-800">{totalModules}</p>
        </div>
      </div>

      {topModules.map((mod, idx) => {
        const color = MODULE_COLORS[mod.module] ?? getColor(idx);
        return (
          <div
            key={mod.module}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color.bg}`}>
              <span className={color.icon}>{MODULE_ICONS[mod.module] ?? <FiLayers className="size-5" />}</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{mod.displayName}</p>
              <p className="text-2xl font-bold text-slate-800">{mod.permissions.length}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
