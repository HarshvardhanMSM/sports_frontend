"use client";

import React, { useState, useMemo } from "react";
import { FiUserPlus, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useAssignRoles, useRemoveRoles } from "@/hooks/useUsers";
import { useRoles } from "@/hooks/useRoles";
import type { User, CreateUserRequest, UpdateUserRequest } from "@/types/user.types";
import UserStatsCards from "@/features/users/components/UserStatsCards";
import UserFilters from "@/features/users/components/UserFilters";
import UserTable from "@/features/users/components/UserTable";
import UserFormModal from "@/features/users/components/UserFormModal";
import AssignRolesModal from "@/features/users/components/AssignRolesModal";
import DeleteUserDialog from "@/features/users/components/DeleteUserDialog";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [assignTarget, setAssignTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const { data, isLoading, error, isRefetching, refetch } = useUsers();
  const { data: rolesData } = useRoles();
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutateAsync: assignRoles, isPending: isAssigning } = useAssignRoles();
  const { mutateAsync: removeRoles, isPending: isRemoving } = useRemoveRoles();

  const raw = (data as unknown as Record<string, unknown>)?.data ?? data;
  const allUsers: User[] = Array.isArray(raw) ? raw : [];
  const allRoles = rolesData ?? [];

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

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-[60] rounded-xl px-5 py-3 shadow-xl text-sm font-semibold text-white ${
          toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">User Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Users</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage administrator accounts, roles, and access permissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            <FiRefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm"
          >
            <FiUserPlus className="size-4" />
            Create User
          </button>
        </div>
      </div>

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

      {/* Create Modal */}
      {showCreate && (
        <UserFormModal
          mode="create"
          roles={allRoles}
          onClose={() => setShowCreate(false)}
          onConfirm={async (d) => {
            try {
              await createUser(d as CreateUserRequest);
              showToast("success", "User created successfully.");
              setShowCreate(false);
            } catch { showToast("error", "Failed to create user."); }
          }}
          isPending={isCreating}
        />
      )}

      {/* Edit Modal */}
      {editTarget && (
        <UserFormModal
          mode="edit"
          user={editTarget}
          roles={allRoles}
          onClose={() => setEditTarget(null)}
          onConfirm={async (d) => {
            try {
              await updateUser({ id: editTarget.id, ...d as UpdateUserRequest });
              showToast("success", "User updated successfully.");
              setEditTarget(null);
            } catch { showToast("error", "Failed to update user."); }
          }}
          isPending={isUpdating}
        />
      )}

      {/* Assign Roles Modal */}
      {assignTarget && (
        <AssignRolesModal
          user={assignTarget}
          allRoles={allRoles}
          onClose={() => setAssignTarget(null)}
          onAssign={async (roleIds) => {
            try {
              await assignRoles({ id: assignTarget.id, roleIds });
              showToast("success", "Roles assigned.");
              setAssignTarget(null);
            } catch { showToast("error", "Failed to assign roles."); }
          }}
          onRemove={async (roleIds) => {
            try {
              await removeRoles({ id: assignTarget.id, roleIds });
              showToast("success", "Roles removed.");
              setAssignTarget(null);
            } catch { showToast("error", "Failed to remove roles."); }
          }}
          isPending={isAssigning || isRemoving}
        />
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <DeleteUserDialog
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            try {
              await deleteUser(deleteTarget.id);
              showToast("success", "User deleted.");
              setDeleteTarget(null);
            } catch { showToast("error", "Failed to delete user."); }
          }}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}
