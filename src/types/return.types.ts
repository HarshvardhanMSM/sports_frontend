export type ReturnStatus =
  | "REQUESTED"
  | "APPROVED"
  | "PICKUP_SCHEDULED"
  | "IN_TRANSIT"
  | "RECEIVED"
  | "REFUNDED"
  | "COMPLETED"
  | "REJECTED";

export interface ReturnCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

export interface ReturnOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  paymentStatus: string;
  createdAt: string;
}

export interface ReturnProduct {
  orderItemId: string;
  productName: string;
  sku: string;
  unitPrice: string;
  totalPrice: string;
  productImage?: string;
}

export interface ReturnItem {
  id: string;
  quantity: number;
  reason: string;
  condition: string;
  refundAmount: string;
  product: ReturnProduct;
}

export interface ReturnShipment {
  id: string;
  courierName: string;
  trackingNumber: string;
  status: string;
  pickupDate: string | null;
  deliveredDate: string | null;
}

export interface ReturnTimelineEntry {
  id: string;
  action: string;
  performedBy: string | null;
  notes: string;
  createdAt: string;
}

export interface ReturnListItem {
  id: string;
  returnNumber: string;
  status: ReturnStatus;
  reason: string;
  notes: string | null;
  totalRefundAmount: string;
  requestedAt: string;
  approvedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: ReturnCustomer;
  order: ReturnOrder;
  items: ReturnItem[];
  shipment: ReturnShipment | null;
}

export interface ReturnDetail extends ReturnListItem {
  timeline: ReturnTimelineEntry[];
}

export interface ReturnListResponse {
  statusCode: number;
  message: string;
  data: {
    items: ReturnListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp?: string;
}

export interface ReturnSingleResponse {
  statusCode: number;
  message: string;
  data: ReturnDetail;
}

export interface ReturnActionResponse {
  statusCode: number;
  message: string;
  data: ReturnListItem;
}

export interface ReturnListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReturnStatus;
}
