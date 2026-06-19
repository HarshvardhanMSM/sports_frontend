import { api } from "./api";
import type {
  ReviewListResponse,
  ReviewSingleResponse,
  ReviewDeleteResponse,
  ReviewActionResponse,
  ReviewAnalyticsResponse,
  ReviewListParams,
} from "@/types/review.types";

export const reviewKeys = {
  all:           ()                   => ["reviews"]                 as const,
  lists:         ()                   => ["reviews", "list"]         as const,
  list:          (p: ReviewListParams) => ["reviews", "list", p]     as const,
  details:       ()                   => ["reviews", "detail"]       as const,
  detail:        (id: string)         => ["reviews", "detail", id]   as const,
  analytics:     ()                   => ["reviews", "analytics"]    as const,
};

export const ReviewService = {
  getReviews(params?: ReviewListParams) {
    return api.get<ReviewListResponse>("/admin/reviews", params);
  },

  getReview(id: string) {
    return api.get<ReviewSingleResponse>(`/admin/reviews/${id}`);
  },

  deleteReview(id: string) {
    return api.delete<ReviewDeleteResponse>(`/admin/reviews/${id}`);
  },

  approveReview(id: string) {
    return api.patch<ReviewActionResponse>(`/admin/reviews/${id}/approve`);
  },

  rejectReview(id: string) {
    return api.patch<ReviewActionResponse>(`/admin/reviews/${id}/reject`);
  },

  hideReview(id: string) {
    return api.patch<ReviewActionResponse>(`/admin/reviews/${id}/hide`);
  },

  getReviewAnalytics() {
    return api.get<ReviewAnalyticsResponse>("/admin/reviews/analytics");
  },
};
