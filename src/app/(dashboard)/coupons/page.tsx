"use client";

import React, { useState } from "react";
import {
  FiPlus,
  FiTag,
  FiCheckCircle,
  FiHash,
  FiDollarSign,
  FiSearch,
  FiEdit2,
  FiCopy,
  FiTrash2,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination/Pagination";

interface Coupon {
  id: string;
  code: string;
  type: "Percentage" | "Fixed" | "Free Shipping";
  value: string;
  minOrder: number;
  usedCount: number;
  maxUses: number | null;
  expiry: string;
  status: "Active" | "Scheduled" | "Expired";
}

const coupons: Coupon[] = [
  { id: "cpn-1", code: "SUMMER40", type: "Percentage", value: "40%", minOrder: 50, usedCount: 234, maxUses: 500, expiry: "2026-08-31", status: "Active" },
  { id: "cpn-2", code: "WELCOME10", type: "Percentage", value: "10%", minOrder: 0, usedCount: 89, maxUses: 1000, expiry: "2026-12-31", status: "Active" },
  { id: "cpn-3", code: "FREESHIP75", type: "Free Shipping", value: "Free", minOrder: 75, usedCount: 445, maxUses: null, expiry: "2026-12-31", status: "Active" },
  { id: "cpn-4", code: "FLASH25", type: "Fixed", value: "$25", minOrder: 100, usedCount: 56, maxUses: 100, expiry: "2026-06-30", status: "Active" },
  { id: "cpn-5", code: "NIKE20", type: "Percentage", value: "20%", minOrder: 80, usedCount: 123, maxUses: 200, expiry: "2026-07-31", status: "Active" },
  { id: "cpn-6", code: "LOYAL15", type: "Percentage", value: "15%", minOrder: 50, usedCount: 312, maxUses: null, expiry: "2026-12-31", status: "Active" },
  { id: "cpn-7", code: "BACK2SCH", type: "Fixed", value: "$15", minOrder: 60, usedCount: 0, maxUses: 300, expiry: "2026-09-15", status: "Scheduled" },
  { id: "cpn-8", code: "WINTER30", type: "Percentage", value: "30%", minOrder: 100, usedCount: 0, maxUses: 200, expiry: "2027-01-31", status: "Scheduled" },
  { id: "cpn-9", code: "FLASHMAY", type: "Fixed", value: "$20", minOrder: 75, usedCount: 78, maxUses: 100, expiry: "2026-05-31", status: "Expired" },
  { id: "cpn-10", code: "SPRING15", type: "Percentage", value: "15%", minOrder: 40, usedCount: 119, maxUses: 150, expiry: "2026-05-15", status: "Expired" },
];

const typeColors: Record<string, string> = {
  Percentage: "bg-indigo-50 text-indigo-700",
  Fixed: "bg-emerald-50 text-emerald-700",
  "Free Shipping": "bg-blue-50 text-blue-700",
};

function statusBadge(status: Coupon["status"]) {
  if (status === "Active") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700";
  if (status === "Scheduled") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700";
  return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600";
}

const PAGE_SIZE = 5;

export default function CouponsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = coupons.filter((c) => {
    const matchSearch = c.code.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase());
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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Coupons</h1>
          <p className="text-sm text-slate-500">Create and manage discount coupon codes for your store promotions.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <FiPlus className="size-4" /> Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiTag className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total</p>
            <p className="text-2xl font-bold text-slate-800">24</p>
            <p className="text-xs text-slate-500 mt-0.5">All coupons</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiCheckCircle className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active</p>
            <p className="text-2xl font-bold text-slate-800">15</p>
            <p className="text-xs text-slate-500 mt-0.5">Currently live</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiHash className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Uses</p>
            <p className="text-2xl font-bold text-slate-800">1,456</p>
            <p className="text-xs text-slate-500 mt-0.5">Redemptions to date</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
            <FiDollarSign className="size-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Discounts</p>
            <p className="text-2xl font-bold text-slate-800">$8,234</p>
            <p className="text-xs text-slate-500 mt-0.5">Total savings given</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search coupons..."
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
          <option value="Scheduled">Scheduled</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Code</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Value</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Min Order</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Usage</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4">
                  <span className="font-mono bg-slate-50 px-2 py-0.5 rounded text-xs text-slate-700 border border-slate-200">
                    {coupon.code}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeColors[coupon.type]}`}>
                    {coupon.type}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm font-bold text-slate-800">{coupon.value}</td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {coupon.minOrder === 0 ? "—" : `$${coupon.minOrder}`}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {coupon.usedCount} / {coupon.maxUses === null ? "∞" : coupon.maxUses}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{coupon.expiry}</td>
                <td className="px-4 py-4">
                  <span className={statusBadge(coupon.status)}>{coupon.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEdit2 className="size-4" /></button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiCopy className="size-4" /></button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><FiTrash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">No coupons found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} total={filtered.length} limit={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}
