/**
 * ─────────────────────────────────────────────────────────────────
 * DASHBOARD SERVICE + QUERY KEYS
 *
 * Query keys follow the factory pattern — always arrays, always
 * include all params so TanStack Query caches correctly.
 * ─────────────────────────────────────────────────────────────────
 */

import { api } from "./api";
import type {
  GlobalPeriod,
  ChartGranularity,
  ChartPeriod,
  SignupsGranularity,
  DashboardSummaryResponse,
  SalesOverviewResponse,
  SalesByCategoryResponse,
  SalesByPaymentResponse,
  UsersOverviewResponse,
  UsersBySourceResponse,
  SignupsResponse,
  TopProductsResponse,
  RecentOrdersResponse,
} from "@/types/dashboard.types";

// ── Query Key Factory ─────────────────────────────────────────────
// Use these as `queryKey` in every useQuery / useMutation call.
// Nested structure enables bulk invalidation:
//   queryClient.invalidateQueries({ queryKey: dashboardKeys.all() })

export const dashboardKeys = {
  all: ()                              => ["dashboard"]                              as const,
  summary:        (period: GlobalPeriod)       => ["dashboard", "summary",          period]       as const,
  salesOverview:  (g: ChartGranularity)        => ["dashboard", "sales-overview",   g]            as const,
  byCategory:     (period: ChartPeriod)        => ["dashboard", "sales-by-category",period]       as const,
  byPayment:      (period: ChartPeriod)        => ["dashboard", "sales-by-payment", period]       as const,
  usersOverview:  (g: ChartGranularity)        => ["dashboard", "users-overview",   g]            as const,
  bySource:       (period: ChartPeriod)        => ["dashboard", "users-by-source",  period]       as const,
  signups:        (g: SignupsGranularity)       => ["dashboard", "signups",          g]            as const,
  topProducts:    ()                           => ["dashboard", "top-products"]                   as const,
  recentOrders:   ()                           => ["dashboard", "recent-orders"]                  as const,
};

// ── API Functions ─────────────────────────────────────────────────

export const DashboardService = {
  /** API 1 — KPI summary cards.  GET /api/dashboard/summary?period=... */
  getSummary(period: GlobalPeriod) {
    return api.get<DashboardSummaryResponse>("/api/dashboard/summary", { period });
  },

  /**
   * API 2 — Sales overview line chart.
   * GET /api/dashboard/sales-overview?granularity=...
   *
   * granularity | points | x-axis
   * ----------- | ------ | ------
   * daily       | 7      | "15 May", …
   * weekly      | 4      | "Week 1", …
   * monthly     | 12     | "Jan", …
   */
  getSalesOverview(granularity: ChartGranularity) {
    return api.get<SalesOverviewResponse>("/api/dashboard/sales-overview", { granularity });
  },

  /** API 3 — Sales by category donut.  GET /api/dashboard/sales-by-category?period=... */
  getSalesByCategory(period: ChartPeriod) {
    return api.get<SalesByCategoryResponse>("/api/dashboard/sales-by-category", { period });
  },

  /** API 4 — Sales by payment method donut.  GET /api/dashboard/sales-by-payment?period=... */
  getSalesByPayment(period: ChartPeriod) {
    return api.get<SalesByPaymentResponse>("/api/dashboard/sales-by-payment", { period });
  },

  /** API 5 — Users area chart.  GET /api/dashboard/users-overview?granularity=... */
  getUsersOverview(granularity: ChartGranularity) {
    return api.get<UsersOverviewResponse>("/api/dashboard/users-overview", { granularity });
  },

  /** API 6 — Users by source donut.  GET /api/dashboard/users-by-source?period=... */
  getUsersBySource(period: ChartPeriod) {
    return api.get<UsersBySourceResponse>("/api/dashboard/users-by-source", { period });
  },

  /** API 7 — New signups bar chart.  GET /api/dashboard/signups?granularity=... */
  getSignups(granularity: SignupsGranularity) {
    return api.get<SignupsResponse>("/api/dashboard/signups", { granularity });
  },

  /** API 8 — Top products table (no filter).  GET /api/dashboard/top-products */
  getTopProducts() {
    return api.get<TopProductsResponse>("/api/dashboard/top-products");
  },

  /** API 9 — Recent orders table (no filter).  GET /api/dashboard/recent-orders */
  getRecentOrders() {
    return api.get<RecentOrdersResponse>("/api/dashboard/recent-orders");
  },
};
