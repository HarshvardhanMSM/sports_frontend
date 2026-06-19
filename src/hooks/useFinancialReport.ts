"use client";

import { useQuery } from "@tanstack/react-query";
import { FinancialReportService, financialReportKeys } from "@/services/financial-report.service";

export function useFinancialDashboard() {
  return useQuery({
    queryKey: financialReportKeys.dashboard(),
    queryFn: () => FinancialReportService.getDashboard(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRevenueReport(params?: Record<string, string>) {
  return useQuery({
    queryKey: financialReportKeys.revenue(params),
    queryFn: () => FinancialReportService.getRevenue(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useExpenseReport(params?: Record<string, string>) {
  return useQuery({
    queryKey: financialReportKeys.expenses(params),
    queryFn: () => FinancialReportService.getExpenses(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useSettlementReport(params?: Record<string, string>) {
  return useQuery({
    queryKey: financialReportKeys.settlements(params),
    queryFn: () => FinancialReportService.getSettlements(params),
    staleTime: 2 * 60 * 1000,
  });
}
