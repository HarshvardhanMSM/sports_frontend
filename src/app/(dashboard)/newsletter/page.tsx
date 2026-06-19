"use client";

import React, { useState } from "react";
import {
  FiDownload,
  FiMail,
  FiCheckCircle,
  FiUserX,
  FiBarChart2,
  FiSearch,
  FiEye,
  FiTrash2,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination/Pagination";

interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribedDate: string;
  source: string;
  status: "Active" | "Unsubscribed";
  lastOpened: string;
}

const subscribers: Subscriber[] = [
  { id: "sub-1", email: "james.wilson@email.com", name: "James Wilson", subscribedDate: "2025-03-15", source: "Website Signup", status: "Active", lastOpened: "2026-06-10" },
  { id: "sub-2", email: "sarah.chen@email.com", name: "Sarah Chen", subscribedDate: "2025-04-22", source: "Checkout", status: "Active", lastOpened: "2026-06-12" },
  { id: "sub-3", email: "marco.rossi@email.com", name: "Marco Rossi", subscribedDate: "2025-06-10", source: "Social Media", status: "Active", lastOpened: "2026-06-08" },
  { id: "sub-4", email: "emily.davis@email.com", name: "Emily Davis", subscribedDate: "2024-11-08", source: "Website Signup", status: "Active", lastOpened: "2026-06-14" },
  { id: "sub-5", email: "tom.j@email.com", name: "Tom Johnson", subscribedDate: "2025-09-30", source: "Checkout", status: "Unsubscribed", lastOpened: "2026-04-20" },
  { id: "sub-6", email: "aisha.patel@email.com", name: "Aisha Patel", subscribedDate: "2024-08-14", source: "Website Signup", status: "Active", lastOpened: "2026-06-13" },
  { id: "sub-7", email: "c.mendez@email.com", name: "Carlos Mendez", subscribedDate: "2025-07-02", source: "Facebook Ad", status: "Active", lastOpened: "2026-06-09" },
  { id: "sub-8", email: "r.kim@email.com", name: "Rachel Kim", subscribedDate: "2025-01-19", source: "Instagram Ad", status: "Active", lastOpened: "2026-06-11" },
  { id: "sub-9", email: "d.brown@email.com", name: "David Brown", subscribedDate: "2025-10-05", source: "Checkout", status: "Unsubscribed", lastOpened: "2026-05-15" },
  { id: "sub-10", email: "l.zhang@email.com", name: "Lisa Zhang", subscribedDate: "2025-05-27", source: "Website Signup", status: "Active", lastOpened: "2026-06-07" },
];

function sourceColor(source: string): string {
  if (source === "Website Signup") return "bg-indigo-50 text-indigo-700";
  if (source === "Checkout") return "bg-emerald-50 text-emerald-700";
  return "bg-blue-50 text-blue-700";
}

function statusBadge(status: Subscriber["status"]) {
  if (status === "Active") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700";
  return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600";
}

const PAGE_SIZE = 5;

export default function NewsletterPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = subscribers.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.source.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Newsletter Subscribers</h1>
          <p className="text-sm text-slate-500">Manage email subscribers and track newsletter engagement metrics.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
          <FiDownload className="size-4" /> Export List
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiMail className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Subscribers</p>
            <p className="text-2xl font-bold text-slate-800">2,456</p>
            <p className="text-xs text-slate-500 mt-0.5">All time signups</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiCheckCircle className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active</p>
            <p className="text-2xl font-bold text-slate-800">2,200</p>
            <p className="text-xs text-slate-500 mt-0.5">Subscribed and active</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
            <FiUserX className="size-6 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Unsubscribed</p>
            <p className="text-2xl font-bold text-slate-800">256</p>
            <p className="text-xs text-slate-500 mt-0.5">Opted out</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiBarChart2 className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Open Rate</p>
            <p className="text-2xl font-bold text-slate-800">34.2%</p>
            <p className="text-xs text-slate-500 mt-0.5">Last 30 days</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search subscribers..."
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
          <option value="Active">Active</option>
          <option value="Unsubscribed">Unsubscribed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Subscriber</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Subscribed Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Opened</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-slate-800">{sub.name}</p>
                  <p className="text-xs text-slate-500">{sub.email}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{sub.subscribedDate}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${sourceColor(sub.source)}`}>
                    {sub.source}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={statusBadge(sub.status)}>{sub.status}</span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{sub.lastOpened}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEye className="size-4" /></button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><FiTrash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">No subscribers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} total={filtered.length} limit={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}
