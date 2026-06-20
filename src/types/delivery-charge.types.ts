export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DeliveryCharge {
  id: string;
  name: string;
  description: string;
  chargeAmount: string;
  chargeType: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeliveryChargeDto {
  name: string;
  description?: string;
  chargeAmount: number;
  chargeType: string;
  isActive: boolean;
}

export interface UpdateDeliveryChargeDto {
  name?: string;
  description?: string;
  chargeAmount?: number;
  chargeType?: string;
  isActive?: boolean;
}

export interface AuditEntry {
  action: string;
  changedBy: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
}

export interface DeliveryChargeListResponse {
  statusCode: number;
  message: string;
  data: {
    items: DeliveryCharge[];
    meta: PaginationMeta;
  };
}

export interface DeliveryChargeSingleResponse {
  statusCode: number;
  message: string;
  data: DeliveryCharge;
}

export interface AuditHistoryResponse {
  statusCode: number;
  message: string;
  data: AuditEntry[];
}
