"use client";

import React, { useState } from "react";
import {
  FiMessageCircle,
  FiCheckCircle,
  FiClock,
  FiThumbsUp,
  FiPlus,
  FiSearch,
  FiEye,
  FiEdit2,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination/Pagination";

interface Ticket {
  id: string;
  customer: string;
  email: string;
  subject: string;
  priority: string;
  status: string;
  assignedTo: string;
  created: string;
  lastUpdate: string;
}

const TICKETS: Ticket[] = [
  { id: "TKT-0892", customer: "James Wilson", email: "james@email.com", subject: "Order not delivered after 7 days", priority: "High", status: "Open", assignedTo: "Support Agent 1", created: "2026-06-14", lastUpdate: "2026-06-15" },
  { id: "TKT-0891", customer: "Sarah Chen", email: "sarah@email.com", subject: "Wrong item received in my order", priority: "High", status: "In Progress", assignedTo: "Support Agent 2", created: "2026-06-13", lastUpdate: "2026-06-14" },
  { id: "TKT-0890", customer: "Marco Rossi", email: "marco@email.com", subject: "Request for size exchange", priority: "Medium", status: "Resolved", assignedTo: "Support Agent 1", created: "2026-06-12", lastUpdate: "2026-06-13" },
  { id: "TKT-0889", customer: "Emily Davis", email: "emily@email.com", subject: "Coupon code not working", priority: "Low", status: "Resolved", assignedTo: "Support Agent 3", created: "2026-06-11", lastUpdate: "2026-06-12" },
  { id: "TKT-0888", customer: "Tom Johnson", email: "tom@email.com", subject: "Refund not received after 10 days", priority: "High", status: "Open", assignedTo: "Unassigned", created: "2026-06-10", lastUpdate: "2026-06-10" },
  { id: "TKT-0887", customer: "Aisha Patel", email: "aisha@email.com", subject: "Tracking number not updating", priority: "Medium", status: "Open", assignedTo: "Support Agent 2", created: "2026-06-09", lastUpdate: "2026-06-09" },
  { id: "TKT-0886", customer: "Carlos Mendez", email: "carlos@email.com", subject: "Product quality complaint", priority: "High", status: "In Progress", assignedTo: "Support Agent 1", created: "2026-06-08", lastUpdate: "2026-06-09" },
  { id: "TKT-0885", customer: "Rachel Kim", email: "rachel@email.com", subject: "How to return an item?", priority: "Low", status: "Resolved", assignedTo: "Support Agent 3", created: "2026-06-07", lastUpdate: "2026-06-08" },
  { id: "TKT-0884", customer: "David Brown", email: "david@email.com", subject: "Payment failed but money deducted", priority: "High", status: "Escalated", assignedTo: "Senior Support", created: "2026-06-06", lastUpdate: "2026-06-07" },
  { id: "TKT-0883", customer: "Lisa Zhang", email: "lisa@email.com", subject: "Change shipping address", priority: "Medium", status: "Resolved", assignedTo: "Support Agent 2", created: "2026-06-05", lastUpdate: "2026-06-06" },
];

const PAGE_SIZE = 5;

function priorityBadge(priority: string) {
  switch (priority) {
    case "High":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700";
    case "Medium":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700";
    case "Low":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700";
    default:
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600";
  }
}

function statusBadge(status: string) {
  switch (status) {
    case "Open":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700";
    case "In Progress":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700";
    case "Resolved":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700";
    case "Escalated":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700";
    default:
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600";
  }
}

export default function CustomerSupportPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = TICKETS.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Customer Support</h1>
          <p className="text-sm text-slate-500">Manage support tickets, track resolutions, and ensure customer satisfaction.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <FiPlus className="size-4" /> New Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiMessageCircle className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Open Tickets</p>
            <p className="text-2xl font-bold text-slate-800">34</p>
            <p className="text-xs text-slate-500 mt-0.5">Awaiting response</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiCheckCircle className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resolved Today</p>
            <p className="text-2xl font-bold text-slate-800">12</p>
            <p className="text-xs text-slate-500 mt-0.5">June 16, 2026</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiClock className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Response Time</p>
            <p className="text-2xl font-bold text-slate-800">2.4h</p>
            <p className="text-xs text-slate-500 mt-0.5">This week</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
            <FiThumbsUp className="size-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Satisfaction Rate</p>
            <p className="text-2xl font-bold text-slate-800">94%</p>
            <p className="text-xs text-slate-500 mt-0.5">Customer rating</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
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
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Escalated">Escalated</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4 text-sm font-mono font-semibold text-indigo-600">{t.id}</td>
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-slate-800">{t.customer}</p>
                  <p className="text-xs text-slate-400">{t.email}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700 max-w-[220px]">
                  <span title={t.subject}>
                    {t.subject.length > 50 ? t.subject.slice(0, 50) + "…" : t.subject}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={priorityBadge(t.priority)}>{t.priority}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={statusBadge(t.status)}>{t.status}</span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{t.assignedTo}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{t.created}</td>
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
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">
                  No tickets found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={safePage} totalPages={totalPages} total={filtered.length} limit={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}
