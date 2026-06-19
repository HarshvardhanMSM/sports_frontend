"use client";

import React, { useState } from "react";
import {
  FiRotateCcw,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiSearch,
  FiEye,
  FiCheck,
  FiXCircle,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination/Pagination";

interface Return {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  reason: string;
  amount: number;
  status: string;
  date: string;
}

const RETURNS: Return[] = [
  { id: "RET-0234", orderId: "ORD-2026-0756", customer: "James Wilson", product: "Nike Air Zoom Pegasus 40", reason: "Wrong Size", amount: 130.0, status: "Pending", date: "2026-06-12" },
  { id: "RET-0233", orderId: "ORD-2026-0748", customer: "Sarah Chen", product: "Adidas Tiro Training Pants", reason: "Defective Item", amount: 45.0, status: "Approved", date: "2026-06-11" },
  { id: "RET-0232", orderId: "ORD-2026-0740", customer: "Marco Rossi", product: "Puma Future Ultimate FG", reason: "Not As Described", amount: 220.0, status: "Refunded", date: "2026-06-10" },
  { id: "RET-0231", orderId: "ORD-2026-0732", customer: "Emily Davis", product: "Under Armour Compression Tee", reason: "Changed Mind", amount: 35.0, status: "Rejected", date: "2026-06-09" },
  { id: "RET-0230", orderId: "ORD-2026-0724", customer: "Tom Johnson", product: "Nike Elite Basketball Socks", reason: "Defective Item", amount: 14.0, status: "Approved", date: "2026-06-08" },
  { id: "RET-0229", orderId: "ORD-2026-0716", customer: "Aisha Patel", product: "Nike Air Zoom Pegasus 40", reason: "Damaged in Transit", amount: 130.0, status: "Refunded", date: "2026-06-07" },
  { id: "RET-0228", orderId: "ORD-2026-0708", customer: "Carlos Mendez", product: "Adidas Ultraboost 22", reason: "Wrong Size", amount: 180.0, status: "Pending", date: "2026-06-06" },
  { id: "RET-0227", orderId: "ORD-2026-0700", customer: "Rachel Kim", product: "Puma Future Ultimate FG", reason: "Not As Described", amount: 220.0, status: "Approved", date: "2026-06-05" },
  { id: "RET-0226", orderId: "ORD-2026-0692", customer: "David Brown", product: "Nike Dri-FIT Training Shorts", reason: "Wrong Item Sent", amount: 42.0, status: "Refunded", date: "2026-06-04" },
  { id: "RET-0225", orderId: "ORD-2026-0684", customer: "Lisa Zhang", product: "Under Armour Running Cap", reason: "Wrong Size", amount: 28.0, status: "Pending", date: "2026-06-03" },
];

const PAGE_SIZE = 5;

function statusBadge(status: string) {
  switch (status) {
    case "Approved":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700";
    case "Pending":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700";
    case "Refunded":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700";
    case "Rejected":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700";
    default:
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600";
  }
}

export default function ReturnsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = RETURNS.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || r.status === filter;
    return matchesSearch && matchesFilter;
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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Returns & Refunds</h1>
          <p className="text-sm text-slate-500">Process customer returns, review refund requests, and manage resolutions.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiRotateCcw className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Returns</p>
            <p className="text-2xl font-bold text-slate-800">48</p>
            <p className="text-xs text-slate-500 mt-0.5">All time</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <FiClock className="size-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Review</p>
            <p className="text-2xl font-bold text-slate-800">12</p>
            <p className="text-xs text-slate-500 mt-0.5">Awaiting decision</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiCheckCircle className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Approved</p>
            <p className="text-2xl font-bold text-slate-800">29</p>
            <p className="text-xs text-slate-500 mt-0.5">Returns approved</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiDollarSign className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Refunded</p>
            <p className="text-2xl font-bold text-slate-800">$3,240</p>
            <p className="text-xs text-slate-500 mt-0.5">Amount processed</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search by return ID, customer, or product..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Refunded">Refunded</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Return ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((ret) => (
              <tr key={ret.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4 text-sm font-mono font-semibold text-indigo-600">{ret.id}</td>
                <td className="px-4 py-4 text-sm font-mono text-slate-600">{ret.orderId}</td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-800">{ret.customer}</td>
                <td className="px-4 py-4 text-sm text-slate-700 max-w-[180px] truncate">{ret.product}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{ret.reason}</td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-800">${ret.amount.toFixed(2)}</td>
                <td className="px-4 py-4">
                  <span className={statusBadge(ret.status)}>{ret.status}</span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{ret.date}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-1">
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <FiEye className="size-4" />
                    </button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Approve">
                      <FiCheck className="size-4" />
                    </button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Reject">
                      <FiXCircle className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-400">
                  No returns found matching your criteria.
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
