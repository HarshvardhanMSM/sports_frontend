import { api } from "./api";
import type {
  ReturnSummaryResponse,
  ReturnReasonsResponse,
  ReturnProductsResponse,
  RefundAnalyticsResponse,
} from "@/types/return-analytics.types";

export const returnAnalyticsKeys = {
  all:      ()                            => ["return-analytics"]          as const,
  summary:  ()                            => ["return-analytics", "summary"] as const,
  reasons:  ()                            => ["return-analytics", "reasons"] as const,
  products: ()                            => ["return-analytics", "products"] as const,
  refunds:  ()                            => ["return-analytics", "refunds"] as const,
};

export const ReturnAnalyticsService = {
  getSummary() {
    return api.get<ReturnSummaryResponse>("/admin/return-analytics/summary");
  },

  getReasons() {
    return api.get<ReturnReasonsResponse>("/admin/return-analytics/reasons");
  },

  getProducts() {
    return api.get<ReturnProductsResponse>("/admin/return-analytics/products");
  },

  getRefunds() {
    return api.get<RefundAnalyticsResponse>("/admin/return-analytics/refunds");
  },
};
