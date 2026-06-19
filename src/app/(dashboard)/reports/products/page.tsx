"use client";

import React, { useState } from "react";
import {
  FiShoppingBag,
  FiStar,
  FiTrendingUp,
  FiActivity,
  FiDownload,
  FiSearch,
} from "react-icons/fi";

interface ProductPerformance {
  rank: number;
  product: string;
  sku: string;
  views: number;
  addToCart: number;
  unitsSold: number;
  revenue: number;
  conversionRate: string;
  rating: number;
}

const allProducts: ProductPerformance[] = [
  { rank: 1, product: "Nike Air Zoom Pegasus 40", sku: "NK-PEG40-001", views: 4560, addToCart: 890, unitsSold: 234, revenue: 27060.00, conversionRate: "5.1%", rating: 4.8 },
  { rank: 2, product: "Adidas Tiro Training Pants", sku: "AD-TR-PANTS-09", views: 3890, addToCart: 756, unitsSold: 456, revenue: 20520.00, conversionRate: "11.7%", rating: 4.5 },
  { rank: 3, product: "Puma Future Ultimate FG", sku: "PM-FUT-ULT-02", views: 2340, addToCart: 456, unitsSold: 89, revenue: 17380.00, conversionRate: "3.8%", rating: 4.6 },
  { rank: 4, product: "Under Armour Compression Tee", sku: "UA-COMP-01", views: 2890, addToCart: 623, unitsSold: 312, revenue: 10920.00, conversionRate: "10.8%", rating: 4.3 },
  { rank: 5, product: "Nike Elite Basketball Socks", sku: "NK-ELITE-SOCK-BK", views: 5670, addToCart: 1230, unitsSold: 890, revenue: 12460.00, conversionRate: "15.7%", rating: 3.9 },
  { rank: 6, product: "Adidas Ultraboost 22", sku: "AD-UB22-007", views: 1890, addToCart: 340, unitsSold: 67, revenue: 12060.00, conversionRate: "3.5%", rating: 4.7 },
  { rank: 7, product: "Nike Dri-FIT Training Shorts", sku: "NK-DRFT-SH-03", views: 2100, addToCart: 445, unitsSold: 189, revenue: 7938.00, conversionRate: "9.0%", rating: 4.4 },
  { rank: 8, product: "Puma Gym Bag Pro", sku: "PM-GYMBAG-001", views: 890, addToCart: 156, unitsSold: 78, revenue: 5070.00, conversionRate: "8.8%", rating: 4.2 },
  { rank: 9, product: "Under Armour Running Cap", sku: "UA-CAP-RUN-02", views: 670, addToCart: 89, unitsSold: 34, revenue: 952.00, conversionRate: "5.1%", rating: 4.0 },
  { rank: 10, product: "Nike Zoom Fly 5", sku: "NK-ZF5-010", views: 1340, addToCart: 234, unitsSold: 56, revenue: 7280.00, conversionRate: "4.2%", rating: 4.5 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <FiStar className="size-3.5 text-amber-400 fill-amber-400" />
      <span className="text-sm font-semibold text-slate-700">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductPerformancePage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [search, setSearch] = useState("");

  const filtered = allProducts.filter((p) =>
    p.product.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Product Performance</h1>
          <p className="text-sm text-slate-500">Analyze product-level sales metrics, ratings, and conversion rates.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            <FiDownload className="size-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiShoppingBag className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Products</p>
            <p className="text-2xl font-bold text-slate-800">156</p>
            <p className="text-xs text-slate-500 mt-0.5">Active in catalog</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <FiStar className="size-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Rating</p>
            <p className="text-2xl font-bold text-slate-800">4.3★</p>
            <p className="text-xs text-slate-500 mt-0.5">Across all products</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiTrendingUp className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Earner</p>
            <p className="text-2xl font-bold text-slate-800">$27,060</p>
            <p className="text-xs text-slate-500 mt-0.5">Nike Air Zoom Pegasus 40</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiActivity className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Conversion Rate</p>
            <p className="text-2xl font-bold text-slate-800">3.8%</p>
            <p className="text-xs text-slate-500 mt-0.5">Views to purchase</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <p className="text-xs text-slate-500 ml-auto">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {allProducts.length} products
        </p>
      </div>

      {/* Product Performance Table */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">Product Performance Overview</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Views</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Add to Cart</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Units Sold</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue ($)</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Conv. Rate</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">
                    No products match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.rank} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-4">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                        {row.rank}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-slate-700">{row.product}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{row.sku}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{row.views.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{row.addToCart.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{row.unitsSold.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">${row.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        {row.conversionRate}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StarRating rating={row.rating} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
