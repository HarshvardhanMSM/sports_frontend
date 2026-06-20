import { api } from "./api";
import type {
  GlobalPeriod,
  ChartGranularity,
  ChartPeriod,
  SignupsGranularity,
  DashboardSummaryResponse,
  SalesOverviewResponse,
  SalesCategoryItem,
  SalesPaymentItem,
  UsersOverviewResponse,
  UsersBySourceResponse,
  SignupsResponse,
  TopProductsResponse,
  RecentOrdersResponse,
} from "@/types/dashboard.types";

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export const dashboardKeys = {
  all:              ()                                  => ["dashboard"]                                  as const,
  summary:          (period: GlobalPeriod)              => ["dashboard", "summary",          period]       as const,
  salesOverview:    (g: ChartGranularity)               => ["dashboard", "sales-overview",   g]            as const,
  byCategory:       (period: ChartPeriod)               => ["dashboard", "sales-by-category",period]       as const,
  byPayment:        (period: ChartPeriod)               => ["dashboard", "sales-by-payment", period]       as const,
  usersOverview:    (g: ChartGranularity)               => ["dashboard", "users-overview",   g]            as const,
  bySource:         (period: ChartPeriod)               => ["dashboard", "users-by-source",  period]       as const,
  signups:          (g: SignupsGranularity)              => ["dashboard", "signups",          g]            as const,
  topProducts:      ()                                  => ["dashboard", "top-products"]                   as const,
  recentOrders:     ()                                  => ["dashboard", "recent-orders"]                  as const,
};

export const DashboardService = {
  async getSummary(period: GlobalPeriod): Promise<DashboardSummaryResponse> {
    const res = await api.get<ApiResponse<DashboardSummaryResponse>>("/dashboard/summary", { period });
    return res.data;
  },

  async getSalesOverview(granularity: ChartGranularity): Promise<SalesOverviewResponse> {
    const res = await api.get<ApiResponse<SalesOverviewResponse>>("/dashboard/sales-overview", { granularity });
    return res.data;
  },

  async getSalesByCategory(period: ChartPeriod): Promise<SalesCategoryItem[]> {
    const res = await api.get<ApiResponse<SalesCategoryItem[]>>("/dashboard/sales-by-category", { period });
    return res.data;
  },

  async getSalesByPayment(period: ChartPeriod): Promise<SalesPaymentItem[]> {
    const res = await api.get<ApiResponse<SalesPaymentItem[]>>("/dashboard/sales-by-payment", { period });
    return res.data;
  },

  async getUsersOverview(granularity: ChartGranularity): Promise<UsersOverviewResponse> {
    const res = await api.get<ApiResponse<UsersOverviewResponse>>("/dashboard/users-overview", { granularity });
    return res.data;
  },

  async getUsersBySource(period: ChartPeriod): Promise<UsersBySourceResponse> {
    const res = await api.get<ApiResponse<UsersBySourceResponse>>("/dashboard/users-by-source", { period });
    return res.data;
  },

  async getSignups(granularity: SignupsGranularity): Promise<SignupsResponse> {
    const res = await api.get<ApiResponse<SignupsResponse>>("/dashboard/signups", { granularity });
    return res.data;
  },

  async getTopProducts(): Promise<TopProductsResponse> {
    const res = await api.get<ApiResponse<TopProductsResponse>>("/dashboard/top-products");
    return res.data;
  },

  async getRecentOrders(): Promise<RecentOrdersResponse> {
    const res = await api.get<ApiResponse<RecentOrdersResponse>>("/dashboard/recent-orders");
    return res.data;
  },
};
