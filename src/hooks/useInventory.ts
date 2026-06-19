"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: (body: CreateInventoryRequest) => InventoryService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
      router.push("/inventory");
    },
  });
}

export function useUpdateInventory(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (body: UpdateInventoryRequest) => InventoryService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
      router.push("/inventory");
    },
  });
}

export function useDeleteInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InventoryService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
    },
  });
}

export function useAdjustInventory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AdjustInventoryRequest) => InventoryService.adjust(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
    },
  });
}

export function useReserveInventory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AdjustInventoryRequest) => InventoryService.reserve(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
    },
  });
}

export function useReleaseInventory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AdjustInventoryRequest) => InventoryService.release(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
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
  return useMutation({
    mutationFn: (body: CreateSupplierRequest) => SupplierService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supplierKeys.all() });
      router.push("/suppliers");
    },
  });
}

export function useUpdateSupplier(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (body: UpdateSupplierRequest) => SupplierService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supplierKeys.all() });
      router.push("/suppliers");
    },
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => SupplierService.delete(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: supplierKeys.all() });
      qc.removeQueries({ queryKey: supplierKeys.detail(id) });
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
  return useMutation({
    mutationFn: (body: CreatePurchaseOrderRequest) => PurchaseOrderService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: purchaseOrderKeys.all() });
      router.push("/purchase-orders");
    },
  });
}

export function useUpdatePurchaseOrder(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (body: UpdatePurchaseOrderRequest) => PurchaseOrderService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: purchaseOrderKeys.all() });
      router.push("/purchase-orders");
    },
  });
}

export function useApprovePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PurchaseOrderService.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: purchaseOrderKeys.all() });
    },
  });
}

export function useCancelPurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PurchaseOrderService.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: purchaseOrderKeys.all() });
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
  return useMutation({
    mutationFn: (body: CreateGoodsReceiptRequest) => GoodsReceiptService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goodsReceiptKeys.all() });
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
      router.push("/goods-receipts");
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
  return useMutation({
    mutationFn: (body: InventoryPlusAdjustRequest) => InventoryPlusService.adjust(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryPlusKeys.all() });
      qc.invalidateQueries({ queryKey: inventoryKeys.all() });
    },
  });
}

export function useCheckAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => InventoryPlusService.checkAlerts(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryPlusKeys.all() });
    },
  });
}

export function useResolveAllAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => InventoryPlusService.resolveAlerts(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryPlusKeys.all() });
    },
  });
}

export function useResolveAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InventoryPlusService.resolveAlert(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryPlusKeys.all() });
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
    select: (res) => res.data,
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
