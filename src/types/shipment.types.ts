export type ShipmentStatus =
  | "PENDING"
  | "PACKED"
  | "READY_FOR_DISPATCH"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED_DELIVERY";

export interface TrackingLog {
  id: string;
  status: ShipmentStatus;
  notes: string | null;
  changedBy: string | null;
  createdAt: string;
}

export interface ShipmentWarehouse {
  id: string;
  name: string;
}

export interface ShipmentOrder {
  id: string;
  orderNumber: string;
  customerName?: string;
  totalAmount?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  status: ShipmentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  warehouse: ShipmentWarehouse | null;
  order: ShipmentOrder | null;
  trackingLogs: TrackingLog[];
}

export interface ShipmentListItem {
  shipmentId: string;
  orderId: string;
  customer: string;
  carrier: string;
  trackingId: string;
  destination: string;
  estDelivery: string;
  status: ShipmentStatus;
}

export interface ShipmentMetrics {
  totalShipments: number;
  packed: number;
  dispatched: number;
  inTransit: number;
  delivered: number;
  failed: number;
  failedDelivery: number;
}

export interface ShipmentListData {
  items: ShipmentListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  metrics: ShipmentMetrics;
}

export interface ShipmentListResponse {
  statusCode: number;
  message: string;
  data: ShipmentListData;
}

export interface ShipmentSingleResponse {
  statusCode: number;
  message: string;
  data: Shipment;
}

export interface ShipmentActionResponse {
  statusCode: number;
  message: string;
  data: Shipment;
}

export interface ShipmentListParams {
  page?: number;
  limit?: number;
  status?: ShipmentStatus;
  search?: string;
}
