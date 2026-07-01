export interface FinancialDashboard {
  totalRevenue: number;
  totalRefunds: number;
  totalExpenses: number;
  netProfit: number;
  pendingSettlements?: number;
  totalTaxCollected?: number;
  totalTransactions?: number;
}

export interface RevenueItem {
  date: string;
  revenue: number;
  transactions: number;
}

export interface ExpenseItem {
  category: string;
  total: number;
  count: number;
}

export interface SettlementItem {
  status: string;
  total: number;
  count: number;
}

export interface ApiListResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export type DateRangePreset = "today" | "last7" | "last30" | "last90" | "thisMonth" | "thisYear" | "custom";

export interface DateRange {
  from: string;
  to: string;
  preset: DateRangePreset;
}
