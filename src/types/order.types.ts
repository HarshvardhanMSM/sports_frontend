export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED";

export type PaymentStatus = "PAID" | "PENDING" | "REFUNDED" | "FAILED";

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  imageUrl?: string;
  variantName?: string;
  createdAt?: string;
}

export interface OrderListItem {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paidAmount: string;
  dueAmount: string;
  subtotal: string;
  discountAmount: string;
  shippingAmount: string;
  deliveryCharge: string;
  codCharge: string;
  handlingCharge: string;
  taxAmount: string;
  totalAmount: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  shippingAddressId?: string;
  warehouseId?: string;
  distanceKm?: number | null;
  notes?: string | null;
}

export interface Address {
  id?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export interface OrderDetail extends OrderListItem {
  shippingAddress?: Address;
  warehouse?: Warehouse;
}

export interface OrderListResponse {
  statusCode: number;
  message: string;
  data: {
    items: OrderListItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    totalOrders: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  timestamp?: string;
}

export interface OrderSingleResponse {
  statusCode: number;
  message: string;
  data: OrderDetail;
}

export interface OrderStatusUpdateResponse {
  statusCode: number;
  message: string;
  data: OrderDetail;
}

export interface OrderCancelResponse {
  statusCode: number;
  message: string;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
}
