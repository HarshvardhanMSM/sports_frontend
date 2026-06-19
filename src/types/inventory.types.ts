// ── Base DTOs ─────────────────────────────────────────────────────

export interface InventoryItem {
  id: string;
  variantId: string;
  variantSku?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderPoint?: number;
  lowStockThreshold: number;
  reorderQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VariantSearchResult {
  productId: string;
  productName?: string;
  sku: string;
  barcode?: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  variantId: string;
  quantity: number;
  costPrice: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplier?: Supplier;
  status: "DRAFT" | "APPROVED" | "PARTIALLY_RECEIVED" | "RECEIVED" | "CLOSED" | "CANCELLED";
  notes?: string;
  expectedDate?: string;
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GoodsReceiptItem {
  variantId: string;
  quantityReceived: number;
}

export interface GoodsReceipt {
  id: string;
  purchaseOrderId: string;
  purchaseOrder?: PurchaseOrder;
  receivedBy?: string;
  notes?: string;
  items: GoodsReceiptItem[];
  createdAt: string;
  updatedAt: string;
}

export interface StockAlert {
  id: string;
  variantId: string;
  variantSku?: string;
  alertType: "LOW_STOCK" | "OUT_OF_STOCK";
  thresholdQuantity?: number;
  currentQuantity?: number;
  resolved: boolean;
  createdAt: string;
}

export interface InventoryAudit {
  id: string;
  variantId: string;
  variantSku?: string;
  actionType?: string;
  beforeQuantity: number;
  afterQuantity: number;
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
}

// ── Request types ────────────────────────────────────────────────

export interface CreateInventoryRequest {
  variantId?: string;
  variantSku?: string;
  quantity: number;
  reservedQuantity?: number;
  reorderPoint?: number;
  lowStockThreshold?: number;
  reorderQuantity?: number;
}

export interface UpdateInventoryRequest {
  variantId?: string;
  quantity?: number;
  reservedQuantity?: number;
  reorderPoint?: number;
  lowStockThreshold?: number;
  reorderQuantity?: number;
}

export interface AdjustInventoryRequest {
  quantity: number;
}

export interface CreateSupplierRequest {
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  isActive?: boolean;
}

export type UpdateSupplierRequest = Partial<CreateSupplierRequest>;

export interface CreatePurchaseOrderRequest {
  supplierId: string;
  notes?: string;
  expectedDate?: string;
  items: PurchaseOrderItem[];
}

export type UpdatePurchaseOrderRequest = Partial<CreatePurchaseOrderRequest>;

export interface CreateGoodsReceiptRequest {
  purchaseOrderId: string;
  receivedBy?: string;
  notes?: string;
  items: GoodsReceiptItem[];
}

export interface InventoryPlusAdjustRequest {
  variantId: string;
  quantity: number;
  reason?: string;
}

// ── List params ──────────────────────────────────────────────────

export interface InventoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  actionType?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface SupplierListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface PurchaseOrderListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  supplierId?: string;
}

export interface GoodsReceiptListParams {
  page?: number;
  limit?: number;
}

// ── Response types ───────────────────────────────────────────────

export interface InventoryListResponse {
  statusCode: number;
  message: string;
  data: InventoryItem[] | { items: InventoryItem[]; total: number };
}

export interface InventorySingleResponse {
  statusCode: number;
  message: string;
  data: InventoryItem;
}

export interface SupplierListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Supplier[];
    total: number;
  };
}

export interface SupplierSingleResponse {
  statusCode: number;
  message: string;
  data: Supplier;
}

export interface SupplierDeleteResponse {
  statusCode: number;
  message: string;
}

export interface PurchaseOrderListResponse {
  statusCode: number;
  message: string;
  data: {
    items: PurchaseOrder[];
    total: number;
  };
}

export interface PurchaseOrderSingleResponse {
  statusCode: number;
  message: string;
  data: PurchaseOrder;
}

export interface GoodsReceiptListResponse {
  statusCode: number;
  message: string;
  data: {
    items: GoodsReceipt[];
    total: number;
  };
}

export interface GoodsReceiptSingleResponse {
  statusCode: number;
  message: string;
  data: GoodsReceipt;
}

export interface InventoryPlusResponse {
  statusCode: number;
  message: string;
  data: {
    items: InventoryItem[];
    total: number;
  };
}

export interface StockAlertListResponse {
  statusCode: number;
  message: string;
  data: {
    items: StockAlert[];
    total: number;
  };
}

export interface InventoryAuditListResponse {
  statusCode: number;
  message: string;
  data: {
    items: InventoryAudit[];
    total: number;
  };
}

export interface InventoryAnalyticsSummary {
  totalStockValue: number;
  totalStockUnits: number;
  lowStockCount: number;
  outOfStockCount: number;
  activeSuppliers: number;
  openPurchaseOrders: number;
}

export interface InventoryAnalyticsSummaryResponse {
  statusCode: number;
  message: string;
  data: InventoryAnalyticsSummary;
}

export interface TopSellingItem {
  variantId: string;
  transactions: number;
  variantSku?: string;
  productName?: string;
}

export interface SlowMovingItem {
  variantId: string;
  variantSku?: string;
  productName?: string;
  currentStock: number;
  lastMovementDate?: string;
  daysWithoutSale: number;
}

export interface SlowMovingItemsResponse {
  statusCode: number;
  message: string;
  data: SlowMovingItem[];
}

export interface StockValueData {
  totalStockValue: number;
  totalItems: number;
}

export interface AlertStats {
  totalAlerts: number;
  unresolvedAlerts: number;
  lowStockAlerts: number;
  outOfStockAlerts: number;
}

export interface InventoryReportData {
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalInventoryItems: number;
  lowStock: InventoryItem[];
}

export interface VariantSearchResponse {
  statusCode: number;
  message: string;
  data: VariantSearchResult[];
}
