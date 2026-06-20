// ── Filter / Param Types ─────────────────────────────────────────

export type GlobalPeriod = "7d" | "30d" | "this_month" | "this_year";
export type ChartGranularity = "daily" | "weekly" | "monthly";
export type ChartPeriod = "this_week" | "this_month";
export type SignupsGranularity = "daily" | "weekly";

// ── KPI Summary (data.totalSales etc.) ──────────────────────────

export interface KpiMetric {
  value: number;
  changePercent: number;
  direction: "up" | "down";
  sparkline: number[];
}

export interface DashboardSummaryResponse {
  totalSales: KpiMetric;
  totalOrders: KpiMetric;
  totalUsers: KpiMetric;
  newUsers: KpiMetric;
  conversionRate: KpiMetric;
  avgOrderValue: KpiMetric;
}

// ── Sales Overview Chart ────────────────────────────────────────

export interface SalesOverviewResponse {
  categories: string[];
  currentPeriod: number[];
  previousPeriod: number[];
}

// ── Sales by Category / Payment ─────────────────────────────────

export interface SalesCategoryItem {
  label: string;
  percentage: number;
  revenue: number;
}

export interface SalesPaymentItem {
  label: string;
  percentage: number;
  revenue: number;
}

// ── Users Overview Chart ────────────────────────────────────────

export interface UsersOverviewResponse {
  categories: string[];
  totalUsers: number[];
  newUsers: number[];
}

// ── Users by Source ─────────────────────────────────────────────

export interface UsersSourceItem {
  label: string;
  percentage: number;
  count: number;
}

export interface UsersBySourceResponse {
  data: UsersSourceItem[];
}

// ── Signups Bar Chart ───────────────────────────────────────────

export interface SignupsResponse {
  categories: string[];
  signups: number[];
}

// ── Top Products Table ──────────────────────────────────────────

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  unitsSold: number;
  revenue: number;
}

export interface TopProductsResponse {
  products: TopProduct[];
}

// ── Recent Orders Table ─────────────────────────────────────────

export type OrderStatus = "Paid" | "Pending" | "Failed" | "Refunded";

export interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface RecentOrdersResponse {
  orders: RecentOrder[];
}
