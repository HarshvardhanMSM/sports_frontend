export interface ReturnSummary {
  totalReturns: number;
  totalRefundAmount: number;
  returnRate: number;
  averageProcessingTimeHours: number;
  pendingReturns: number;
  approvedReturns: number;
  rejectedReturns: number;
  refundedReturns: number;
}

export interface ReturnSummaryResponse {
  statusCode: number;
  message: string;
  data: ReturnSummary;
}

export interface ReturnReason {
  reason: string;
  count: string;
}

export interface ReturnReasonsResponse {
  statusCode: number;
  message: string;
  data: ReturnReason[];
}

export interface ReturnProduct {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  returnCount: number;
  totalReturnedQty: number;
  totalSoldQty: number;
  projectedAmount: number;
  revenueLoss: number;
  returnRate: number;
}

export interface ReturnProductsResponse {
  statusCode: number;
  message: string;
  data: ReturnProduct[];
}

export interface RefundMonthlyTrend {
  month: string;
  total: string;
  count: string;
}

export interface RefundAnalytics {
  monthlyRefunds: RefundMonthlyTrend[];
}

export interface RefundAnalyticsResponse {
  statusCode: number;
  message: string;
  data: RefundAnalytics;
}
