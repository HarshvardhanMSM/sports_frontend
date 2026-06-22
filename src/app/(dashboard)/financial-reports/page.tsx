"use client";

import React, { useState, useMemo, useCallback } from "react";
import { FiRefreshCw, FiAlertCircle, FiBarChart2 } from "react-icons/fi";
import { useFinancialDashboard, useRevenueReport, useExpenseReport, useSettlementReport } from "@/hooks/useFinancialReport";
import type { DateRange } from "@/types/financial-report.types";
import FinancialKPICards from "@/components/finance/FinancialKPICards";
import DateRangeFilter from "@/components/finance/DateRangeFilter";
import RevenueChart from "@/components/finance/RevenueChart";
import ExpenseChart from "@/components/finance/ExpenseChart";
import SettlementChart from "@/components/finance/SettlementChart";
import RevenueTable from "@/components/finance/RevenueTable";
import ExpenseTable from "@/components/finance/ExpenseTable";
import SettlementTable from "@/components/finance/SettlementTable";

function toDateParam(d: DateRange): Record<string, string> {
  return { dateFrom: d.from, dateTo: d.to };
}

export default function FinancialReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>(() => ({
    preset: "last30",
    from: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
  }));

  const dateParams = useMemo(() => toDateParam(dateRange), [dateRange]);

  const { data: dashboard, isLoading: dashLoading, error: dashError, refetch: refetchDash } = useFinancialDashboard();
  const { data: revenue, isLoading: revLoading, error: revError, refetch: refetchRev } = useRevenueReport(dateParams);
  const { data: expenses, isLoading: expLoading, error: expError, refetch: refetchExp } = useExpenseReport(dateParams);
  const { data: settlements, isLoading: stlLoading, error: stlError, refetch: refetchStl } = useSettlementReport(dateParams);

  const kpiData = useMemo(() => {
    const grossRevenue = dashboard?.grossRevenue ?? 0;
    const totalExpenses = dashboard?.totalExpenses ?? 0;
    const netProfit = dashboard?.netProfit ?? 0;
    const totalRefunds = dashboard?.totalRefunds ?? 0;
    const totalSettlements = settlements?.reduce((sum, i) => sum + (i.total ?? 0), 0) ?? 0;
    const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
    return { grossRevenue, totalExpenses, netProfit, totalRefunds, totalSettlements, profitMargin, revenueGrowth: 0 };
  }, [dashboard, settlements]);

  const isLoading = dashLoading || revLoading || expLoading || stlLoading;
  const hasError = dashError || revError || expError || stlError;

  const handleRefresh = useCallback(() => {
    refetchDash(); refetchRev(); refetchExp(); refetchStl();
  }, [refetchDash, refetchRev, refetchExp, refetchStl]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Finance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">Revenue, expenses, and settlement analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            <FiRefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {hasError && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3">
          <FiAlertCircle className="size-5 text-rose-500 shrink-0" />
          <p className="text-sm font-semibold text-rose-700">Failed to load financial data. Please try again.</p>
        </div>
      )}

      {/* KPI Cards */}
      <FinancialKPICards data={kpiData} isLoading={dashLoading} />

      {/* Section 1: Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenue} isLoading={revLoading} />
        </div>
        <div>
          <RevenueTable data={revenue} isLoading={revLoading} />
        </div>
      </div>

      {/* Section 2: Expense Analytics */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseChart data={expenses} isLoading={expLoading} />
        </div>
        <div>
          <ExpenseTable data={expenses} isLoading={expLoading} />
        </div>
      </div> */}

      {/* Section 3: Settlements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SettlementChart data={settlements} isLoading={stlLoading} />
        </div>
        <div>
          <SettlementTable data={settlements} isLoading={stlLoading} />
        </div>
      </div>

      {/* Empty state when no data at all */}
      {!isLoading && !hasError && !dashboard && !revenue && !expenses && !settlements && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FiBarChart2 className="size-7 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Financial Data Found</h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-sm text-center">
            Select a different date range or check back later for financial data.
          </p>
        </div>
      )}
    </div>
  );
}
