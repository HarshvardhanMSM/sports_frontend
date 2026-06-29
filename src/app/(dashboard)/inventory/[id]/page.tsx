"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft, FiEdit2, FiPackage, FiAlertTriangle, FiCheckCircle, FiClock, FiRefreshCw, FiAlertCircle,
} from "react-icons/fi";
import { useInventoryItem, useInventoryMovements } from "@/hooks/useInventory";
import Badge from "@/components/ui/badge/Badge";
import { resolveImageUrl } from "@/lib/image";

export default function InventoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: res, isLoading, error, refetch } = useInventoryItem(id);
  const item = res?.data;

  const { data: movementsRes, isLoading: movementsLoading } = useInventoryMovements({ limit: 10 });
  const movements = Array.isArray(movementsRes?.data)
    ? movementsRes.data
    : (movementsRes?.data as { items?: unknown[] })?.items ?? [];

  const itemMovements = (movements as Array<{ id: string; variantId: string; actionType?: string; beforeQuantity: number; afterQuantity: number; referenceType?: string; referenceId?: string; createdAt: string }>)
    .filter((m) => m.variantId === item?.variantId || m.id === id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading inventory details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
          <FiAlertCircle className="size-6 text-rose-500" />
        </div>
        <p className="text-sm font-semibold text-slate-800">Failed to load inventory item</p>
        <p className="text-xs text-slate-500 mt-1">The item may not exist or has been removed.</p>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => router.back()}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => refetch()}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statusLabel = item.availableQuantity <= 0 ? "Out of Stock" : item.availableQuantity <= item.lowStockThreshold ? "Low Stock" : "In Stock";
  const statusColor = item.availableQuantity <= 0 ? "error" : item.availableQuantity <= item.lowStockThreshold ? "warning" : "success" as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200"
          >
            <FiArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-5 w-1 rounded-full bg-indigo-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Inventory</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {item.variantSku ?? `Item ${item.id.slice(0, 8)}`}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5 font-mono">ID: {item.id}</p>
          </div>
        </div>
        <Link
          href={`/inventory/${item.id}/edit`}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
        >
          <FiEdit2 className="size-4" />
          Edit Inventory
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Quantity", value: item.quantity, icon: FiPackage, bg: "from-indigo-500 to-indigo-600", sub: "Current stock level" },
          { label: "Reserved", value: item.reservedQuantity, icon: FiClock, bg: "from-amber-500 to-amber-600", sub: "Awaiting fulfillment" },
          { label: "Available", value: item.availableQuantity, icon: FiCheckCircle, bg: "from-emerald-500 to-emerald-600", sub: "Ready to sell" },
          { label: "Low Stock Threshold", value: item.lowStockThreshold, icon: FiAlertTriangle, bg: item.availableQuantity <= item.lowStockThreshold ? "from-rose-500 to-rose-600" : "from-slate-500 to-slate-600", sub: item.availableQuantity <= item.lowStockThreshold ? "Below threshold" : "Above threshold" },
        ].map(({ label, value, icon: Icon, bg, sub }) => (
          <div key={label} className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className={`absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br ${bg} opacity-5`} />
            <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${bg} shadow-sm mb-3`}>
              <Icon className="size-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Product Info */}
      {item.variant?.product && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Product Information</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {item.variant.product.images && item.variant.product.images.length > 0 && (
                <div className="shrink-0">
                  <div className="size-28 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    <img
                      src={resolveImageUrl(
                        item.variant.product.images.find((img) => img.isPrimary)?.imageUrl
                        ?? item.variant.product.images[0].imageUrl
                      )}
                      alt={item.variant.product.name}
                      className="size-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Name</span>
                  <span className="text-sm font-bold text-slate-800">{item.variant.product.name}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU</span>
                  <span className="text-sm font-semibold text-slate-800">{item.variant.sku}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                  <Badge color={item.variant.product.isActive ? "success" : "error"}>
                    {item.variant.product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</span>
                  <span className="text-sm font-bold text-slate-800">
                    ${parseFloat(item.variant.price).toFixed(2)}
                  </span>
                </div>
                {item.variant.compareAtPrice && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compare At</span>
                    <span className="text-sm font-semibold text-slate-500 line-through">
                      ${parseFloat(item.variant.compareAtPrice).toFixed(2)}
                    </span>
                  </div>
                )}
                {item.variant.costPrice && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cost Price</span>
                    <span className="text-sm font-semibold text-slate-800">
                      ${parseFloat(item.variant.costPrice).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Barcode</span>
                  <span className="text-sm font-semibold text-slate-800">{item.variant.barcode ?? "-"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Featured</span>
                  <span className="text-sm font-semibold text-slate-800">{item.variant.product.isFeatured ? "Yes" : "No"}</span>
                </div>
                {item.variant.product.shortDescription && (
                  <div className="flex flex-col gap-0.5 sm:col-span-2 lg:col-span-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Short Description</span>
                    <span className="text-sm text-slate-700">{item.variant.product.shortDescription}</span>
                  </div>
                )}
              </div>
            </div>
            {item.variant.product.images && item.variant.product.images.length > 1 && (
              <div className="mt-4 flex gap-2">
                {item.variant.product.images
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((img) => (
                    <div key={img.id} className="size-12 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 shrink-0">
                      <img
                        src={resolveImageUrl(img.imageUrl)}
                        alt={img.altText ?? ""}
                        className="size-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Inventory Info */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Inventory Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { label: "SKU", value: item.variantSku ?? "-" },
                { label: "Variant ID", value: item.variantId },
                { label: "Status", value: <Badge color={statusColor}>{statusLabel}</Badge> },
                { label: "Total Quantity", value: item.quantity },
                { label: "Reserved Quantity", value: item.reservedQuantity },
                { label: "Available Quantity", value: item.availableQuantity },
                { label: "Low Stock Threshold", value: item.lowStockThreshold },
                { label: "Reorder Point", value: item.reorderPoint ?? "-" },
                { label: "Reorder Quantity", value: item.reorderQuantity ?? "-" },
                { label: "Created", value: new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                { label: "Last Updated", value: new Date(item.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
                  <span className="text-sm font-semibold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
            <FiRefreshCw className="size-4 text-slate-400" />
          </div>
          <div className="p-6">
            {movementsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="size-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
              </div>
            ) : itemMovements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FiClock className="size-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-500">No activity yet</p>
                <p className="text-xs text-slate-400 mt-0.5">Stock movements will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {itemMovements.map((movement, idx) => (
                  <div key={movement.id ?? idx} className="relative pl-5 pb-4 last:pb-0">
                    {idx < itemMovements.length - 1 && (
                      <div className="absolute left-[7px] top-2.5 bottom-0 w-px bg-slate-200" />
                    )}
                    <div className="absolute left-0 top-1.5 size-3.5 rounded-full border-2 border-indigo-500 bg-white" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{movement.actionType ?? "Stock Update"}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Qty: {movement.beforeQuantity} → {movement.afterQuantity}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(movement.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {movement.referenceType && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          Ref: {movement.referenceType}{movement.referenceId ? ` #${movement.referenceId.slice(0, 8)}` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
