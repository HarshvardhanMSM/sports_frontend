"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiMessageCircle,
  FiCheckCircle,
  FiClock,
  FiThumbsUp,
  FiSearch,
  FiEye,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import type { SupportTicketListParams } from "@/types/support-ticket.types";

const STATUS_STYLES: Record<string, string> = {
  OPEN:        "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-orange-50 text-orange-700",
  RESOLVED:    "bg-emerald-50 text-emerald-700",
  CLOSED:      "bg-slate-100 text-slate-600",
  ESCALATED:   "bg-red-50 text-red-700",
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW:    "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-50 text-blue-700",
  HIGH:   "bg-orange-50 text-orange-700",
  URGENT: "bg-red-50 text-red-700",
};

export default function CustomerSupportPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);

  const params: SupportTicketListParams = { page, limit: 10 };
  if (search) params.search = search;
  if (statusFilter) params.status = statusFilter;
  if (priorityFilter) params.priority = priorityFilter;

  const { data, isLoading, error, refetch } = useSupportTickets(params);

  const raw = data?.data;
  const isPaginated = raw != null && !Array.isArray(raw);
  const allItems = Array.isArray(raw) ? raw : (raw?.items ?? []);
  const total = isPaginated ? (raw?.total ?? 0) : allItems.length;
  const totalPages = Math.max(1, Math.ceil(total / 10));

  if (error) {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <FiAlertCircle className="size-10 text-rose-500 mb-4" />
          <p className="text-sm font-semibold text-slate-800">Failed to load tickets</p>
          <button onClick={() => refetch()} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Customer Support</h1>
          <p className="text-sm text-slate-500">Manage support tickets, track resolutions, and ensure customer satisfaction.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiMessageCircle className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Open Tickets</p>
            <p className="text-2xl font-bold text-slate-800">{allItems.filter((t) => t.status === "OPEN").length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Awaiting response</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiCheckCircle className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">In Progress</p>
            <p className="text-2xl font-bold text-slate-800">{allItems.filter((t) => t.status === "IN_PROGRESS").length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Being worked on</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiClock className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Tickets</p>
            <p className="text-2xl font-bold text-slate-800">{total}</p>
            <p className="text-xs text-slate-500 mt-0.5">All tickets</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
            <FiThumbsUp className="size-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resolved / Closed</p>
            <p className="text-2xl font-bold text-slate-800">{allItems.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Completed tickets</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search by ticket ID, customer, or subject..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
          <option value="ESCALATED">Escalated</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading tickets...</p>
        </div>
      ) : allItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <FiMessageCircle className="size-6 text-slate-400" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">No tickets found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket #</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Admin</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allItems.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-4 text-sm font-mono font-semibold text-indigo-600">{t.ticketNumber}</td>
                    <td className="px-4 py-4 text-sm text-slate-700 max-w-[200px]">
                      <span title={t.subject}>
                        {t.subject.length > 50 ? t.subject.slice(0, 50) + "…" : t.subject}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{t.category}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[t.priority] ?? "bg-slate-100 text-slate-600"}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[t.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {t.status === "IN_PROGRESS" ? "In Progress" : t.status.charAt(0) + t.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {t.customer ? `${t.customer.firstName} ${t.customer.lastName}` : t.customerName}
                      </p>
                      <p className="text-xs text-slate-400">{t.customer?.email ?? t.customerEmail}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{t.assignedAdminName ?? "Unassigned"}</td>
                    <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => router.push(`/customer-support/${t.id}`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <FiEye className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                <FiChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                    p === page
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                <FiChevronRight className="size-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
