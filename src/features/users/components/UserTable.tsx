"use client";

import React from "react";
import Link from "next/link";
import { FiEye, FiEdit2, FiTrash2, FiUsers, FiShield } from "react-icons/fi";
import type { User } from "@/types/user.types";
import { SUPER_ADMIN_ROLE } from "@/types/role.types";
import { resolveImageUrl } from "@/lib/image";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onAssignRoles: (user: User) => void;
  onDelete: (user: User) => void;
}

const ROLE_COLORS: Record<string, string> = {
  "Super Admin": "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
};

function RoleBadge({ name }: { name: string }) {
  const cls = ROLE_COLORS[name] ?? "bg-slate-50 text-slate-600 ring-1 ring-slate-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls}`}>
      {name}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-200">
      <span className="size-1.5 rounded-full bg-rose-500" />
      Inactive
    </span>
  );
}

export default function UserTable({ users, onEdit, onAssignRoles, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Roles</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
              const isSuperAdmin = user.roles.some((r) => r.name === SUPER_ADMIN_ROLE);
              return (
                <tr key={user.id} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={resolveImageUrl(user.avatar)} alt="" className="size-9 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className="size-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
                          {initials}
                        </div>
                      )}
                      <div>
                        {isSuperAdmin ? (
                          <span className="text-sm font-semibold text-slate-800">
                            {user.name}
                          </span>
                        ) : (
                          <Link href={`/admin-users/${user.id}`} className="text-sm font-semibold text-slate-800 hover:text-indigo-600">
                            {user.name}
                          </Link>
                        )}
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length > 0 ? user.roles.map((r) => (
                        <RoleBadge key={r.id} name={r.name} />
                      )) : <span className="text-xs text-slate-400">—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4"><StatusBadge active={user.isActive} /></td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    {isSuperAdmin ? (
                      <div className="flex justify-end pr-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          <FiShield className="size-3.5 text-slate-400" />
                          System Protected
                        </span>
                      </div>
                    ) : (
                      <div className="flex gap-1 justify-end">
                        <Link
                          href={`/admin-users/${user.id}`}
                          className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          title="View Details"
                        >
                          <FiEye className="size-4" />
                        </Link>
                        <button
                          onClick={() => onEdit(user)}
                          className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          title="Edit"
                        >
                          <FiEdit2 className="size-4" />
                        </button>
                        <button
                          onClick={() => onAssignRoles(user)}
                          className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                          title="Assign Roles"
                        >
                          <FiUsers className="size-4" />
                        </button>
                        <button
                          onClick={() => onDelete(user)}
                          className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          title="Delete"
                        >
                          <FiTrash2 className="size-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <FiUsers className="size-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">No users found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search or filter criteria.</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
