"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiPlus, FiPackage, FiAlertTriangle, FiXCircle, FiDollarSign, FiAlertCircle } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import { useInventoryItems, useDeleteInventory, useAdjustInventory, useReserveInventory, useReleaseInventory } from "@/hooks/useInventory";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import type { InventoryItem, InventoryListParams } from "@/types/inventory.types";
import InventoryTable from "@/features/inventory/components/InventoryTable";
import InventoryFilters from "@/features/inventory/components/InventoryFilters";
import AdjustStockModal from "@/features/inventory/components/AdjustStockModal";
import ReserveStockModal from "@/features/inventory/components/ReserveStockModal";
import ReleaseStockModal from "@/features/inventory/components/ReleaseStockModal";
import Pagination from "@/components/ui/pagination/Pagination";

export default function InventoryPage() {
  const { query: searchTerm, setQuery: setSearchTerm, debouncedQuery: debouncedSearch } = useFuzzySearch(null, {
    keys: [],
    isServerSide: true,
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const params: InventoryListParams = {
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: statusFilter === "all" ? undefined : (statusFilter as "in_stock" | "low_stock" | "out_of_stock"),
  };

  const { data, isLoading, error, isRefetching, refetch } = useInventoryItems(params);
  const { mutate: deleteItem } = useDeleteInventory();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [reservingItem, setReservingItem] = useState<InventoryItem | null>(null);
  const [releasingItem, setReleasingItem] = useState<InventoryItem | null>(null);

  const { mutate: adjustStock, isPending: isAdjusting } = useAdjustInventory(adjustingItem?.id ?? "");
  const { mutate: reserveStock, isPending: isReserving } = useReserveInventory(reservingItem?.id ?? "");
  const { mutate: releaseStock, isPending: isReleasing } = useReleaseInventory(releasingItem?.id ?? "");

  const raw = data?.data;
  const isPaginated = !Array.isArray(raw) && raw != null;
  const items = Array.isArray(raw) ? raw : (raw?.items ?? []);
  const total = isPaginated ? (raw?.total ?? 0) : items.length;
  const limit = 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pageItems = isPaginated ? items : items.slice((page - 1) * limit, page * limit);

  const lowStockCount = items.filter((i) => i.availableQuantity > 0 && i.availableQuantity <= i.lowStockThreshold).length;
  const outOfStockCount = items.filter((i) => i.availableQuantity <= 0).length;

  const STAT_CARDS = [
    { label: "Total SKUs", value: total, sub: "Active product variants", icon: FiPackage, bg: "from-indigo-500 to-indigo-600" },
    { label: "Low Stock", value: lowStockCount, sub: "Below threshold", icon: FiAlertTriangle, bg: "from-amber-500 to-amber-600" },
    { label: "Out of Stock", value: outOfStockCount, sub: "Needs restocking", icon: FiXCircle, bg: "from-rose-500 to-rose-600" },
    { label: "Total Value", value: `$${(items.reduce((s, i) => s + i.quantity, 0) * 25).toLocaleString()}`, sub: "Estimated stock value", icon: FiDollarSign, bg: "from-emerald-500 to-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Stock Control</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monitor and manage stock levels across all products and SKUs.</p>
        </div>
        <Can permission="inventory.create">
          <Link
            href="/inventory/create"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            <FiPlus className="size-4" />
            Add Inventory
          </Link>
        </Can>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STAT_CARDS.map(({ label, value, sub, icon: Icon, bg }) => (
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

      <InventoryFilters
        search={searchTerm}
        onSearchChange={(v) => { setSearchTerm(v); setPage(1); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => { setStatusFilter(v); setPage(1); }}
        onRefresh={() => refetch()}
        isRefetching={isRefetching}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading inventory...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load inventory</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      ) : pageItems.length > 0 ? (
        <div className="space-y-4">
          <InventoryTable
            items={pageItems}
            onDelete={(id) => { setDeletingId(id); deleteItem(id, { onSettled: () => setDeletingId(null) }); }}
            deletingId={deletingId}
            onAdjust={(item) => setAdjustingItem(item)}
            onReserve={(item) => setReservingItem(item)}
            onRelease={(item) => setReleasingItem(item)}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
          <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FiPackage className="size-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No inventory items found</h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-xs">
            {searchTerm || statusFilter !== "all"
              ? "No items match your current filters. Try refining your search query."
              : "Start by adding your first inventory item."}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Link
              href="/inventory/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
              style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
            >
              <FiPlus className="size-4" />
              Add Inventory
            </Link>
          )}
        </div>
      )}

      {adjustingItem && (
        <AdjustStockModal
          item={adjustingItem}
          onClose={() => setAdjustingItem(null)}
          onSubmit={(qty) => adjustStock({ quantity: qty }, { onSuccess: () => setAdjustingItem(null) })}
          isPending={isAdjusting}
        />
      )}
      {reservingItem && (
        <ReserveStockModal
          item={reservingItem}
          onClose={() => setReservingItem(null)}
          onSubmit={(qty) => reserveStock({ quantity: qty }, { onSuccess: () => setReservingItem(null) })}
          isPending={isReserving}
        />
      )}
      {releasingItem && (
        <ReleaseStockModal
          item={releasingItem}
          onClose={() => setReleasingItem(null)}
          onSubmit={(qty) => releaseStock({ quantity: qty }, { onSuccess: () => setReleasingItem(null) })}
          isPending={isReleasing}
        />
      )}
    </div>
  );
}
