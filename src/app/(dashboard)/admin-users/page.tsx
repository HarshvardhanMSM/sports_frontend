"use client";

import React, { useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiUserPlus,
  FiSearch,
  FiEdit2,
  FiKey,
  FiTrash2,
} from "react-icons/fi";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: "Active" | "Inactive";
  avatar: string;
}

const adminUsers: AdminUser[] = [
  {
    id: "adm-1",
    name: "Super Admin",
    email: "superadmin@sportswear.com",
    role: "Super Admin",
    lastLogin: "2026-06-15 09:23",
    status: "Active",
    avatar: "SA",
  },
  {
    id: "adm-2",
    name: "Ahmed Khan",
    email: "ahmed.khan@sportswear.com",
    role: "Store Manager",
    lastLogin: "2026-06-15 08:45",
    status: "Active",
    avatar: "AK",
  },
  {
    id: "adm-3",
    name: "Sara Malik",
    email: "sara.malik@sportswear.com",
    role: "Inventory Manager",
    lastLogin: "2026-06-14 16:30",
    status: "Active",
    avatar: "SM",
  },
  {
    id: "adm-4",
    name: "Raza Ali",
    email: "raza.ali@sportswear.com",
    role: "Order Manager",
    lastLogin: "2026-06-14 14:00",
    status: "Active",
    avatar: "RA",
  },
  {
    id: "adm-5",
    name: "Marketing Admin",
    email: "marketing@sportswear.com",
    role: "Marketing Manager",
    lastLogin: "2026-06-13 11:20",
    status: "Active",
    avatar: "MA",
  },
  {
    id: "adm-6",
    name: "Support Lead",
    email: "support@sportswear.com",
    role: "Support Agent",
    lastLogin: "2026-06-15 07:55",
    status: "Active",
    avatar: "SL",
  },
  {
    id: "adm-7",
    name: "Content Editor",
    email: "content@sportswear.com",
    role: "Content Editor",
    lastLogin: "2026-06-12 09:00",
    status: "Active",
    avatar: "CE",
  },
  {
    id: "adm-8",
    name: "Old Admin",
    email: "old.admin@sportswear.com",
    role: "Store Manager",
    lastLogin: "2026-03-01 15:00",
    status: "Inactive",
    avatar: "OA",
  },
];

const roleBadgeClass: Record<string, string> = {
  "Super Admin":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700",
  "Store Manager":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700",
  "Inventory Manager":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700",
  "Order Manager":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700",
  "Marketing Manager":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700",
  "Support Agent":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700",
  "Content Editor":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600",
};

const allRoles = [
  "All Roles",
  "Super Admin",
  "Store Manager",
  "Inventory Manager",
  "Order Manager",
  "Marketing Manager",
  "Support Agent",
  "Content Editor",
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = adminUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All Roles" || u.role === roleFilter;
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Admin Users
          </h1>
          <p className="text-sm text-slate-500">
            Manage administrator accounts, roles, and access permissions.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors self-start sm:self-auto">
          <FiUserPlus className="size-4" />
          Invite Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 xl:grid-cols-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiUsers className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Admins
            </p>
            <p className="text-2xl font-bold text-slate-800">8</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Registered admin accounts
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiUserCheck className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active
            </p>
            <p className="text-2xl font-bold text-slate-800">7</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Currently active admins
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
            <FiUserX className="size-6 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Inactive
            </p>
            <p className="text-2xl font-bold text-slate-800">1</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Deactivated accounts
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          {allRoles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <span className="text-xs text-slate-500 ml-auto">
          {filtered.length} of {adminUsers.length} admins
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-slate-400"
                >
                  No admin users match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={
                        roleBadgeClass[user.role] ??
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600"
                      }
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500 font-mono">
                    {user.lastLogin}
                  </td>
                  <td className="px-4 py-4">
                    {user.status === "Active" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="size-4" />
                      </button>
                      <button
                        className="rounded-lg p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Reset Password"
                      >
                        <FiKey className="size-4" />
                      </button>
                      <button
                        className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
