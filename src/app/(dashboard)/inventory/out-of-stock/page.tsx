"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiPackage, FiXCircle, FiArrowLeft } from "react-icons/fi";
import { useOutOfStockItems, useDeleteInventory, useAdjustInventory, useReserveInventory, useReleaseInventory } from "@/hooks/useInventory";
import type { InventoryItem, InventoryListParams } from "@/types/inventory.types";
import InventoryTable from "@/features/inventory/components/InventoryTable";
import AdjustStockModal from "@/features/inventory/components/AdjustStockModal";
import ReserveStockModal from "@/features/inventory/components/ReserveStockModal";
import ReleaseStockModal from "@/features/inventory/components/ReleaseStockModal";
import Pagination from "@/components/ui/pagination/Pagination";

export default function OutOfStockPage() {
  const [page, setPage] = useState(1);

  const params: InventoryListParams = { page, limit: 10 };

  const { data, isLoading, error, isRefetching, refetch } = useOutOfStockItems(params);
  const { mutate: deleteItem } = useDeleteInventory();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [reservingItem, setReservingItem] = useState<InventoryItem | null>(null);
  const [releasingItem, setReleasingItem] = useState<InventoryItem | null>(null);

  const { mutate: adjustStock, isPending: isAdjusting } = useAdjustInventory(adjustingItem?.id ?? "");
  const { mutate: reserveStock, isPending: isReserving } = useReserveInventory(reservingItem?.id ?? "");
  const { mutate: releaseStock, isPending: isReleasing } = useReleaseInventory(releasingItem?.id ?? "");

  const raw = data?.data;
  const items = raw?.items ?? [];
  const total = raw?.total ?? 0;
  const limit = 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-rose-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">Inventory</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Out of Stock Items</h1>
          <p className="text-sm text-slate-500 mt-0.5">Items that are currently out of stock and need restocking.</p>
        </div>
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
        >
          <FiArrowLeft className="size-4" />
          Back to Inventory
        </Link>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200">
        <div className="size-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
          <FiXCircle className="size-5 text-rose-600" />
        </div>
        <p className="text-sm text-rose-800">
          <strong className="font-semibold">{total}</strong> item{total !== 1 ? "s" : ""} out of stock. Immediate restocking required.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-rose-500" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading out of stock items...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiXCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #e11d48, #be123c)" }}
          >
            Retry
          </button>
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          <InventoryTable
            items={items}
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
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
          <div className="size-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiPackage className="size-6 text-rose-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No out of stock items</h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-xs">All items have available stock. No items are currently out of stock.</p>
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
