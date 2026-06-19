"use client";

import React, { useState } from "react";
import {
  FiPlus,
  FiSend,
  FiActivity,
  FiCheckCircle,
  FiBarChart2,
  FiSearch,
  FiEye,
  FiEdit2,
  FiPlay,
  FiTrash2,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination/Pagination";

interface Campaign {
  id: string;
  name: string;
  type: "Email" | "Automated Email" | "SMS";
  audienceSize: number;
  sentDate: string;
  openRate: string;
  clickRate: string;
  status: "Sent" | "Active" | "Draft" | "Scheduled";
}

const campaigns: Campaign[] = [
  { id: "cmp-1", name: "June Summer Sale Announcement", type: "Email", audienceSize: 2200, sentDate: "2026-06-01", openRate: "38.2%", clickRate: "12.4%", status: "Sent" },
  { id: "cmp-2", name: "New Nike Collection Launch", type: "Email", audienceSize: 2200, sentDate: "2026-06-10", openRate: "42.1%", clickRate: "18.9%", status: "Sent" },
  { id: "cmp-3", name: "Abandoned Cart Recovery", type: "Automated Email", audienceSize: 345, sentDate: "-", openRate: "28.5%", clickRate: "9.2%", status: "Active" },
  { id: "cmp-4", name: "Welcome New Subscribers", type: "Automated Email", audienceSize: 156, sentDate: "-", openRate: "65.3%", clickRate: "22.1%", status: "Active" },
  { id: "cmp-5", name: "Re-engagement Campaign", type: "Email", audienceSize: 35, sentDate: "2026-05-20", openRate: "18.9%", clickRate: "4.3%", status: "Sent" },
  { id: "cmp-6", name: "Back to School Teaser", type: "Email", audienceSize: 2200, sentDate: "-", openRate: "-", clickRate: "-", status: "Draft" },
  { id: "cmp-7", name: "VIP Exclusive Early Access", type: "Email", audienceSize: 245, sentDate: "2026-06-12", openRate: "71.2%", clickRate: "34.5%", status: "Sent" },
  { id: "cmp-8", name: "Nike Brand Week Promo", type: "Email", audienceSize: 2200, sentDate: "2026-05-14", openRate: "35.8%", clickRate: "14.2%", status: "Sent" },
  { id: "cmp-9", name: "Flash Sale – 24hr Alert", type: "SMS", audienceSize: 892, sentDate: "2026-06-05", openRate: "92.3%", clickRate: "41.2%", status: "Sent" },
  { id: "cmp-10", name: "Winter Preview Campaign", type: "Email", audienceSize: 2200, sentDate: "-", openRate: "-", clickRate: "-", status: "Scheduled" },
];

const typeColors: Record<string, string> = {
  Email: "bg-indigo-50 text-indigo-700",
  "Automated Email": "bg-blue-50 text-blue-700",
  SMS: "bg-emerald-50 text-emerald-700",
};

function statusBadge(status: Campaign["status"]) {
  if (status === "Sent") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700";
  if (status === "Active") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700";
  if (status === "Draft") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700";
  return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700";
}

const PAGE_SIZE = 5;

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = campaigns.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Campaign Management</h1>
          <p className="text-sm text-slate-500">Plan, execute, and analyze your email and marketing campaigns.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <FiPlus className="size-4" /> New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiSend className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total</p>
            <p className="text-2xl font-bold text-slate-800">12</p>
            <p className="text-xs text-slate-500 mt-0.5">All campaigns</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiActivity className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active / Sending</p>
            <p className="text-2xl font-bold text-slate-800">3</p>
            <p className="text-xs text-slate-500 mt-0.5">Currently running</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiCheckCircle className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed</p>
            <p className="text-2xl font-bold text-slate-800">7</p>
            <p className="text-xs text-slate-500 mt-0.5">Successfully sent</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
            <FiBarChart2 className="size-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Open Rate</p>
            <p className="text-2xl font-bold text-slate-800">32.4%</p>
            <p className="text-xs text-slate-500 mt-0.5">Across all campaigns</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search campaigns..."
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
          <option value="Sent">Sent</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Scheduled">Scheduled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Audience</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Sent Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Open Rate</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Click Rate</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((cmp) => (
              <tr key={cmp.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4 text-sm font-semibold text-slate-800">{cmp.name}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeColors[cmp.type]}`}>
                    {cmp.type}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{cmp.audienceSize.toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{cmp.sentDate}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{cmp.openRate}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{cmp.clickRate}</td>
                <td className="px-4 py-4">
                  <span className={statusBadge(cmp.status)}>{cmp.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEye className="size-4" /></button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEdit2 className="size-4" /></button>
                    {(cmp.status === "Active" || cmp.status === "Draft") && (
                      <button className="rounded-lg p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"><FiPlay className="size-4" /></button>
                    )}
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><FiTrash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">No campaigns found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} total={filtered.length} limit={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}
