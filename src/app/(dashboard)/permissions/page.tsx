"use client";

import { useState } from "react";
import { FiSearch, FiPlus, FiTrash2, FiKey } from "react-icons/fi";
import { useAllPermissions, useCreatePermission, useDeletePermission } from "@/hooks/usePermissions";
import PermissionFormModal from "@/components/permissions/PermissionFormModal";
import DeletePermissionDialog from "@/components/permissions/DeletePermissionDialog";
import type { PermissionSlug } from "@/types/role.types";
import type { CreatePermissionPayload } from "@/services/permission.service";

export default function PermissionsPage() {
  const { data: permissions, isLoading, error } = useAllPermissions();
  const { mutateAsync: createPermission, isPending: isCreating } = useCreatePermission();
  const { mutateAsync: deletePermission, isPending: isDeleting } = useDeletePermission();

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PermissionSlug | null>(null);

  const filtered = (permissions ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.module?.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = filtered.reduce<Record<string, PermissionSlug[]>>((acc, p) => {
    const mod = p.module ?? "general";
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(p);
    return acc;
  }, {});

  const totalModules = Object.keys(grouped).length;
  const totalPermissions = permissions?.length ?? 0;

  const handleCreateSubmit = async (data: { name: string; slug: string; module: string }) => {
    await createPermission(data as CreatePermissionPayload);
    setShowCreate(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deletePermission(deleteTarget.slug);
    setDeleteTarget(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Permissions</h1>
          <p className="text-sm text-slate-500 mt-1">Manage permission slugs across all modules</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <FiPlus className="size-4" />
          Create Permission
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Permissions</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalPermissions}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Modules</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalModules}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filtered</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{filtered.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, slug, or module..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-20">
          <div className="mx-auto mb-3 size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          <p className="text-sm text-slate-500">Loading permissions...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Failed to load permissions. Please try again.
        </div>
      )}

      {/* Module Groups */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {Object.entries(grouped).map(([module, perms]) => (
            <div key={module} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
                <div className="flex items-center gap-2">
                  <FiKey className="size-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">{module}</span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {perms.length}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {perms.map((p) => (
                  <div key={p.slug} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{p.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600">
                        {p.module}
                      </span>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <FiTrash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && !isLoading && (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <FiKey className="mx-auto mb-3 size-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No permissions found</p>
              <p className="text-xs text-slate-400 mt-1">
                {search ? "Try a different search term" : "Create your first permission to get started"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <PermissionFormModal
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreateSubmit}
          isPending={isCreating}
        />
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <DeletePermissionDialog
          permission={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}
