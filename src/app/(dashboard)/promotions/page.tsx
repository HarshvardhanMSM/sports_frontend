"use client";

import React, { useState } from "react";
import {
  FiPlus,
  FiGift,
  FiDollarSign,
  FiShoppingBag,
  FiPercent,
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

interface Promotion {
  id: string;
  name: string;
  type: string;
  discount: string;
  appliesTo: string;
  startDate: string;
  endDate: string;
  ordersUsed: number;
  status: "Active" | "Scheduled" | "Expired";
}

const promotions: Promotion[] = [
  { id: "prm-1", name: "Summer Mega Sale", type: "Percentage Discount", discount: "Up to 40% off", appliesTo: "All Products", startDate: "2026-06-01", endDate: "2026-08-31", ordersUsed: 234, status: "Active" },
  { id: "prm-2", name: "Buy 2 Get 1 Free – Socks", type: "Buy X Get Y", discount: "1 free item", appliesTo: "Accessories > Socks", startDate: "2026-06-01", endDate: "2026-07-31", ordersUsed: 89, status: "Active" },
  { id: "prm-3", name: "Free Shipping Threshold", type: "Free Shipping", discount: "Free delivery", appliesTo: "Orders over $75", startDate: "2026-01-01", endDate: "2026-12-31", ordersUsed: 1230, status: "Active" },
  { id: "prm-4", name: "Nike Brand Week", type: "Brand Discount", discount: "20% off", appliesTo: "Nike Products", startDate: "2026-05-15", endDate: "2026-05-22", ordersUsed: 312, status: "Expired" },
  { id: "prm-5", name: "Bundle: Shoes + Socks", type: "Bundle Deal", discount: "$10 off bundle", appliesTo: "Footwear + Accessories", startDate: "2026-06-15", endDate: "2026-07-15", ordersUsed: 56, status: "Active" },
  { id: "prm-6", name: "Loyalty Points 2x Weekend", type: "Points Multiplier", discount: "2x points", appliesTo: "All Loyalty Members", startDate: "2026-06-14", endDate: "2026-06-15", ordersUsed: 145, status: "Expired" },
  { id: "prm-7", name: "Back to School Flash Sale", type: "Percentage Discount", discount: "25% off", appliesTo: "Selected Categories", startDate: "2026-08-15", endDate: "2026-09-15", ordersUsed: 0, status: "Scheduled" },
  { id: "prm-8", name: "Winter Warmth Bundle", type: "Bundle Deal", discount: "$20 off bundle", appliesTo: "Apparel Winter Range", startDate: "2026-11-01", endDate: "2027-01-31", ordersUsed: 0, status: "Scheduled" },
];

const typeColors: Record<string, string> = {
  "Percentage Discount": "bg-indigo-50 text-indigo-700",
  "Buy X Get Y": "bg-emerald-50 text-emerald-700",
  "Free Shipping": "bg-blue-50 text-blue-700",
  "Brand Discount": "bg-purple-50 text-purple-700",
  "Bundle Deal": "bg-amber-50 text-amber-700",
  "Points Multiplier": "bg-rose-50 text-rose-700",
};

function statusBadge(status: Promotion["status"]) {
  if (status === "Active") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700";
  if (status === "Scheduled") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700";
  return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600";
}

export default function PromotionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = promotions.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase()) ||
      p.appliesTo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Promotions</h1>
          <p className="text-sm text-slate-500">Create and manage special promotions, bundles, and discount campaigns.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <FiPlus className="size-4" /> New Promotion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiGift className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active</p>
            <p className="text-2xl font-bold text-slate-800">6</p>
            <p className="text-xs text-slate-500 mt-0.5">Live promotions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiDollarSign className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Revenue from Promos</p>
            <p className="text-2xl font-bold text-slate-800">$18,920</p>
            <p className="text-xs text-slate-500 mt-0.5">Total attributed revenue</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiShoppingBag className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Orders with Promos</p>
            <p className="text-2xl font-bold text-slate-800">456</p>
            <p className="text-xs text-slate-500 mt-0.5">Orders using a promo</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <FiPercent className="size-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Discount</p>
            <p className="text-2xl font-bold text-slate-800">18%</p>
            <p className="text-xs text-slate-500 mt-0.5">Average discount applied</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search promotions..."
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
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Discount</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Applies To</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Start</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">End</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Orders Used</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((promo) => (
              <tr key={promo.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4 text-sm font-semibold text-slate-800">{promo.name}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeColors[promo.type] ?? "bg-slate-100 text-slate-600"}`}>
                    {promo.type}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{promo.discount}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{promo.appliesTo}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{promo.startDate}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{promo.endDate}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{promo.ordersUsed.toLocaleString()}</td>
                <td className="px-4 py-4">
                  <span className={statusBadge(promo.status)}>{promo.status}</span>
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
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-400">No promotions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
