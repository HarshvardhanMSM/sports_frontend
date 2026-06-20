"use client";

import React from "react";
import {
  FiHeart,
  FiShoppingBag,
  FiBarChart2,
  FiTrendingUp,
} from "react-icons/fi";
import { useCustomerStats } from "@/hooks/useCustomers";

export default function WishlistAnalyticsPage() {
  const { data: statsData } = useCustomerStats();
  const stats = statsData?.data;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Wishlist Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Understand customer intent by analyzing wishlisted products and
            conversion patterns. View per-customer wishlists from the{" "}
            <a href="/customers" className="text-indigo-600 hover:underline">
              Customers
            </a>{" "}
            page.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiHeart className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Customers</p>
            <p className="text-2xl font-bold text-slate-800">{stats?.totalCustomers ?? "-"}</p>
            <p className="text-xs text-slate-500 mt-0.5">Registered accounts</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiShoppingBag className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Customers</p>
            <p className="text-2xl font-bold text-slate-800">{stats?.activeCustomers ?? "-"}</p>
            <p className="text-xs text-slate-500 mt-0.5">Active in last 90 days</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiBarChart2 className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">New This Month</p>
            <p className="text-2xl font-bold text-slate-800">{stats?.newThisMonth ?? "-"}</p>
            <p className="text-xs text-slate-500 mt-0.5">New registrations</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
            <FiTrendingUp className="size-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">New Today</p>
            <p className="text-2xl font-bold text-slate-800">{stats?.newToday ?? "-"}</p>
            <p className="text-xs text-slate-500 mt-0.5">Today&apos;s signups</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <FiHeart className="size-6 text-slate-400" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Per-Customer Wishlist Data</h3>
        <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto">
          View individual customer wishlists by navigating to the Customers page and clicking the heart icon on any customer row.
        </p>
        <a
          href="/customers"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Go to Customers
        </a>
      </div>
    </div>
  );
}
