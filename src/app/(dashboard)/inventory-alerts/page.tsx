"use client";

import React, { useCallback, useState } from "react";
import {
  FiBell,
  FiAlertOctagon,
  FiAlertTriangle,
  FiSearch,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiCheck,
  FiCheckCircle,
} from "react-icons/fi";
import { useStockAlerts, useCheckAlerts, useResolveAllAlerts, useResolveAlert } from "@/hooks/useInventory";
import type { InventoryListParams } from "@/types/inventory.types";
import InventoryAlertTable from "@/features/inventory/components/InventoryAlertTable";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function InventoryAlertsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "unresolved";

  const params: InventoryListParams = { page, limit };
  if (search) params.search = search;
  if (status) params.status = status;

  const { data, isLoading, error, refetch } = useStockAlerts(params);
  const { mutate: checkAlerts, isPending: isChecking } = useCheckAlerts();
  const { mutate: resolveAll, isPending: isResolvingAll } = useResolveAllAlerts();
  const { mutate: resolveAlert, isPending: isResolving } = useResolveAlert();
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const allItems = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const criticalCount = allItems.filter((a) => a.alertType === "OUT_OF_STOCK").length;
  const warningCount = allItems.filter((a) => a.alertType === "LOW_STOCK").length;

  const updateParams = useCallback((updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    router.push(`${pathname}?${next.toString()}`);
  }, [searchParams, router, pathname]);

  const goToPage = (p: number) => updateParams({ page: String(p) });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Inventory Alerts</h1>
          <p className="text-sm text-slate-500">Stay ahead of stock issues with real-time low stock and out-of-stock alerts.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => checkAlerts()}
            disabled={isChecking}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`size-4 ${isChecking ? "animate-spin" : ""}`} /> Check Alerts
          </button>
          <button
            onClick={() => resolveAll()}
            disabled={isResolvingAll}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <FiCheckCircle className="size-4" /> Resolve All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiBell className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Alerts</p>
            <p className="text-2xl font-bold text-slate-800">{total}</p>
            <p className="text-xs text-slate-500 mt-0.5">requiring action</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
            <FiAlertOctagon className="size-6 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Critical (Out of Stock)</p>
            <p className="text-2xl font-bold text-slate-800">{criticalCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">zero stock items</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <FiAlertTriangle className="size-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Warning (Low Stock)</p>
            <p className="text-2xl font-bold text-slate-800">{warningCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">below threshold</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search by variant SKU..."
            value={search}
            onChange={(e) => updateParams({ search: e.target.value, page: "1" })}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={status}
          onChange={(e) => updateParams({ status: e.target.value, page: "1" })}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="unresolved">Unresolved</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading alerts...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load alerts</p>
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
          <InventoryAlertTable
            items={allItems}
            onResolve={(id) => { setResolvingId(id); resolveAlert(id, { onSettled: () => setResolvingId(null) }); }}
            resolvingId={resolvingId}
          />
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
