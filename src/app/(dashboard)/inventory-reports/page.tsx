"use client";

import React from "react";
import {
  FiDollarSign,
  FiRefreshCw,
  FiAlertTriangle,
  FiArchive,
  FiDownload,
  FiAlertCircle,
} from "react-icons/fi";
import { useInventoryReport, useInventoryAnalyticsSummary, useSlowMovingItems } from "@/hooks/useInventory";
import type { SlowMovingItem } from "@/types/inventory.types";

export default function InventoryReportsPage() {
  const { data: reportData, isLoading: reportLoading, error: reportError, refetch: refetchReport } = useInventoryReport();
  const { data: analyticsData, isLoading: analyticsLoading } = useInventoryAnalyticsSummary();
  const { data: slowMoving, isLoading: slowLoading } = useSlowMovingItems();

  const isLoading = reportLoading || analyticsLoading || slowLoading;
  const error = reportError;

  const summary = analyticsData?.data;
  const report = reportData;
  const slowItems = slowMoving ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Inventory Reports</h1>
            <p className="text-sm text-slate-500">Comprehensive inventory valuation, turnover, and performance analysis.</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Inventory Reports</h1>
            <p className="text-sm text-slate-500">Comprehensive inventory valuation, turnover, and performance analysis.</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load reports</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={() => refetchReport()}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statsCards = [
    { label: "Total Inventory Value", value: `$${(summary?.totalStockValue ?? report?.totalStockValue ?? 0).toLocaleString()}`, sub: "current stock valuation", icon: FiDollarSign, bg: "from-indigo-500 to-indigo-600" },
    // { label: "Stock Turnover", value:`$${(summary?.activeSuppliers ?? report?.totalInventoryItems ?? 0).toLocaleString()}`, sub: "average annual rate", icon: FiRefreshCw, bg: "from-emerald-500 to-emerald-600" },
    { label: "Items at Risk", value: (summary?.lowStockCount ?? report?.lowStockItems ?? 0) + (summary?.outOfStockCount ?? report?.outOfStockItems ?? 0), sub: "low / out of stock", icon: FiAlertTriangle, bg: "from-amber-500 to-amber-600" },
    { label: "Total Stock Units", value: (summary?.totalStockUnits ?? report?.totalInventoryItems ?? 0).toLocaleString(), sub: "total inventory items", icon: FiArchive, bg: "from-rose-500 to-rose-600" },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Inventory Reports</h1>
          <p className="text-sm text-slate-500">Comprehensive inventory valuation, turnover, and performance analysis.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <FiDownload className="size-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map(({ label, value, sub, icon: Icon, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${bg} bg-opacity-10`}>
              <Icon className="size-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {slowItems.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-slate-700 mb-3">Slow-Moving Products</h2>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Movement</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Days Without Sale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(slowItems as SlowMovingItem[]).map((item, i) => (
                  <tr key={item.variantId ?? i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-slate-800">{item.variantSku ?? item.variantId?.slice(0, 12) ?? "N/A"}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{item.productName ?? "-"}</td>
                    <td className="px-4 py-4 text-sm font-bold text-slate-800">{item.currentStock}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {item.lastMovementDate ? new Date(item.lastMovementDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-sm font-semibold ${item.daysWithoutSale > 60 ? "text-red-600" : "text-slate-700"}`}>
                        {item.daysWithoutSale} days
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {report?.lowStock && report.lowStock.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-slate-700 mb-3">Low Stock Items</h2>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Available</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.lowStock.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-slate-800">{item.variantSku ?? item.variantId?.slice(0, 12) ?? "N/A"}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{item.quantity}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{item.availableQuantity}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{item.lowStockThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
