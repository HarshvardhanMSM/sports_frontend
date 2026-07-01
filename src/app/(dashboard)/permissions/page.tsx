"use client";

import { useState, useMemo } from "react";
import { FiSearch, FiPlus, FiGrid, FiList } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import { useAllPermissions, useCreatePermission, useUpdatePermission, useDeletePermission } from "@/hooks/usePermissions";
import PermissionFormModal from "@/components/permissions/PermissionFormModal";
import DeletePermissionDialog from "@/components/permissions/DeletePermissionDialog";
import PermissionStatsCards from "@/components/permissions/PermissionStatsCards";
import PermissionTable from "@/components/permissions/PermissionTable";
import type { PermissionSlug } from "@/types/role.types";
import { groupPermissionsByModule } from "@/types/role.types";
import type { CreatePermissionPayload } from "@/services/permission.service";

export default function PermissionsPage() {
  const { data: permissions, isLoading, error } = useAllPermissions();
  const { mutateAsync: createPermission, isPending: isCreating } = useCreatePermission();
  const { mutateAsync: updatePermission, isPending: isUpdating } = useUpdatePermission();
  const { mutateAsync: deletePermission, isPending: isDeleting } = useDeletePermission();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState<PermissionSlug | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PermissionSlug | null>(null);
  const [viewMode, setViewMode] = useState<"grouped" | "table">("grouped");

  
  const permissionsList = useMemo(() => {
    return Array.isArray(permissions)
      ? permissions
      : (permissions as any)?.permissions && Array.isArray((permissions as any).permissions)
      ? (permissions as any).permissions
      : (permissions as any)?.data && Array.isArray((permissions as any).data)
      ? (permissions as any).data
      : (permissions as any)?.items && Array.isArray((permissions as any).items)
      ? (permissions as any).items
      : [];
  }, [permissions]);

  const filtered = useMemo(
    () => permissionsList.filter(
      (p: any) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()) ||
        p.module?.toLowerCase().includes(search.toLowerCase()),
    ),
    [permissionsList, search],
  );

  const moduleGroups = useMemo(() => groupPermissionsByModule(permissionsList), [permissionsList]);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return moduleGroups;
    return moduleGroups
      .map((mod) => ({
        ...mod,
        permissions: mod.permissions.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.slug.toLowerCase().includes(search.toLowerCase()),
        ),
      }))
      .filter((mod) => mod.permissions.length > 0);
  }, [moduleGroups, search]);

  const totalModules = moduleGroups.length;
  const totalPermissions = (permissions as any)?.totalPermissions ?? permissionsList.length;

  const handleCreateSubmit = async (data: { name: string; slug: string; module: string }) => {
    await createPermission(data as CreatePermissionPayload);
    setShowForm(false);
  };

  const handleEditSubmit = async (data: { name: string; slug: string; module: string }) => {
    if (!editingPermission) return;
    await updatePermission({ id: editingPermission.id, data: data as CreatePermissionPayload });
    setEditingPermission(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deletePermission(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Permissions</h1>
          <p className="text-sm text-slate-500 mt-1">Manage permission slugs across all modules</p>
        </div>
        <Can permission="permissions.manage">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <FiPlus className="size-4" />
            Create Permission
          </button>
        </Can>
      </div>

      {!isLoading && !error && (
        <div className="mb-6">
          <PermissionStatsCards
            totalPermissions={totalPermissions}
            totalModules={totalModules}
            moduleGroups={moduleGroups}
          />
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug, or module..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
          <button
            onClick={() => setViewMode("grouped")}
            className={`rounded-md p-2 transition-colors ${viewMode === "grouped" ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
          >
            <FiGrid className="size-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-md p-2 transition-colors ${viewMode === "table" ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
          >
            <FiList className="size-4" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-20">
          <div className="mx-auto mb-3 size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          <p className="text-sm text-slate-500">Loading permissions...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Failed to load permissions. Please try again.
        </div>
      )}

      {!isLoading && !error && viewMode === "grouped" && (
        <div className="space-y-4">
          {filteredGroups.map((mod) => (
            <div key={mod.module} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">{mod.displayName}</span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {mod.permissions.length}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {mod.permissions.map((p) => (
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
                        onClick={() => setEditingPermission(p)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <span className="text-xs font-medium">Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <span className="text-xs font-medium text-red-400 hover:text-red-500">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-slate-600">No permissions found</p>
              <p className="text-xs text-slate-400 mt-1">
                {search ? "Try a different search term" : "Create your first permission to get started"}
              </p>
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && viewMode === "table" && (
        <PermissionTable
          permissions={filtered}
          onEdit={(p) => setEditingPermission(p)}
          onDelete={(p) => setDeleteTarget(p)}
        />
      )}

      {showForm && (
        <PermissionFormModal
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateSubmit}
          isPending={isCreating}
        />
      )}

      {editingPermission && (
        <PermissionFormModal
          permission={editingPermission}
          onClose={() => setEditingPermission(null)}
          onSubmit={handleEditSubmit}
          isPending={isUpdating}
        />
      )}

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
