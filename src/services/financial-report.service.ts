import { api } from "./api";
import type {
  FinancialDashboard,
  RevenueItem,
  ExpenseItem,
  SettlementItem,
  ApiListResponse,
} from "@/types/financial-report.types";

export const financialReportKeys = {
  all:         ()                                => ["financial-reports"]                    as const,
  dashboard:   ()                                => ["financial-reports", "dashboard"]       as const,
  revenue:     (p?: Record<string, string>)       => ["financial-reports", "revenue", p]      as const,
  expenses:    (p?: Record<string, string>)       => ["financial-reports", "expenses", p]     as const,
  settlements: (p?: Record<string, string>)       => ["financial-reports", "settlements", p]  as const,
};

export const FinancialReportService = {
  getDashboard() {
    return api.get<ApiListResponse<FinancialDashboard>>("/admin/financial-reports/dashboard")
      .then((res) => res.data);
  },

  getRevenue(params?: Record<string, string>) {
    return api.get<ApiListResponse<RevenueItem[]>>("/admin/financial-reports/revenue", params)
      .then((res) => res.data);
  },

  getExpenses(params?: Record<string, string>) {
    return api.get<ApiListResponse<ExpenseItem[]>>("/admin/financial-reports/expenses", params)
      .then((res) => res.data);
  },

  getSettlements(params?: Record<string, string>) {
    return api.get<ApiListResponse<SettlementItem[]>>("/admin/financial-reports/settlements", params)
      .then((res) => res.data);
  },
};
