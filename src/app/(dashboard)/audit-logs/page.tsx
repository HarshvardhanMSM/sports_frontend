"use client";

import React, { useState } from "react";
import {
  FiList,
  FiClock,
  FiCalendar,
  FiAlertTriangle,
  FiDownload,
  FiSearch,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination/Pagination";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  avatar: string;
  action: string;
  module: string;
  ip: string;
  severity: "Info" | "Warning" | "Critical";
}

const allLogs: AuditLog[] = [
  { id: "log-001", timestamp: "2026-06-15 09:45:12", user: "Ahmed Khan", avatar: "AK", action: "Updated product price", module: "Catalog", ip: "192.168.1.10", severity: "Info" },
  { id: "log-002", timestamp: "2026-06-15 09:23:45", user: "Super Admin", avatar: "SA", action: "Created new admin user", module: "User Management", ip: "192.168.1.1", severity: "Warning" },
  { id: "log-003", timestamp: "2026-06-15 08:50:23", user: "Sara Malik", avatar: "SM", action: "Adjusted inventory stock (-5 units)", module: "Inventory", ip: "192.168.1.12", severity: "Info" },
  { id: "log-004", timestamp: "2026-06-15 08:30:10", user: "Raza Ali", avatar: "RA", action: "Updated order status to Shipped", module: "Orders", ip: "192.168.1.15", severity: "Info" },
  { id: "log-005", timestamp: "2026-06-14 17:45:00", user: "Marketing Admin", avatar: "MA", action: "Published new banner", module: "Marketing", ip: "192.168.1.20", severity: "Info" },
  { id: "log-006", timestamp: "2026-06-14 16:20:33", user: "Super Admin", avatar: "SA", action: "Modified role permissions", module: "User Management", ip: "192.168.1.1", severity: "Critical" },
  { id: "log-007", timestamp: "2026-06-14 15:10:22", user: "Ahmed Khan", avatar: "AK", action: "Deleted product: Puma Socks XL", module: "Catalog", ip: "192.168.1.10", severity: "Warning" },
  { id: "log-008", timestamp: "2026-06-14 14:05:45", user: "Content Editor", avatar: "CE", action: "Updated Terms & Conditions v2.1", module: "Content", ip: "192.168.1.25", severity: "Info" },
  { id: "log-009", timestamp: "2026-06-14 13:30:18", user: "Raza Ali", avatar: "RA", action: "Processed refund $130.00 for RET-0234", module: "Orders", ip: "192.168.1.15", severity: "Info" },
  { id: "log-010", timestamp: "2026-06-14 11:45:09", user: "Super Admin", avatar: "SA", action: "Updated payment gateway settings", module: "Settings", ip: "192.168.1.1", severity: "Critical" },
  { id: "log-011", timestamp: "2026-06-14 10:20:34", user: "Sara Malik", avatar: "SM", action: "Created new warehouse location", module: "Inventory", ip: "192.168.1.12", severity: "Info" },
  { id: "log-012", timestamp: "2026-06-13 16:50:22", user: "Marketing Admin", avatar: "MA", action: "Launched email campaign", module: "Marketing", ip: "192.168.1.20", severity: "Info" },
  { id: "log-013", timestamp: "2026-06-13 14:30:45", user: "Ahmed Khan", avatar: "AK", action: "Bulk status change: 5 products to Active", module: "Catalog", ip: "192.168.1.10", severity: "Warning" },
  { id: "log-014", timestamp: "2026-06-13 12:15:33", user: "Super Admin", avatar: "SA", action: "Exported customer data CSV", module: "Customers", ip: "192.168.1.1", severity: "Critical" },
  { id: "log-015", timestamp: "2026-06-13 09:45:10", user: "Support Lead", avatar: "SL", action: "Resolved ticket TKT-0885", module: "Customers", ip: "192.168.1.30", severity: "Info" },
];

const allModules = [
  "All Modules", "Catalog", "User Management", "Inventory", "Orders", "Marketing", "Content", "Settings", "Customers",
];

const severityBadge: Record<string, string> = {
  Info: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700",
  Warning: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700",
  Critical: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700",
};

const moduleBadge: Record<string, string> = {
  Catalog: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700",
  "User Management": "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700",
  Inventory: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700",
  Orders: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700",
  Marketing: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700",
  Content: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600",
  Settings: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700",
  Customers: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700",
};

const PAGE_SIZE = 10;

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = allLogs.filter((log) => {
    const matchSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchModule = moduleFilter === "All Modules" || log.module === moduleFilter;
    const matchSeverity = severityFilter === "All" || log.severity === severityFilter;
    return matchSearch && matchModule && matchSeverity;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, filtered.length);
  const paginated = filtered.slice(start, end);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Audit Logs</h1>
          <p className="text-sm text-slate-500">Complete record of all administrative actions taken across the platform.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto">
          <FiDownload className="size-4" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiList className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Logs</p>
            <p className="text-2xl font-bold text-slate-800">4,567</p>
            <p className="text-xs text-slate-500 mt-0.5">All time entries</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiClock className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today</p>
            <p className="text-2xl font-bold text-slate-800">89</p>
            <p className="text-xs text-slate-500 mt-0.5">Actions logged today</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiCalendar className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">This Week</p>
            <p className="text-2xl font-bold text-slate-800">456</p>
            <p className="text-xs text-slate-500 mt-0.5">Last 7 days</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
            <FiAlertTriangle className="size-6 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Critical Events</p>
            <p className="text-2xl font-bold text-slate-800">3</p>
            <p className="text-xs text-slate-500 mt-0.5">Requiring attention</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search by user or action..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={moduleFilter}
          onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          {allModules.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select
          value={severityFilter}
          onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="All">All Severity</option>
          <option value="Info">Info</option>
          <option value="Warning">Warning</option>
          <option value="Critical">Critical</option>
        </select>
        <span className="text-xs text-slate-500 ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Module</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">IP Address</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                  No audit logs match your filters.
                </td>
              </tr>
            ) : (
              paginated.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-4 font-mono text-xs text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {log.avatar}
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 max-w-xs">{log.action}</td>
                  <td className="px-4 py-4">
                    <span className={moduleBadge[log.module] ?? "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600"}>
                      {log.module}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-500">{log.ip}</td>
                  <td className="px-4 py-4">
                    <span className={severityBadge[log.severity]}>{log.severity}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={safePage} totalPages={totalPages} total={filtered.length} limit={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}
