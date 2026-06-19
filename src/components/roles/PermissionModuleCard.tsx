"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronRight, FiLayers } from "react-icons/fi";
import type { ModuleGroup } from "@/types/role.types";
import PermissionChip from "./PermissionChip";

interface PermissionModuleCardProps {
  module: ModuleGroup;
  selectedSlugs: Set<string>;
  onToggleSlug: (slug: string) => void;
}

export default function PermissionModuleCard({
  module,
  selectedSlugs,
  onToggleSlug,
}: PermissionModuleCardProps) {
  const [expanded, setExpanded] = useState(true);

  const modulePerms = module.permissions;
  const selectedCount = modulePerms.filter((p) => selectedSlugs.has(p.slug)).length;
  const totalCount = modulePerms.length;
  const allSelected = selectedCount === totalCount;

  const handleSelectAll = () => {
    for (const p of modulePerms) {
      if (!selectedSlugs.has(p.slug)) onToggleSlug(p.slug);
    }
  };

  const handleDeselectAll = () => {
    for (const p of modulePerms) {
      if (selectedSlugs.has(p.slug)) onToggleSlug(p.slug);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <FiLayers className="size-4" />
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold text-slate-800">
              {module.displayName}
            </span>
            <p className="text-xs text-slate-400">
              {selectedCount}/{totalCount} permissions selected
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">
            {totalCount} perm{totalCount !== 1 ? "s" : ""}
          </span>
          {expanded ? (
            <FiChevronDown className="size-4 text-slate-400" />
          ) : (
            <FiChevronRight className="size-4 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={handleSelectAll}
              disabled={allSelected}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Select All
            </button>
            <span className="text-xs text-slate-200">|</span>
            <button
              type="button"
              onClick={handleDeselectAll}
              disabled={selectedCount === 0}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Deselect All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {modulePerms.map((perm) => (
              <PermissionChip
                key={perm.slug}
                slug={perm.slug}
                name={perm.name}
                selected={selectedSlugs.has(perm.slug)}
                onToggle={onToggleSlug}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
