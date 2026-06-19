"use client";

import { FiShield, FiUsers } from "react-icons/fi";
import type { Role } from "@/types/role.types";

interface RoleSidebarProps {
  roles: Role[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const roleColors = [
  { dot: "bg-indigo-500", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  { dot: "bg-rose-500", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  { dot: "bg-cyan-500", bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  { dot: "bg-violet-500", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
];

function getColor(index: number) {
  return roleColors[index % roleColors.length];
}

function getTotalPermissions(role: Role): number {
  const perms = role.permissions;
  if (!Array.isArray(perms)) return 0;
  if (perms.length === 0) return 0;
  // Permission[] format: each entry has an actions array
  if (typeof perms[0] === "object" && "actions" in perms[0]) {
    return (perms as { actions: unknown[] }[]).reduce((s, p) => s + p.actions.length, 0);
  }
  // String[] or PermissionSlug[] format: each entry is one permission
  return perms.length;
}

export default function RoleSidebar({ roles, selectedId, onSelect }: RoleSidebarProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {roles.map((role, idx) => {
        const colors = getColor(idx);
        const isSelected = role.id === selectedId;
        const totalPerms = getTotalPermissions(role);

        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelect(role.id)}
            className={`
              w-full rounded-xl border border-slate-200 p-3.5 text-left transition-all duration-150
              ${
                isSelected
                  ? `${colors.bg} ${colors.border} shadow-sm`
                  : "border-transparent bg-white hover:bg-slate-50 hover:border-slate-200"
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}
              >
                <FiShield className={`size-4.5 ${colors.text}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold truncate ${
                      isSelected ? colors.text : "text-slate-800"
                    }`}
                  >
                    {role.name}
                  </span>
                  {role.isSystemRole && (
                    <span className="shrink-0 rounded bg-slate-200/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      System
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                  <span>{totalPerms} permissions</span>
                  {role.adminCount > 0 && (
                    <span className="flex items-center gap-1">
                      <FiUsers className="size-3" />
                      {role.adminCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`
                  inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider
                  ${totalPerms > 0 ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}
                `}
              >
                {role.isSystemRole ? "System" : "Custom"}
              </span>
              <span className="text-[10px] text-slate-400">
                {new Date(role.createdDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
