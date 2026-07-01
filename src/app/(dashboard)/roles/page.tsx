"use client";

import { useState, useMemo, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiShield,
  FiUsers,
  FiPlus,
  FiSearch,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiSave,
} from "react-icons/fi";
import { Can } from "@/components/common/Can";
import { usePermissions } from "@/hooks/usePermissions";
import { useRoles, useCreateRole, useDeleteRole } from "@/hooks/useRoles";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { RoleService, roleKeys } from "@/services/role.service";
import type {
  Permission,
  PermissionSlug,
  Role,
  UpdateRoleRequest,
} from "@/types/role.types";
import {
  groupPermissionsByModule,
  permissionsToSlugs,
  slugsToPermissions,
  SUPER_ADMIN_ROLE,
} from "@/types/role.types";
import RoleSidebar from "@/components/roles/RoleSidebar";
import PermissionModuleCard from "@/components/roles/PermissionModuleCard";
import RoleFormModal from "@/components/roles/RoleFormModal";
import RoleDetailsDrawer from "@/components/roles/RoleDetailsDrawer";

// ─── Helpers ──────────────────────────────────────────────────────────

/** Normalize API permissions to Permission[] format regardless of what the API returns. */
function normalizePermissions(perms: unknown): Permission[] {
  if (!Array.isArray(perms)) return [];
  if (perms.length === 0) return [];
  // Already Permission[] format: [{ module, actions }]
  if (typeof perms[0] === "object" && perms[0] !== null && "actions" in perms[0]) {
    return perms as Permission[];
  }
  // String slug format: ["product.create", "product.view"]
  if (typeof perms[0] === "string") {
    return slugsToPermissions(perms as string[]);
  }
  // PermissionSlug format: [{ slug: "product.create", ... }]
  if (typeof perms[0] === "object" && perms[0] !== null && "slug" in perms[0]) {
    return slugsToPermissions((perms as { slug: string }[]).map((p) => p.slug));
  }
  return [];
}

function roleToSlugSet(role: Role): Set<string> {
  return new Set(permissionsToSlugs(role.permissions));
}

// ─── Loading Skeleton ─────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl" />
        ))}
      </div>
      <div className="flex gap-6">
        <div className="w-80 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl" />
          ))}
        </div>
        <div className="flex-1 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────

export default function RolesPage() {
  // ── Data ──────────────────────────────────────────────────────────
  const { data: rolesData, isPending: rolesPending } = useRoles();
  const { data: permissionSlugsRaw, isPending: permissionsPending } = usePermissions();
  const qc = useQueryClient();
  const { mutateAsync: createRole, isPending: isCreating } = useCreateRole();
  const { mutateAsync: deleteRole, isPending: isDeleting } = useDeleteRole();

  const { mutateAsync: updateRole, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) =>
      RoleService.updateRole(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: roleKeys.list() });
      qc.invalidateQueries({ queryKey: roleKeys.detail(id) });
    },
  });

  // ── Derived Data ──────────────────────────────────────────────────
  const rolesRaw: Role[] = Array.isArray(rolesData)
    ? rolesData
    : (rolesData as any)?.roles && Array.isArray((rolesData as any).roles)
    ? (rolesData as any).roles
    : (rolesData as any)?.data && Array.isArray((rolesData as any).data)
    ? (rolesData as any).data
    : (rolesData as any)?.items && Array.isArray((rolesData as any).items)
    ? (rolesData as any).items
    : [];
  const roles = useMemo(
    () => rolesRaw
      .filter((r) => r.name !== SUPER_ADMIN_ROLE)
      .map((r) => ({ ...r, permissions: normalizePermissions(r.permissions) })),
    [rolesRaw],
  );
  const permissionSlugs: PermissionSlug[] = Array.isArray(permissionSlugsRaw)
    ? permissionSlugsRaw
    : (permissionSlugsRaw as any)?.permissions && Array.isArray((permissionSlugsRaw as any).permissions)
    ? (permissionSlugsRaw as any).permissions
    : (permissionSlugsRaw as any)?.data && Array.isArray((permissionSlugsRaw as any).data)
    ? (permissionSlugsRaw as any).data
    : (permissionSlugsRaw as any)?.items && Array.isArray((permissionSlugsRaw as any).items)
    ? (permissionSlugsRaw as any).items
    : [];

  // ── Local State ───────────────────────────────────────────────────
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [originalSlugs, setOriginalSlugs] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [drawerRole, setDrawerRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  // ── Fuzzy Searches ────────────────────────────────────────────────
  const { query: roleSearchQuery, setQuery: setRoleSearchQuery, results: filteredRoles } = useFuzzySearch(roles, {
    keys: ["name", "description"],
    isServerSide: false,
  });

  const { query: permissionSearchQuery, setQuery: setPermissionSearchQuery, results: filteredPermissionSlugs } = useFuzzySearch(permissionSlugs, {
    keys: ["name", "slug", "module"],
    isServerSide: false,
  });

  // ── Computed ──────────────────────────────────────────────────────
  const selectedRole = roles.find((r) => r.id === selectedRoleId) ?? null;
  const isDirty =
    selectedSlugs.size !== originalSlugs.size ||
    !Array.from(selectedSlugs).every((s) => originalSlugs.has(s));

  const totalSystemRoles = roles.filter((r) => r.isSystemRole).length;
  const totalCustomRoles = roles.filter((r) => !r.isSystemRole).length;

  const filteredModules = useMemo(
    () => groupPermissionsByModule(filteredPermissionSlugs),
    [filteredPermissionSlugs],
  );

  // ── Handlers ──────────────────────────────────────────────────────

  const handleSelectRole = useCallback(
    (id: string) => {
      const role = roles.find((r) => r.id === id);
      if (!role) return;
      setSelectedRoleId(id);
      const slugs = roleToSlugSet(role);
      setSelectedSlugs(new Set(slugs));
      setOriginalSlugs(new Set(slugs));
    },
    [roles],
  );

  const handleToggleSlug = useCallback((slug: string) => {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const all = new Set(permissionSlugs.map((p) => p.slug));
    setSelectedSlugs(all);
  }, [permissionSlugs]);

  const handleDeselectAll = useCallback(() => {
    setSelectedSlugs(new Set());
  }, []);

  const handleReset = useCallback(() => {
    setSelectedSlugs(new Set(originalSlugs));
  }, [originalSlugs]);

  const handleSaveChanges = useCallback(async () => {
    if (!selectedRole) return;
    const permissionSlugs = Array.from(selectedSlugs);
    await updateRole({ id: selectedRole.id, data: { permissionSlugs } });
    setOriginalSlugs(new Set(selectedSlugs));
  }, [selectedRole, selectedSlugs, updateRole]);

  const handleCreate = useCallback(
    async (name: string, slug: string, description: string, permissionSlugs: string[]) => {
      await createRole({ name, slug, description, permissionSlugs: permissionSlugs.length > 0 ? permissionSlugs : undefined });
      setShowCreate(false);
    },
    [createRole],
  );

  const handleEdit = useCallback(
    async (name: string, slug: string, description: string, permissionSlugs: string[]) => {
      if (!editingRole) return;
      await updateRole({
        id: editingRole.id,
        data: { name, slug, description, permissionSlugs },
      });
      setEditingRole(null);
    },
    [editingRole, updateRole],
  );

  const handleDelete = useCallback(async () => {
    if (!deletingRole) return;
    await deleteRole(deletingRole.id);
    if (selectedRoleId === deletingRole.id) {
      setSelectedRoleId(null);
      setSelectedSlugs(new Set());
      setOriginalSlugs(new Set());
    }
    setDeletingRole(null);
  }, [deletingRole, deleteRole, selectedRoleId]);

  const handleDuplicate = useCallback(() => {
    setDrawerRole(null);
    setShowCreate(true);
  }, []);

  // ── Render ────────────────────────────────────────────────────────

  if (rolesPending || permissionsPending) return <LoadingSkeleton />;

  return (
    <div className="space-y-6 font-sans">
      {/* ═══ Header ═══════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Roles & Permissions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage role-based access control for your admin team. Define roles and assign granular permissions.
          </p>
        </div>
        <Can permission="roles.manage">
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md self-start sm:self-auto"
          >
            <FiPlus className="size-4" />
            Create Role
          </button>
        </Can>
      </div>

      {/* ═══ Stats Grid ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<FiShield className="size-5" />}
          label="Total Roles"
          value={roles.length}
          sub="All defined roles"
          color="indigo"
        />
        <StatCard
          icon={<FiCheckCircle className="size-5" />}
          label="Active Roles"
          value={roles.length}
          sub="In use by admins"
          color="emerald"
        />
        <StatCard
          icon={<FiAlertCircle className="size-5" />}
          label="System Roles"
          value={totalSystemRoles}
          sub="Protected roles"
          color="amber"
        />
        <StatCard
          icon={<FiUsers className="size-5" />}
          label="Custom Roles"
          value={totalCustomRoles}
          sub="User-defined roles"
          color="blue"
        />
      </div>

      {/* ═══ Main Area ═══════════════════════════════════════════════ */}
      <div className="flex flex-col gap-6 lg:flex-row lg:h-[calc(100vh-280px)] lg:min-h-[600px]">
        {/* ── Left Panel: Roles List ──────────────────────────────── */}
        <div className="w-full shrink-0 lg:w-80 lg:h-full lg:flex lg:flex-col">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:flex lg:flex-col lg:h-full lg:overflow-hidden">
            <div className="border-b border-slate-100 px-4 py-3 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-700">All Roles</h2>
                <span className="text-xs font-medium text-slate-400">
                  {filteredRoles.length} / {roles.length} total
                </span>
              </div>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={roleSearchQuery}
                  onChange={(e) => setRoleSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs outline-none focus:border-indigo-400 focus:bg-white focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-400 transition-colors"
                />
              </div>
            </div>
            <div className="p-2 overflow-y-auto lg:flex-1 lg:max-h-none max-h-[580px]">
              {filteredRoles.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No matching roles found
                </p>
              ) : (
                <RoleSidebar
                  roles={filteredRoles}
                  selectedId={selectedRoleId}
                  onSelect={handleSelectRole}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Right Panel: Permission Management ─────────────────── */}
        <div className="flex-1 min-w-0 lg:h-full lg:flex lg:flex-col">
          {!selectedRole ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 px-6 lg:h-full">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-50 mb-4">
                <FiShield className="size-8 text-slate-300" />
              </div>
              <h3 className="text-base font-semibold text-slate-600 mb-1">
                Select a role to manage permissions
              </h3>
              <p className="text-sm text-slate-400 text-center max-w-sm">
                Choose a role from the left panel to view and edit its
                permissions, or create a new role.
              </p>
            </div>
          ) : (
            <div className="space-y-4 lg:space-y-0 lg:flex-1 lg:flex lg:flex-col lg:h-full lg:overflow-hidden">
              {/* Selected Role Header */}
              <div className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:mb-4 shrink-0">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FiShield className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-800">
                        {selectedRole.name}
                      </h2>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${selectedRole.isSystemRole
                            ? "bg-slate-100 text-slate-500"
                            : "bg-indigo-50 text-indigo-700"
                          }`}
                      >
                        {selectedRole.isSystemRole ? "System" : "Custom"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedRole.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerRole(selectedRole)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Details
                </button>
              </div>

              {/* Global Actions & Search */}
              <div className="flex flex-wrap items-center gap-3 lg:mb-4 shrink-0">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Select All Permissions
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Deselect All
                </button>
                <div className="relative ml-auto">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={permissionSearchQuery}
                    onChange={(e) => setPermissionSearchQuery(e.target.value)}
                    className="w-56 rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-400 transition-colors"
                  />
                </div>
              </div>

              {/* Unsaved changes indicator */}
              {isDirty && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 lg:mb-4 shrink-0">
                  <FiAlertCircle className="size-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-medium text-amber-700">
                    You have unsaved changes
                  </span>
                </div>
              )}

              {/* Permission Module Cards */}
              <div className="space-y-3 lg:flex-1 lg:overflow-y-auto pr-1 lg:mb-4">
                {filteredModules.map((mod) => (
                  <PermissionModuleCard
                    key={mod.module}
                    module={mod}
                    selectedSlugs={selectedSlugs}
                    onToggleSlug={handleToggleSlug}
                  />
                ))}
                {filteredModules.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-12">
                    <p className="text-sm text-slate-400">
                      {permissionSearchQuery
                        ? "No permissions match your search"
                        : "No permissions available"}
                    </p>
                  </div>
                )}
              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-lg p-4 mt-4 lg:mt-0 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">
                      <strong className="text-slate-800">
                        {selectedSlugs.size}
                      </strong>{" "}
                      permission{selectedSlugs.size !== 1 ? "s" : ""} selected
                    </span>
                    {isDirty && (
                      <span className="text-xs text-amber-600 font-medium">
                        Unsaved changes
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={!isDirty}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiRefreshCw className="size-3.5" />
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      disabled={!isDirty || isUpdating}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <FiSave className="size-3.5" />
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Modals ═══════════════════════════════════════════════════ */}

      {/* Create / Edit Modal */}
      {(showCreate || editingRole) && (
        <RoleFormModal
          role={editingRole}
          permissionSlugs={permissionSlugs}
          allRoles={roles}
          onClose={() => {
            setShowCreate(false);
            setEditingRole(null);
          }}
          onSubmit={showCreate ? handleCreate : handleEdit}
          isPending={isCreating || isUpdating}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setDeletingRole(null)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Delete Role</h2>
              <button
                onClick={() => setDeletingRole(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <FiX className="size-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Are you sure you want to delete <strong>{deletingRole.name}</strong>?
              {deletingRole.adminCount > 0 && (
                <span className="block mt-2 text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                  {deletingRole.adminCount} admin(s) are assigned this role and will need reassignment.
                </span>
              )}
            </p>
            {deletingRole.isSystemRole && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
                System roles cannot be deleted.
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingRole(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletingRole.isSystemRole || isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Details Drawer */}
      {drawerRole && (
        <RoleDetailsDrawer
          role={drawerRole}
          onClose={() => setDrawerRole(null)}
          onEdit={(role) => {
            setDrawerRole(null);
            setEditingRole(role);
          }}
          onDuplicate={handleDuplicate}
          onDelete={(role) => {
            setDrawerRole(null);
            setDeletingRole(role);
          }}
        />
      )}
    </div>
  );
}

// ─── Stat Card Sub-component ───────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  color: "indigo" | "emerald" | "amber" | "blue";
}) {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${colorMap[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-none mb-1">
          {value}
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}
