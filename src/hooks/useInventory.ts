"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  InventoryService,
  SupplierService,
  PurchaseOrderService,
  GoodsReceiptService,
  InventoryPlusService,
  InventoryAnalyticsService,
  ReportsService,
  inventoryKeys,
  supplierKeys,
  purchaseOrderKeys,
  goodsReceiptKeys,
  inventoryPlusKeys,
  inventoryAnalyticsKeys,
  reportKeys,
} from "@/services/inventory.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type {
  InventoryListParams,
  CreateInventoryRequest,
  UpdateInventoryRequest,
  AdjustInventoryRequest,
  SupplierListParams,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  PurchaseOrderListParams,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
  GoodsReceiptListParams,
  CreateGoodsReceiptRequest,
  InventoryListParams as InventoryPlusListParams,
  InventoryPlusAdjustRequest,
} from "@/types/inventory.types";

const STALE_DETAIL = 3 * 60 * 1000;

// ── Base Inventory ───────────────────────────────────────────────

export function useInventoryItems(params?: InventoryListParams) {
  return useQuery({
    queryKey: inventoryKeys.list(params ?? {}),
    queryFn: () => InventoryService.getAll(params),
    staleTime: 0,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });
}

export function useInventoryItem(id: string | undefined) {
  return useQuery({
    queryKey: inventoryKeys.detail(id ?? ""),
    queryFn: () => InventoryService.getById(id!),
    enabled: !!id,
    staleTime: STALE_DETAIL,
  });
}

export function useInventoryVariants(search: string) {
  return useQuery({
    queryKey: inventoryKeys.variants(search),
    queryFn: () => InventoryService.getVariants(search),
    enabled: search.length >= 2,
    staleTime: 30 * 1000,
  });
}

export function useCreateInventory() {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: CreateInventoryRequest) => InventoryService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
      toast.success("Inventory item created successfully.");
      router.push("/inventory");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateInventory(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: UpdateInventoryRequest) => InventoryService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
      toast.success("Inventory item updated successfully.");
      router.push("/inventory");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeleteInventory() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => InventoryService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
      toast.success("Inventory item deleted.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useAdjustInventory(id: string) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: AdjustInventoryRequest) => InventoryService.adjust(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
      toast.success("Inventory adjusted successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useReserveInventory(id: string) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: AdjustInventoryRequest) => InventoryService.reserve(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
      toast.success("Stock reserved successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useReleaseInventory(id: string) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: AdjustInventoryRequest) => InventoryService.release(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
      toast.success("Stock released successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

// ── Suppliers ────────────────────────────────────────────────────

export function useSuppliers(params?: SupplierListParams) {
  return useQuery({
    queryKey: supplierKeys.list(params ?? {}),
    queryFn: () => SupplierService.getAll(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useSupplier(id: string | undefined) {
  return useQuery({
    queryKey: supplierKeys.detail(id ?? ""),
    queryFn: () => SupplierService.getById(id!),
    enabled: !!id,
    staleTime: STALE_DETAIL,
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: CreateSupplierRequest) => SupplierService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supplierKeys.all() });
      toast.success("Supplier created successfully.");
      router.push("/suppliers");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateSupplier(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: UpdateSupplierRequest) => SupplierService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supplierKeys.all() });
      toast.success("Supplier updated successfully.");
      router.push("/suppliers");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => SupplierService.delete(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: supplierKeys.all() });
      qc.removeQueries({ queryKey: supplierKeys.detail(id) });
      toast.success("Supplier deleted.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

// ── Purchase Orders ──────────────────────────────────────────────

export function usePurchaseOrders(params?: PurchaseOrderListParams) {
  return useQuery({
    queryKey: purchaseOrderKeys.list(params ?? {}),
    queryFn: () => PurchaseOrderService.getAll(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function usePurchaseOrder(id: string | undefined) {
  return useQuery({
    queryKey: purchaseOrderKeys.detail(id ?? ""),
    queryFn: () => PurchaseOrderService.getById(id!),
    enabled: !!id,
    staleTime: STALE_DETAIL,
  });
}

export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: CreatePurchaseOrderRequest) => PurchaseOrderService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: purchaseOrderKeys.all() });
      toast.success("Purchase order created successfully.");
      router.push("/purchase-orders");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdatePurchaseOrder(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: UpdatePurchaseOrderRequest) => PurchaseOrderService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: purchaseOrderKeys.all() });
      toast.success("Purchase order updated.");
      router.push("/purchase-orders");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useApprovePurchaseOrder() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => PurchaseOrderService.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: purchaseOrderKeys.all() });
      toast.success("Purchase order approved.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useCancelPurchaseOrder() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => PurchaseOrderService.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: purchaseOrderKeys.all() });
      toast.success("Purchase order cancelled.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

// ── Goods Receipts ───────────────────────────────────────────────

export function useGoodsReceipts(params?: GoodsReceiptListParams) {
  return useQuery({
    queryKey: goodsReceiptKeys.list(params ?? {}),
    queryFn: () => GoodsReceiptService.getAll(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useGoodsReceipt(id: string | undefined) {
  return useQuery({
    queryKey: goodsReceiptKeys.detail(id ?? ""),
    queryFn: () => GoodsReceiptService.getById(id!),
    enabled: !!id,
    staleTime: STALE_DETAIL,
  });
}

export function useCreateGoodsReceipt() {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: CreateGoodsReceiptRequest) => GoodsReceiptService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goodsReceiptKeys.all() });
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
      toast.success("Goods receipt created successfully.");
      router.push("/goods-receipts");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

// ── Inventory Plus ───────────────────────────────────────────────

export function useInventoryPlus(params?: InventoryPlusListParams) {
  return useQuery({
    queryKey: inventoryPlusKeys.lowStock(params),
    queryFn: () => InventoryPlusService.getAll(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useLowStockItems(params?: InventoryPlusListParams) {
  return useQuery({
    queryKey: inventoryPlusKeys.lowStock(params),
    queryFn: () => InventoryPlusService.getLowStock(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useOutOfStockItems(params?: InventoryPlusListParams) {
  return useQuery({
    queryKey: inventoryPlusKeys.outOfStock(params),
    queryFn: () => InventoryPlusService.getOutOfStock(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useStockAlerts(params?: InventoryPlusListParams) {
  return useQuery({
    queryKey: inventoryPlusKeys.alerts(params),
    queryFn: () => InventoryPlusService.getAlerts(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useInventoryMovements(params?: InventoryPlusListParams) {
  return useQuery({
    queryKey: inventoryPlusKeys.movements(params),
    queryFn: () => InventoryPlusService.getMovements(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useAdjustInventoryPlus() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: InventoryPlusAdjustRequest) => InventoryPlusService.adjust(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryPlusKeys.all() });
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
      toast.success("Inventory adjusted successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useCheckAlerts() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: () => InventoryPlusService.checkAlerts(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryPlusKeys.all() });
      toast.success("Alerts checked.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useResolveAllAlerts() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: () => InventoryPlusService.resolveAlerts(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryPlusKeys.all() });
      toast.success("All alerts resolved.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useResolveAlert() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => InventoryPlusService.resolveAlert(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryPlusKeys.all() });
      toast.success("Alert resolved.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

// ── Inventory Analytics ──────────────────────────────────────────

export function useInventoryAnalyticsSummary() {
  return useQuery({
    queryKey: inventoryAnalyticsKeys.summary(),
    queryFn: () => InventoryAnalyticsService.getSummary(),
    staleTime: STALE_DETAIL,
  });
}

export function useTopSellingItems(limit?: number) {
  return useQuery({
    queryKey: inventoryAnalyticsKeys.topSelling(limit),
    queryFn: () => InventoryAnalyticsService.getTopSelling(limit),
  });
}

export function useSlowMovingItems() {
  return useQuery({
    queryKey: inventoryAnalyticsKeys.slowMoving(),
    queryFn: () => InventoryAnalyticsService.getSlowMoving(),
    select: (res) => res.data.items,
  });
}

export function useInventoryStockValue() {
  return useQuery({
    queryKey: inventoryAnalyticsKeys.stockValue(),
    queryFn: () => InventoryAnalyticsService.getStockValue(),
  });
}

export function useInventoryAnalyticsAlerts() {
  return useQuery({
    queryKey: inventoryAnalyticsKeys.alerts(),
    queryFn: () => InventoryAnalyticsService.getAlerts(),
  });
}

// ── Reports ──────────────────────────────────────────────────────

export function useInventoryReport() {
  return useQuery({
    queryKey: reportKeys.inventory(),
    queryFn: () => ReportsService.getInventoryReport(),
    staleTime: STALE_DETAIL,
  });
}
