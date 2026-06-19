// ─────────────────────────────────────────────────────────────────
// DASHBOARD TYPES
// ─────────────────────────────────────────────────────────────────

// ── Filter / Param Types ─────────────────────────────────────────

/** Global period selector — top-right of dashboard, drives all KPI cards. */
export type GlobalPeriod = "7d" | "30d" | "this_month" | "this_year";

/** Granularity for line / area / bar time-series charts. */
export type ChartGranularity = "daily" | "weekly" | "monthly";

/** Short period toggle used on donut charts. */
export type ChartPeriod = "this_week" | "this_month";

/** Granularity for the Signups bar chart (daily or weekly only). */
export type SignupsGranularity = "daily" | "weekly";

// ── KPI Summary ──────────────────────────────────────────────────

/** A single sparkline metric card.  `sparkline` is always 7 points. */
export interface KpiMetric {
  value: number;
  changePercent: number;
  direction: "up" | "down" | "neutral";
  sparkline: number[];
}

export interface DashboardSummaryResponse {
  totalSales: KpiMetric;      // USD
  totalOrders: KpiMetric;     // count
  totalUsers: KpiMetric;      // count
  newUsers: KpiMetric;        // count
  conversionRate: KpiMetric;  // percentage e.g. 2.85
  avgOrderValue: KpiMetric;   // USD
}

// ── Sales Overview Chart ─────────────────────────────────────────

export interface SalesOverviewResponse {
  /** X-axis labels e.g. ["15 May", "16 May", …] */
  categories: string[];
  /** Revenue for current period (This Week / This Month / This Year) */
  currentPeriod: number[];
  /** Revenue for previous period (Last Week / Last Month / Last Year) */
  previousPeriod: number[];
}

// ── Sales by Category ────────────────────────────────────────────

export interface SalesCategoryItem {
  label: string;       // e.g. "T-Shirts"
  percentage: number;  // 0–100, fed directly into donut series
  revenue: number;     // USD
}

export interface SalesByCategoryResponse {
  data: SalesCategoryItem[];
}

// ── Sales by Payment ─────────────────────────────────────────────

export interface SalesPaymentItem {
  label: string;
  percentage: number;
  revenue: number;
}

export interface SalesByPaymentResponse {
  data: SalesPaymentItem[];
}

// ── Users Overview Chart ─────────────────────────────────────────

export interface UsersOverviewResponse {
  categories: string[];
  totalUsers: number[];
  newUsers: number[];
}

// ── Users by Source ──────────────────────────────────────────────

export interface UsersSourceItem {
  label: string;
  percentage: number;
  count: number;   // raw count shown in legend
}

export interface UsersBySourceResponse {
  data: UsersSourceItem[];
}

// ── Signups Bar Chart ────────────────────────────────────────────

export interface SignupsResponse {
  categories: string[];
  signups: number[];
}

// ── Top Products Table ───────────────────────────────────────────

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
}

export interface TopProductsResponse {
  products: TopProduct[];
}

// ── Recent Orders Table ──────────────────────────────────────────

export type OrderStatus = "Paid" | "Pending" | "Failed" | "Refunded";

export interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;  // ISO 8601 — displayed as "10 min ago"
}

export interface RecentOrdersResponse {
  orders: RecentOrder[];
}
