import { api } from "./api";
import type {
  InventoryListResponse,
  InventorySingleResponse,
  InventoryListParams,
  CreateInventoryRequest,
  UpdateInventoryRequest,
  AdjustInventoryRequest,
  SupplierListResponse,
  SupplierSingleResponse,
  SupplierDeleteResponse,
  SupplierListParams,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  PurchaseOrderListResponse,
  PurchaseOrderSingleResponse,
  PurchaseOrderListParams,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
  GoodsReceiptListResponse,
  GoodsReceiptSingleResponse,
  GoodsReceiptListParams,
  CreateGoodsReceiptRequest,
  InventoryPlusResponse,
  StockAlertListResponse,
  InventoryAuditListResponse,
  InventoryPlusAdjustRequest,
  InventoryAnalyticsSummaryResponse,
  TopSellingItem,
  // SlowMovingItem,
  SlowMovingItemsResponse,
  StockValueData,
  AlertStats,
  AlertStatsResponse,
  InventoryReportData,
  VariantSearchResponse,
} from "@/types/inventory.types";

// ── Query Keys ───────────────────────────────────────────────────

export const inventoryKeys = {
  all:              ()                          => ["inventory"]                     as const,
  lists:            ()                          => ["inventory", "list"]             as const,
  list:             (p: InventoryListParams)    => ["inventory", "list", p]          as const,
  details:          ()                          => ["inventory", "detail"]           as const,
  detail:           (id: string)                => ["inventory", "detail", id]       as const,
  variants:         (search: string)            => ["inventory", "variants", search] as const,
};

export const supplierKeys = {
  all:              ()                          => ["suppliers"]                     as const,
  lists:            ()                          => ["suppliers", "list"]             as const,
  list:             (p: SupplierListParams)     => ["suppliers", "list", p]          as const,
  details:          ()                          => ["suppliers", "detail"]           as const,
  detail:           (id: string)                => ["suppliers", "detail", id]       as const,
};

export const purchaseOrderKeys = {
  all:              ()                          => ["purchase-orders"]               as const,
  lists:            ()                          => ["purchase-orders", "list"]       as const,
  list:             (p: PurchaseOrderListParams)=> ["purchase-orders", "list", p]    as const,
  details:          ()                          => ["purchase-orders", "detail"]     as const,
  detail:           (id: string)                => ["purchase-orders", "detail", id] as const,
};

export const goodsReceiptKeys = {
  all:              ()                          => ["goods-receipts"]                as const,
  lists:            ()                          => ["goods-receipts", "list"]        as const,
  list:             (p: GoodsReceiptListParams) => ["goods-receipts", "list", p]     as const,
  details:          ()                          => ["goods-receipts", "detail"]      as const,
  detail:           (id: string)                => ["goods-receipts", "detail", id]  as const,
};

export const inventoryPlusKeys = {
  all:              ()                          => ["inventory-plus"]                as const,
  lowStock:         (p?: InventoryListParams)   => ["inventory-plus", "low-stock", p] as const,
  outOfStock:       (p?: InventoryListParams)   => ["inventory-plus", "out-of-stock", p] as const,
  alerts:           (p?: InventoryListParams)   => ["inventory-plus", "alerts", p]   as const,
  movements:        (p?: InventoryListParams)   => ["inventory-plus", "movements", p] as const,
};

export const inventoryAnalyticsKeys = {
  summary:          ()                          => ["inventory-analytics", "summary"] as const,
  topSelling:       (limit?: number)            => ["inventory-analytics", "top-selling", limit] as const,
  slowMoving:       ()                          => ["inventory-analytics", "slow-moving"] as const,
  stockValue:       ()                          => ["inventory-analytics", "stock-value"] as const,
  alerts:           ()                          => ["inventory-analytics", "alerts"] as const,
};

export const reportKeys = {
  inventory:        ()                          => ["reports", "inventory"]          as const,
};

// ── 1. Base Inventory Service ────────────────────────────────────

export const InventoryService = {
  getAll(params?: InventoryListParams) {
    return api.get<InventoryListResponse>("/admin/inventory", params);
  },

  getById(id: string) {
    return api.get<InventorySingleResponse>(`/admin/inventory/${id}`);
  },

  create(body: CreateInventoryRequest) {
    return api.post<InventorySingleResponse>("/admin/inventory", body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  getVariants(search: string) {
    return api.get<VariantSearchResponse>("/admin/inventory/variants", { search });
  },

  update(id: string, body: UpdateInventoryRequest) {
    return api.patch<InventorySingleResponse>(`/admin/inventory/${id}`, body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  adjust(id: string, body: AdjustInventoryRequest) {
    return api.patch<InventorySingleResponse>(`/admin/inventory/${id}/adjust`, body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  reserve(id: string, body: AdjustInventoryRequest) {
    return api.patch<InventorySingleResponse>(`/admin/inventory/${id}/reserve`, body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  release(id: string, body: AdjustInventoryRequest) {
    return api.patch<InventorySingleResponse>(`/admin/inventory/${id}/release`, body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  delete(id: string) {
    return api.delete<{ statusCode: number; message: string }>(`/admin/inventory/${id}`);
  },
};

// ── 2. Suppliers Service ─────────────────────────────────────────

export const SupplierService = {
  getAll(params?: SupplierListParams) {
    return api.get<SupplierListResponse>("/admin/suppliers", params);
  },

  getById(id: string) {
    return api.get<SupplierSingleResponse>(`/admin/suppliers/${id}`);
  },

  create(body: CreateSupplierRequest) {
    return api.post<SupplierSingleResponse>("/admin/suppliers", body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  update(id: string, body: UpdateSupplierRequest) {
    return api.patch<SupplierSingleResponse>(`/admin/suppliers/${id}`, body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  delete(id: string) {
    return api.delete<SupplierDeleteResponse>(`/admin/suppliers/${id}`);
  },
};

// ── 3. Purchase Orders Service ───────────────────────────────────

export const PurchaseOrderService = {
  getAll(params?: PurchaseOrderListParams) {
    return api.get<PurchaseOrderListResponse>("/admin/purchase-orders", params);
  },

  getById(id: string) {
    return api.get<PurchaseOrderSingleResponse>(`/admin/purchase-orders/${id}`);
  },

  create(body: CreatePurchaseOrderRequest) {
    return api.post<PurchaseOrderSingleResponse>("/admin/purchase-orders", body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  update(id: string, body: UpdatePurchaseOrderRequest) {
    return api.patch<PurchaseOrderSingleResponse>(`/admin/purchase-orders/${id}`, body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  approve(id: string) {
    return api.post<PurchaseOrderSingleResponse>(`/admin/purchase-orders/${id}/approve`);
  },

  cancel(id: string) {
    return api.post<PurchaseOrderSingleResponse>(`/admin/purchase-orders/${id}/cancel`);
  },
};

// ── 4. Goods Receipts Service ────────────────────────────────────

export const GoodsReceiptService = {
  getAll(params?: GoodsReceiptListParams) {
    return api.get<GoodsReceiptListResponse>("/admin/goods-receipts", params);
  },

  getById(id: string) {
    return api.get<GoodsReceiptSingleResponse>(`/admin/goods-receipts/${id}`);
  },

  create(body: CreateGoodsReceiptRequest) {
    return api.post<GoodsReceiptSingleResponse>("/admin/goods-receipts", body, {
      headers: { "Content-Type": "application/json" },
    });
  },
};

// ── 5. Inventory Plus Service ────────────────────────────────────

export const InventoryPlusService = {
  getAll(params?: InventoryListParams) {
    return api.get<InventoryPlusResponse>("/admin/inventory-plus", params);
  },

  getLowStock(params?: InventoryListParams) {
    return api.get<InventoryPlusResponse>("/admin/inventory-plus/low-stock", params);
  },

  getOutOfStock(params?: InventoryListParams) {
    return api.get<InventoryPlusResponse>("/admin/inventory-plus/out-of-stock", params);
  },

  getAlerts(params?: InventoryListParams) {
    return api.get<StockAlertListResponse>("/admin/inventory-plus/alerts", params);
  },

  getMovements(params?: InventoryListParams) {
    return api.get<InventoryAuditListResponse>("/admin/inventory-plus/movements", params);
  },

  adjust(body: InventoryPlusAdjustRequest) {
    return api.post<InventorySingleResponse>("/admin/inventory-plus/adjust", body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  checkAlerts() {
    return api.post<{ statusCode: number; message: string }>("/admin/inventory-plus/alerts/check");
  },

  resolveAlerts() {
    return api.post<{ statusCode: number; message: string }>("/admin/inventory-plus/alerts/resolve");
  },

  resolveAlert(id: string) {
    return api.patch<{ statusCode: number; message: string }>(`/admin/inventory-plus/alerts/${id}`);
  },
};

// ── 6. Inventory Analytics Service ───────────────────────────────

export const InventoryAnalyticsService = {
  getSummary() {
    return api.get<InventoryAnalyticsSummaryResponse>("/admin/inventory-analytics/summary");
  },

  getTopSelling(limit?: number) {
    return api.get<TopSellingItem[]>("/admin/inventory-analytics/top-selling", { limit });
  },

  getSlowMoving() {
    return api.get<SlowMovingItemsResponse>("/admin/inventory-analytics/slow-moving");
  },

  getStockValue() {
    return api.get<StockValueData>("/admin/inventory-analytics/stock-value");
  },

  getAlerts() {
    return api.get<AlertStatsResponse>("/admin/inventory-analytics/alerts");
  },
};

// ── 7. Reports Service ───────────────────────────────────────────

export const ReportsService = {
  getInventoryReport() {
    return api.get<InventoryReportData>("/admin/reports/inventory");
  },
};
