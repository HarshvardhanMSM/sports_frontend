"use client";

import React, { useState, useMemo } from "react";
import { FiUserPlus, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import { PageHeader } from "@/components/common/PageHeader";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useAssignRoles, useRemoveRoles } from "@/hooks/useUsers";
import { useRoles } from "@/hooks/useRoles";
import { useToast } from "@/components/common/Toast/useToast";
import type { User, CreateUserRequest, UpdateUserRequest } from "@/types/user.types";
import { SUPER_ADMIN_ROLE } from "@/types/role.types";
import UserStatsCards from "@/features/users/components/UserStatsCards";
import UserFilters from "@/features/users/components/UserFilters";
import UserTable from "@/features/users/components/UserTable";
import UserFormModal from "@/features/users/components/UserFormModal";
import AssignRolesModal from "@/features/users/components/AssignRolesModal";
import DeleteUserDialog from "@/features/users/components/DeleteUserDialog";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [assignTarget, setAssignTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const toast = useToast();

  const { data, isLoading, error, isRefetching, refetch } = useUsers();
  const { data: rolesData } = useRoles();
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutateAsync: assignRoles, isPending: isAssigning } = useAssignRoles();
  const { mutateAsync: removeRoles, isPending: isRemoving } = useRemoveRoles();

  const raw = (data as unknown as Record<string, unknown>)?.data ?? data;
  const allUsers: User[] = Array.isArray(raw) ? raw : [];
  const allRoles = (rolesData ?? []).filter((r) => r.name !== SUPER_ADMIN_ROLE);

  const filtered = useMemo(() => {
    return allUsers.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch = !search
        || u.name.toLowerCase().includes(q)
        || u.email.toLowerCase().includes(q);
      const matchesFilter = statusFilter === "All"
        || (statusFilter === "active" && u.isActive)
        || (statusFilter === "inactive" && !u.isActive);
      return matchesSearch && matchesFilter;
    });
  }, [allUsers, search, statusFilter]);

  const stats = useMemo(() => ({
    total: allUsers.length,
    active: allUsers.filter((u) => u.isActive).length,
    inactive: allUsers.filter((u) => !u.isActive).length,
  }), [allUsers]);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="User Management"
        title="Admin Users"
        description="Manage administrator accounts, roles, and access permissions."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all"
            >
              <FiRefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Can permission="admin.create">
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm"
              >
                <FiUserPlus className="size-4" />
                Create User
              </button>
            </Can>
          </div>
        }
      />

      {error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load users</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button onClick={() => refetch()} className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all" style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}>
            Retry
          </button>
        </div>
      ) : (
        <>
          <UserStatsCards {...stats} />

          <UserFilters
            search={search}
            onSearchChange={(v) => setSearch(v)}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            total={allUsers.length}
            filtered={filtered.length}
          />

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl" />
              ))}
            </div>
          ) : (
            <UserTable
              users={filtered}
              onEdit={setEditTarget}
              onAssignRoles={setAssignTarget}
              onDelete={setDeleteTarget}
            />
          )}
        </>
      )}

      {showCreate && (
        <UserFormModal
          mode="create"
          roles={allRoles}
          onClose={() => setShowCreate(false)}
          onConfirm={async (d) => {
            try {
              await createUser(d as CreateUserRequest);
              setShowCreate(false);
            } catch { /* onError in useCreateUser handles toast */ }
          }}
          isPending={isCreating}
        />
      )}

      {editTarget && (
        <UserFormModal
          mode="edit"
          user={editTarget}
          roles={allRoles}
          onClose={() => setEditTarget(null)}
          onConfirm={async (d) => {
            try {
              await updateUser({ id: editTarget.id, ...d as UpdateUserRequest });
              setEditTarget(null);
            } catch { /* onError in useUpdateUser handles toast */ }
          }}
          isPending={isUpdating}
        />
      )}

      {assignTarget && (
        <AssignRolesModal
          user={assignTarget}
          allRoles={allRoles}
          onClose={() => setAssignTarget(null)}
          onAssign={async (roleIds) => {
            try {
              await assignRoles({ id: assignTarget.id, roleIds });
              setAssignTarget(null);
            } catch { /* onError in useAssignRoles handles toast */ }
          }}
          onRemove={async (roleIds) => {
            try {
              await removeRoles({ id: assignTarget.id, roleIds });
              setAssignTarget(null);
            } catch { /* onError in useRemoveRoles handles toast */ }
          }}
          isPending={isAssigning || isRemoving}
        />
      )}

      {deleteTarget && (
        <DeleteUserDialog
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            try {
              await deleteUser(deleteTarget.id);
              setDeleteTarget(null);
            } catch { /* onError in useDeleteUser handles toast */ }
          }}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}
