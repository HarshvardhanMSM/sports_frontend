"use client";

import React from "react";
import {
  FiPlus,
  FiVolume2,
  FiCheckCircle,
  FiClock,
  FiArchive,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

interface Announcement {
  id: string;
  title: string;
  type: "Promotion" | "Sale" | "New Arrival" | "Maintenance";
  target: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Scheduled" | "Expired";
}

const announcements: Announcement[] = [
  { id: "ann-1", title: "Free Shipping on orders over $75!", type: "Promotion", target: "All Visitors", startDate: "2026-06-01", endDate: "2026-12-31", status: "Active" },
  { id: "ann-2", title: "Summer Sale now on – up to 40% off!", type: "Sale", target: "All Visitors", startDate: "2026-06-01", endDate: "2026-08-31", status: "Active" },
  { id: "ann-3", title: "New Nike 2026 collection is here!", type: "New Arrival", target: "All Visitors", startDate: "2026-06-10", endDate: "2026-07-10", status: "Active" },
  { id: "ann-4", title: "Website maintenance scheduled: June 20, 2am–4am", type: "Maintenance", target: "All Visitors", startDate: "2026-06-19", endDate: "2026-06-20", status: "Active" },
  { id: "ann-5", title: "Back to School deals starting August 15!", type: "Promotion", target: "All Visitors", startDate: "2026-08-15", endDate: "2026-09-15", status: "Scheduled" },
  { id: "ann-6", title: "Winter 2026 collection coming soon!", type: "New Arrival", target: "Newsletter Subscribers", startDate: "2026-10-01", endDate: "2026-10-15", status: "Scheduled" },
  { id: "ann-7", title: "Flash Sale – 24 hours only! (Ended)", type: "Sale", target: "All Visitors", startDate: "2026-06-05", endDate: "2026-06-06", status: "Expired" },
  { id: "ann-8", title: "Mother's Day special gift bundles", type: "Promotion", target: "All Visitors", startDate: "2026-05-01", endDate: "2026-05-12", status: "Expired" },
];

const typeColors: Record<string, string> = {
  Promotion: "bg-indigo-50 text-indigo-700",
  Sale: "bg-rose-50 text-rose-700",
  "New Arrival": "bg-emerald-50 text-emerald-700",
  Maintenance: "bg-amber-50 text-amber-700",
};

function statusBadge(status: Announcement["status"]) {
  if (status === "Active") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700";
  if (status === "Scheduled") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700";
  return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600";
}

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Announcements</h1>
          <p className="text-sm text-slate-500">Manage sitewide announcements and notification banners for customers.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <FiPlus className="size-4" /> New Announcement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiVolume2 className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total</p>
            <p className="text-2xl font-bold text-slate-800">12</p>
            <p className="text-xs text-slate-500 mt-0.5">All announcements</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiCheckCircle className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active</p>
            <p className="text-2xl font-bold text-slate-800">4</p>
            <p className="text-xs text-slate-500 mt-0.5">Currently showing</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiClock className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Scheduled</p>
            <p className="text-2xl font-bold text-slate-800">2</p>
            <p className="text-xs text-slate-500 mt-0.5">Upcoming</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <FiArchive className="size-6 text-slate-500" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Expired</p>
            <p className="text-2xl font-bold text-slate-800">6</p>
            <p className="text-xs text-slate-500 mt-0.5">Past announcements</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Target Audience</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Start</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">End</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {announcements.map((ann) => (
              <tr key={ann.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4 text-sm text-slate-700 max-w-xs font-medium">{ann.title}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeColors[ann.type]}`}>
                    {ann.type}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{ann.target}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{ann.startDate}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{ann.endDate}</td>
                <td className="px-4 py-4">
                  <span className={statusBadge(ann.status)}>{ann.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEdit2 className="size-4" /></button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><FiTrash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
