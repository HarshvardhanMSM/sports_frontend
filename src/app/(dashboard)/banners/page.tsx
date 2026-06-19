"use client";

import React, { useState } from "react";
import {
  FiPlus,
  FiImage,
  FiCheckCircle,
  FiClock,
  FiMousePointer,
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

interface Banner {
  id: string;
  title: string;
  position: string;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  ctr: string;
  status: "Active" | "Scheduled" | "Expired";
}

const banners: Banner[] = [
  { id: "ban-1", title: "Summer Sale – Up to 40% Off!", position: "Hero Slider", startDate: "2026-06-01", endDate: "2026-08-31", impressions: 45230, clicks: 1820, ctr: "4.0%", status: "Active" },
  { id: "ban-2", title: "New Nike Collection Arrived", position: "Hero Slider", startDate: "2026-06-10", endDate: "2026-07-10", impressions: 28450, clicks: 1140, ctr: "4.0%", status: "Active" },
  { id: "ban-3", title: "Free Shipping on Orders Over $75", position: "Top Banner", startDate: "2026-06-01", endDate: "2026-12-31", impressions: 89320, clicks: 2230, ctr: "2.5%", status: "Active" },
  { id: "ban-4", title: "Back to School – Best Deals", position: "Category Banner", startDate: "2026-08-15", endDate: "2026-09-15", impressions: 0, clicks: 0, ctr: "0%", status: "Scheduled" },
  { id: "ban-5", title: "Flash Sale – 24 Hours Only!", position: "Popup Banner", startDate: "2026-06-05", endDate: "2026-06-06", impressions: 12450, clicks: 890, ctr: "7.1%", status: "Expired" },
  { id: "ban-6", title: "Adidas Performance Range", position: "Side Banner", startDate: "2026-05-01", endDate: "2026-05-31", impressions: 34560, clicks: 1230, ctr: "3.6%", status: "Expired" },
  { id: "ban-7", title: "Winter Collection Preview", position: "Hero Slider", startDate: "2026-11-01", endDate: "2027-01-31", impressions: 0, clicks: 0, ctr: "0%", status: "Scheduled" },
  { id: "ban-8", title: "Loyalty Program – Earn Points", position: "Footer Banner", startDate: "2026-01-01", endDate: "2026-12-31", impressions: 67890, clicks: 2340, ctr: "3.4%", status: "Active" },
];

const positionColors: Record<string, string> = {
  "Hero Slider": "bg-indigo-50 text-indigo-700",
  "Top Banner": "bg-blue-50 text-blue-700",
  "Category Banner": "bg-emerald-50 text-emerald-700",
  "Popup Banner": "bg-amber-50 text-amber-700",
  "Side Banner": "bg-purple-50 text-purple-700",
  "Footer Banner": "bg-slate-100 text-slate-600",
};

function statusBadge(status: Banner["status"]) {
  if (status === "Active") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700";
  if (status === "Scheduled") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700";
  return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600";
}

export default function BannersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = banners.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.position.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Banners</h1>
          <p className="text-sm text-slate-500">Manage homepage and promotional banners across your storefront.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <FiPlus className="size-4" /> New Banner
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiImage className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Banners</p>
            <p className="text-2xl font-bold text-slate-800">8</p>
            <p className="text-xs text-slate-500 mt-0.5">All banner records</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiCheckCircle className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active</p>
            <p className="text-2xl font-bold text-slate-800">5</p>
            <p className="text-xs text-slate-500 mt-0.5">Currently live</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiClock className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Scheduled</p>
            <p className="text-2xl font-bold text-slate-800">2</p>
            <p className="text-xs text-slate-500 mt-0.5">Upcoming banners</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
            <FiMousePointer className="size-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Clicks</p>
            <p className="text-2xl font-bold text-slate-800">12,450</p>
            <p className="text-xs text-slate-500 mt-0.5">Across all banners</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search banners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Position</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Start</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">End</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Impressions</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Clicks</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">CTR</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((banner) => (
              <tr key={banner.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4 text-sm text-slate-700 max-w-xs">
                  <span title={banner.title}>
                    {banner.title.length > 40 ? banner.title.slice(0, 40) + "…" : banner.title}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${positionColors[banner.position] ?? "bg-slate-100 text-slate-600"}`}>
                    {banner.position}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{banner.startDate}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{banner.endDate}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{banner.impressions.toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{banner.clicks.toLocaleString()}</td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-700">{banner.ctr}</td>
                <td className="px-4 py-4">
                  <span className={statusBadge(banner.status)}>{banner.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEye className="size-4" /></button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEdit2 className="size-4" /></button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><FiTrash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-400">No banners found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
