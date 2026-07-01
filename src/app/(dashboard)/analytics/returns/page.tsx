"use client";

import React from "react";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { useReturnSummary, useReturnReasons, useReturnProducts, useReturnRefunds } from "@/hooks/useReturnAnalytics";
import ReturnSummaryCards from "@/features/analytics/returns/components/ReturnSummaryCards";
import ReturnReasonsChart from "@/features/analytics/returns/components/ReturnReasonsChart";
import ReturnedProductsTable from "@/features/analytics/returns/components/ReturnedProductsTable";
import RefundAnalyticsChart from "@/features/analytics/returns/components/RefundAnalyticsChart";
import ReturnInsights from "@/features/analytics/returns/components/ReturnInsights";

export default function ReturnsAnalyticsPage() {
  const { data: summaryData, isLoading: summaryLoading, error: summaryError, refetch: refetchSummary } = useReturnSummary();
  const { data: reasonsData, isLoading: reasonsLoading } = useReturnReasons();
  const { data: productsData, isLoading: productsLoading } = useReturnProducts();
  const { data: refundsData, isLoading: refundsLoading } = useReturnRefunds();

  const isLoading = summaryLoading || reasonsLoading || productsLoading || refundsLoading;
  const hasError = summaryError;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Returns Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Returns Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">Business intelligence dashboard for returns, refunds, and revenue impact.</p>
        </div>
        <button
          onClick={() => { refetchSummary(); }}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all"
        >
          <FiRefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error State */}
      {hasError ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load analytics</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={() => refetchSummary()}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <ReturnSummaryCards data={summaryData?.data} isLoading={summaryLoading} />

          {/* Return Reasons + Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReturnReasonsChart data={reasonsData?.data} isLoading={reasonsLoading} />
            </div>
            <div>
              <ReturnInsights
                summary={summaryData?.data}
                reasons={reasonsData?.data}
                products={productsData?.data}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Most Returned Products */}
          <ReturnedProductsTable data={productsData?.data} isLoading={productsLoading} />

          {/* Refund Analytics */}
          <RefundAnalyticsChart data={refundsData?.data} summary={summaryData?.data} isLoading={refundsLoading} />
        </>
      )}
    </div>
  );
}
