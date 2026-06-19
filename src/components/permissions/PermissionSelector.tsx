"use client";

import { useState, useCallback } from "react";
import { FiChevronDown, FiChevronRight, FiLayers, FiCheck } from "react-icons/fi";
import type { ModuleGroup } from "@/types/role.types";
import { groupPermissionsByModule } from "@/types/role.types";
import type { PermissionSlug } from "@/types/role.types";

interface PermissionSelectorProps {
  permissionSlugs: PermissionSlug[];
  selectedSlugs: Set<string>;
  onSelectionChange: (slugs: Set<string>) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  maxHeight?: string;
}

export default function PermissionSelector({
  permissionSlugs,
  selectedSlugs,
  onSelectionChange,
  searchQuery = "",
  onSearchChange,
  maxHeight = "400px",
}: PermissionSelectorProps) {
  const groupedModules = groupPermissionsByModule(permissionSlugs);

  const filteredModules = searchQuery.trim()
    ? groupedModules
        .map((mod) => ({
          ...mod,
          permissions: mod.permissions.filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.slug.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((mod) => mod.permissions.length > 0)
    : groupedModules;

  const handleToggleSlug = useCallback(
    (slug: string) => {
      const next = new Set(selectedSlugs);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      onSelectionChange(next);
    },
    [selectedSlugs, onSelectionChange],
  );

  const handleSelectAllModule = useCallback(
    (modulePermissions: PermissionSlug[]) => {
      const next = new Set(selectedSlugs);
      for (const p of modulePermissions) next.add(p.slug);
      onSelectionChange(next);
    },
    [selectedSlugs, onSelectionChange],
  );

  const handleDeselectAllModule = useCallback(
    (modulePermissions: PermissionSlug[]) => {
      const next = new Set(selectedSlugs);
      for (const p of modulePermissions) next.delete(p.slug);
      onSelectionChange(next);
    },
    [selectedSlugs, onSelectionChange],
  );

  const totalSelected = selectedSlugs.size;
  const totalAvailable = permissionSlugs.length;

  return (
    <div className="space-y-3">
      {totalAvailable > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            <strong className="text-slate-700">{totalSelected}</strong> of {totalAvailable} selected
          </span>
        </div>
      )}

      <div className="space-y-2 overflow-y-auto" style={{ maxHeight }}>
        {filteredModules.map((mod) => (
          <PermissionModuleGroup
            key={mod.module}
            module={mod}
            selectedSlugs={selectedSlugs}
            onToggleSlug={handleToggleSlug}
            onSelectAll={() => handleSelectAllModule(mod.permissions)}
            onDeselectAll={() => handleDeselectAllModule(mod.permissions)}
          />
        ))}
        {filteredModules.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-400">
              {searchQuery ? "No permissions match your search" : "No permissions available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PermissionModuleGroup({
  module,
  selectedSlugs,
  onToggleSlug,
  onSelectAll,
  onDeselectAll,
}: {
  module: ModuleGroup;
  selectedSlugs: Set<string>;
  onToggleSlug: (slug: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const selectedCount = module.permissions.filter((p) => selectedSlugs.has(p.slug)).length;
  const totalCount = module.permissions.length;
  const allSelected = selectedCount === totalCount;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-3 py-2.5 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
            <FiLayers className="size-3.5" />
          </div>
          <span className="text-sm font-semibold text-slate-700">{module.displayName}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
            {selectedCount}/{totalCount}
          </span>
        </div>
        {expanded ? (
          <FiChevronDown className="size-4 text-slate-400" />
        ) : (
          <FiChevronRight className="size-4 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-3 py-2">
          <div className="flex items-center gap-3 mb-2">
            <button
              type="button"
              onClick={onSelectAll}
              disabled={allSelected}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Select All
            </button>
            <span className="text-xs text-slate-200">|</span>
            <button
              type="button"
              onClick={onDeselectAll}
              disabled={selectedCount === 0}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Deselect All
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {module.permissions.map((perm) => (
              <PermissionCheckbox
                key={perm.slug}
                name={perm.name}
                slug={perm.slug}
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

function PermissionCheckbox({
  name,
  slug,
  selected,
  onToggle,
}: {
  name: string;
  slug: string;
  selected: boolean;
  onToggle: (slug: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(slug)}
      className={`
        inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-all duration-150
        ${
          selected
            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
        }
      `}
    >
      <span
        className={`
          flex size-3 items-center justify-center rounded border transition-colors
          ${selected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white"}
        `}
      >
        {selected && <FiCheck className="size-2 stroke-[3]" />}
      </span>
      {name}
    </button>
  );
}
