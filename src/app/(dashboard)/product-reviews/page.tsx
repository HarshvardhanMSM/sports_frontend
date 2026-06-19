"use client";

import React, { useState } from "react";
import {
  FiStar,
  FiThumbsUp,
  FiClock,
  FiAlertTriangle,
  FiSearch,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination/Pagination";

interface Review {
  id: string;
  product: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
}

const REVIEWS: Review[] = [
  { id: "rev-1", product: "Nike Air Zoom Pegasus 40", customer: "James Wilson", rating: 5, comment: "Absolutely love these shoes! Great cushioning for long runs.", date: "2026-06-10", status: "Approved" },
  { id: "rev-2", product: "Adidas Tiro Training Pants", customer: "Sarah Chen", rating: 4, comment: "Good quality fabric, fits true to size. Fast delivery too.", date: "2026-06-09", status: "Approved" },
  { id: "rev-3", product: "Puma Future Ultimate FG", customer: "Marco Rossi", rating: 5, comment: "Best cleats I've owned. Excellent grip and lightweight.", date: "2026-06-08", status: "Approved" },
  { id: "rev-4", product: "Under Armour Compression Tee", customer: "Emily Davis", rating: 3, comment: "Decent shirt but runs a bit small. Order a size up.", date: "2026-06-07", status: "Pending" },
  { id: "rev-5", product: "Nike Elite Basketball Socks", customer: "Tom Johnson", rating: 2, comment: "They wore out after 2 months. Expected more from Nike.", date: "2026-06-06", status: "Pending" },
  { id: "rev-6", product: "Nike Air Zoom Pegasus 40", customer: "Aisha Patel", rating: 5, comment: "Perfect for my marathon training. Super responsive!", date: "2026-06-05", status: "Approved" },
  { id: "rev-7", product: "Puma Future Ultimate FG", customer: "Carlos Mendez", rating: 1, comment: "Wrong size sent, very disappointed with the order process.", date: "2026-06-04", status: "Flagged" },
  { id: "rev-8", product: "Adidas Tiro Training Pants", customer: "Rachel Kim", rating: 4, comment: "Great pants for training. Love the ankle zip feature.", date: "2026-06-03", status: "Approved" },
  { id: "rev-9", product: "Under Armour Compression Tee", customer: "David Brown", rating: 5, comment: "Best compression shirt for intense workouts. Stays cool.", date: "2026-06-02", status: "Approved" },
  { id: "rev-10", product: "Nike Elite Basketball Socks", customer: "Lisa Zhang", rating: 3, comment: "Decent socks but nothing special. Just average quality.", date: "2026-06-01", status: "Pending" },
];

const PAGE_SIZE = 5;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          className={`size-3.5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Approved") {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">{status}</span>;
  }
  if (status === "Pending") {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">{status}</span>;
  }
  if (status === "Flagged") {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">{status}</span>;
  }
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{status}</span>;
}

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + "..." : str;
}

export default function ProductReviewsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = REVIEWS.filter((r) => {
    const matchSearch =
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || r.status === filter;
    return matchSearch && matchFilter;
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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Product Reviews</h1>
          <p className="text-sm text-slate-500">Moderate and manage customer reviews across your product catalog.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiStar className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reviews</p>
            <p className="text-2xl font-bold text-slate-800">234</p>
            <p className="text-xs text-slate-500 mt-0.5">all time</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiThumbsUp className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Rating</p>
            <p className="text-2xl font-bold text-slate-800">4.3★</p>
            <p className="text-xs text-slate-500 mt-0.5">across all products</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <FiClock className="size-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Approval</p>
            <p className="text-2xl font-bold text-slate-800">18</p>
            <p className="text-xs text-slate-500 mt-0.5">awaiting review</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
            <FiAlertTriangle className="size-6 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Flagged</p>
            <p className="text-2xl font-bold text-slate-800">5</p>
            <p className="text-xs text-slate-500 mt-0.5">need attention</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search by product or customer..."
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
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Flagged">Flagged</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Comment</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">No reviews found.</td>
              </tr>
            ) : (
              paginated.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-slate-800 max-w-[180px]">{rev.product}</td>
                  <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">{rev.customer}</td>
                  <td className="px-4 py-4"><StarRating rating={rev.rating} /></td>
                  <td className="px-4 py-4 text-sm text-slate-500 max-w-[240px]">{truncate(rev.comment, 60)}</td>
                  <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">{rev.date}</td>
                  <td className="px-4 py-4"><StatusBadge status={rev.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button className="rounded-lg p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Approve">
                        <FiCheck className="size-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                        <FiTrash2 className="size-4" />
                      </button>
                    </div>
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
