"use client";

import React from "react";
import {
  FiUsers,
  FiUser,
  FiPercent,
  FiPlus,
  FiEye,
  FiEdit2,
} from "react-icons/fi";

interface CustomerGroup {
  id: string;
  name: string;
  color: string;
  icon: string;
  members: number;
  discount: number;
  description: string;
  minOrderValue: string;
  status: string;
}

const GROUPS: CustomerGroup[] = [
  {
    id: "grp-1",
    name: "VIP Customers",
    color: "indigo",
    icon: "👑",
    members: 245,
    discount: 20,
    description: "Top-spending customers with exclusive access to deals.",
    minOrderValue: "$500 lifetime spend",
    status: "Active",
  },
  {
    id: "grp-2",
    name: "Wholesale Buyers",
    color: "blue",
    icon: "🏭",
    members: 38,
    discount: 30,
    description: "Bulk purchasers with negotiated wholesale pricing.",
    minOrderValue: "Min 50 units/order",
    status: "Active",
  },
  {
    id: "grp-3",
    name: "Regular Customers",
    color: "emerald",
    icon: "🛍️",
    members: 2956,
    discount: 0,
    description: "Standard registered customers with no special pricing.",
    minOrderValue: "No minimum",
    status: "Active",
  },
  {
    id: "grp-4",
    name: "New Customers",
    color: "purple",
    icon: "🌟",
    members: 156,
    discount: 10,
    description: "First-time buyers eligible for welcome discounts.",
    minOrderValue: "First order only",
    status: "Active",
  },
  {
    id: "grp-5",
    name: "Loyalty Members",
    color: "amber",
    icon: "🏆",
    members: 412,
    discount: 15,
    description: "Customers enrolled in the loyalty rewards program.",
    minOrderValue: "100+ loyalty points",
    status: "Active",
  },
  {
    id: "grp-6",
    name: "Inactive Customers",
    color: "slate",
    icon: "💤",
    members: 35,
    discount: 5,
    description: "Customers inactive for 6+ months with re-engagement offers.",
    minOrderValue: "Any order value",
    status: "Inactive",
  },
];

const COLOR_MAP: Record<
  string,
  { header: string; badge: string; text: string }
> = {
  indigo: {
    header: "bg-indigo-600",
    badge: "bg-indigo-50 text-indigo-700",
    text: "text-indigo-700",
  },
  blue: {
    header: "bg-blue-600",
    badge: "bg-blue-50 text-blue-700",
    text: "text-blue-700",
  },
  emerald: {
    header: "bg-emerald-600",
    badge: "bg-emerald-50 text-emerald-700",
    text: "text-emerald-700",
  },
  purple: {
    header: "bg-purple-600",
    badge: "bg-purple-50 text-purple-700",
    text: "text-purple-700",
  },
  amber: {
    header: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
    text: "text-amber-700",
  },
  slate: {
    header: "bg-slate-500",
    badge: "bg-slate-100 text-slate-600",
    text: "text-slate-600",
  },
};

function statusBadge(status: string) {
  return status === "Active"
    ? "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700"
    : "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600";
}

export default function CustomerGroupsPage() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Customer Groups
          </h1>
          <p className="text-sm text-slate-500">
            Segment customers into groups for targeted pricing and promotions.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <FiPlus className="size-4" /> New Group
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiUsers className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Groups
            </p>
            <p className="text-2xl font-bold text-slate-800">6</p>
            <p className="text-xs text-slate-500 mt-0.5">Active segments</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiUser className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Members
            </p>
            <p className="text-2xl font-bold text-slate-800">3,842</p>
            <p className="text-xs text-slate-500 mt-0.5">Across all groups</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <FiPercent className="size-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Avg Group Discount
            </p>
            <p className="text-2xl font-bold text-slate-800">12%</p>
            <p className="text-xs text-slate-500 mt-0.5">Weighted average</p>
          </div>
        </div>
      </div>

      {/* Group Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {GROUPS.map((group) => {
          const colors = COLOR_MAP[group.color] ?? COLOR_MAP.slate;
          return (
            <div
              key={group.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
            >
              {/* Colored header strip */}
              <div
                className={`${colors.header} px-5 py-4 flex items-center gap-3`}
              >
                <span className="text-2xl">{group.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">{group.name}</h3>
                  <p className="text-xs text-white/75">
                    {group.members.toLocaleString()} members
                  </p>
                </div>
              </div>
              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col gap-3">
                <p className="text-sm text-slate-600">{group.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Discount
                  </span>
                  {group.discount > 0 ? (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colors.badge}`}
                    >
                      {group.discount}% OFF
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                      No Discount
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Eligibility
                  </span>
                  <span className="text-xs text-slate-700 font-semibold">
                    {group.minOrderValue}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Status
                  </span>
                  <span className={statusBadge(group.status)}>
                    {group.status}
                  </span>
                </div>
              </div>
              {/* Card Footer */}
              <div className="px-5 pb-5 flex gap-2">
                <button className="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                  <FiEye className="size-3.5" /> View
                </button>
                <button className="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                  <FiEdit2 className="size-3.5" /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-800">
            Group Summary
          </h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Group
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Members
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Discount
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
            {GROUPS.map((group) => {
              const colors = COLOR_MAP[group.color] ?? COLOR_MAP.slate;
              return (
                <tr
                  key={group.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{group.icon}</span>
                      <span className={`text-sm font-semibold ${colors.text}`}>
                        {group.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {group.members.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                    {group.discount > 0 ? `${group.discount}%` : "—"}
                  </td>
                  <td className="px-4 py-4">
                    <span className={statusBadge(group.status)}>
                      {group.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <FiEye className="size-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <FiEdit2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
