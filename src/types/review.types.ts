export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";

export interface ReviewImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  status: ReviewStatus;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  userName: string;
  productName: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  product: {
    id: string;
    name: string;
    slug: string;
  };
  images: ReviewImage[];
  createdAt: string;
}

export interface ReviewListResponse {
  statusCode: number;
  message: string;
  data: {
    reviews: Review[];
    totalReviews: number;
    averageRating: number;
  };
  timestamp?: string;
}

export interface ReviewSingleResponse {
  statusCode: number;
  message: string;
  data: Review;
}

export interface ReviewDeleteResponse {
  statusCode: number;
  message: string;
}

export interface ReviewActionResponse {
  statusCode: number;
  message: string;
  data: Review;
}

export interface ReviewAnalytics {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  hiddenReviews: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number }[];
}

export interface ReviewAnalyticsResponse {
  statusCode: number;
  message: string;
  data: ReviewAnalytics;
}

export interface ReviewListParams {
  page?: number;
  limit?: number;
  search?: string;
  rating?: number;
  status?: ReviewStatus;
  productId?: string;
  startDate?: string;
  endDate?: string;
}
