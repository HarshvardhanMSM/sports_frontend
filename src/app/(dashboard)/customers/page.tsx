"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import {
  FiUsers,
  FiUserCheck,
  FiUserPlus,
  FiSearch,
  FiEye,
  FiHeart,
  FiAlertCircle,
} from "react-icons/fi";
import { useCustomers, useCustomerStats } from "@/hooks/useCustomers";
import type { CustomerListParams } from "@/types/customer.types";
import CustomerWishlistDrawer from "@/features/customers/components/CustomerWishlistDrawer";
import Pagination from "@/components/ui/pagination/Pagination";

function getInitials(first: string, last: string) {
  return (first[0] ?? "").toUpperCase() + (last[0] ?? "").toUpperCase();
}

const AVATAR_COLORS = [
  "from-indigo-500 to-violet-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
];

export default function CustomersPage() {
  const router = useRouter();
  const { query, setQuery, debouncedQuery } = useFuzzySearch(null, {
    keys: [],
    isServerSide: true,
  });
  const [isActive, setIsActive] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState("");
  const [page, setPage] = useState(1);
  const [wishlistTarget, setWishlistTarget] = useState<{ id: string; name: string } | null>(null);

  const params: CustomerListParams = { page, limit: 10 };
  if (debouncedQuery) params.search = debouncedQuery;

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);
  if (isActive) params.isActive = isActive === "true";
  if (isEmailVerified) params.isEmailVerified = isEmailVerified === "true";

  const { data, isLoading, error, refetch } = useCustomers(params);
  const { data: statsData } = useCustomerStats();

  const stats = statsData?.data;
  const raw = data?.data;
  const isPaginated = raw != null && !Array.isArray(raw);
  const allItems = Array.isArray(raw) ? raw : (raw?.items ?? []);
  const total = isPaginated ? (raw?.total ?? 0) : allItems.length;
  const totalPages = Math.max(1, Math.ceil(total / 10));

  // Search debouncing handled by useFuzzySearch hook

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <FiAlertCircle className="size-10 text-rose-500 mb-4" />
          <p className="text-sm font-semibold text-slate-800">Failed to load customers</p>
          <button onClick={() => refetch()} className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Customer Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-sm text-slate-500 mt-0.5">View and manage your customer base, accounts, and purchase history.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br from-indigo-500 to-indigo-600 opacity-5" />
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-sm mb-3">
            <FiUsers className="size-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats?.totalCustomers ?? "-"}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Total Customers</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-5" />
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm mb-3">
            <FiUserCheck className="size-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats?.activeCustomers ?? "-"}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Active Customers</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br from-blue-500 to-blue-600 opacity-5" />
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm mb-3">
            <FiUsers className="size-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats?.verifiedCustomers ?? "-"}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Verified Customers</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br from-violet-500 to-violet-600 opacity-5" />
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-sm mb-3">
            <FiUserPlus className="size-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats?.newThisMonth ?? "-"}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">New This Month</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br from-amber-500 to-amber-600 opacity-5" />
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm mb-3">
            <FiUserPlus className="size-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats?.newToday ?? "-"}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">New Today</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
          />
        </div>
        <select
          value={isActive}
          onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 hover:bg-white transition-all"
        >
          <option value="">All Statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <select
          value={isEmailVerified}
          onChange={(e) => { setIsEmailVerified(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 hover:bg-white transition-all"
        >
          <option value="">All Verified</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading customers...</p>
        </div>
      ) : allItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <FiUsers className="size-6 text-slate-400" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">No customers found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer ID</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email Verified</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Created Date</th>
                    <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allItems.map((c) => (
                    <tr key={c.id} className="group hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 text-xs font-mono text-slate-500">{c.id.slice(0, 8)}...</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${AVATAR_COLORS[0]} text-xs font-bold text-white shadow-sm`}>
                            {getInitials(c.firstName, c.lastName)}
                          </div>
                          <span className="text-sm font-semibold text-slate-800">{c.firstName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">{c.lastName}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{c.email}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{c.mobile ?? "-"}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          c.isEmailVerified
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {c.isEmailVerified ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${
                          c.isActive
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-slate-100 text-slate-600 ring-slate-200"
                        }`}>
                          <span className={`size-1.5 rounded-full ${c.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => router.push(`/customers/${c.id}`)}
                            className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          >
                            <FiEye className="size-4" />
                          </button>
                          <button
 onClick={() => setWishlistTarget({ id: c.id, name: `${c.firstName} ${c.lastName}` })}
 className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
 title="View Wishlist"
                          >
                            <FiHeart className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={10}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {wishlistTarget && (
        <CustomerWishlistDrawer
          customerId={wishlistTarget.id}
          customerName={wishlistTarget.name}
          onClose={() => setWishlistTarget(null)}
        />
      )}
    </div>
  );
}
