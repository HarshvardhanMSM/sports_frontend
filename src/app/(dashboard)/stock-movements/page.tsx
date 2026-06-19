"use client";

import React, { useCallback } from "react";
import {
  FiActivity,
  FiArrowUp,
  FiArrowDown,
  FiTrendingUp,
  FiDownload,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useInventoryMovements } from "@/hooks/useInventory";
import type { InventoryListParams } from "@/types/inventory.types";
import StockMovementTable from "@/features/inventory/components/StockMovementTable";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function StockMovementsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const status = searchParams.get("status") || "";

  const params: InventoryListParams = { page, limit };
  if (status) params.actionType = status;

  const { data, isLoading, error, refetch } = useInventoryMovements(params);

  const allItems = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const updateParams = useCallback((updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    router.push(`${pathname}?${next.toString()}`);
  }, [searchParams, router, pathname]);

  const goToPage = (p: number) => updateParams({ page: String(p) });
  const changeFilter = (v: string) => updateParams(v ? { status: v, page: "1" } : { status: "", page: "1" });

  const todayMovements = allItems.filter((m) => {
    const today = new Date();
    const mDate = new Date(m.createdAt);
    return mDate.toDateString() === today.toDateString();
  }).length;

  const stockIn = allItems.filter((m) => (m.afterQuantity - m.beforeQuantity) > 0).reduce((s, m) => s + (m.afterQuantity - m.beforeQuantity), 0);
  const stockOut = allItems.filter((m) => (m.afterQuantity - m.beforeQuantity) < 0).reduce((s, m) => s + Math.abs(m.afterQuantity - m.beforeQuantity), 0);
  const netChange = stockIn - stockOut;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Stock Movements</h1>
          <p className="text-sm text-slate-500">Track all incoming and outgoing stock movements and adjustments.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white shadow-sm hover:bg-slate-50 transition-colors">
          <FiDownload className="size-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiActivity className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today&apos;s Movements</p>
            <p className="text-2xl font-bold text-slate-800">{todayMovements}</p>
            <p className="text-xs text-slate-500 mt-0.5">as of today</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiArrowUp className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Stock In</p>
            <p className="text-2xl font-bold text-slate-800">+{stockIn}</p>
            <p className="text-xs text-slate-500 mt-0.5">units received (current page)</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
            <FiArrowDown className="size-6 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Stock Out</p>
            <p className="text-2xl font-bold text-slate-800">-{stockOut}</p>
            <p className="text-xs text-slate-500 mt-0.5">units dispatched (current page)</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiTrendingUp className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Net Change</p>
            <p className={`text-2xl font-bold ${netChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {netChange >= 0 ? "+" : ""}{netChange}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">net unit change (current page)</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-sm font-semibold text-slate-600 shrink-0">Filter by Type:</p>
        <select
          value={status}
          onChange={(e) => changeFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="">All Types</option>
          <option value="STOCK_IN">Stock In</option>
          <option value="STOCK_OUT">Stock Out</option>
          <option value="ADJUSTMENT">Adjustment</option>
          <option value="RESERVATION">Reservation</option>
          <option value="RELEASE">Release</option>
          <option value="GOODS_RECEIPT">Goods Receipt</option>
          <option value="MANUAL_ADJUST">Manual Adjust</option>
        </select>
        <span className="text-xs text-slate-400 ml-auto">{total} record{total !== 1 ? "s" : ""}</span>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading movements...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load stock movements</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <StockMovementTable items={allItems} />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pb-4">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                <FiChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                    p === page
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                <FiChevronRight className="size-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
