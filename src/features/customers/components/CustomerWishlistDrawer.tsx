"use client";

import React from "react";
import { FiX, FiHeart } from "react-icons/fi";
import { useCustomerWishlist } from "@/hooks/useCustomers";

interface CustomerWishlistDrawerProps {
  customerId: string;
  customerName: string;
  onClose: () => void;
}

export default function CustomerWishlistDrawer({
  customerId,
  customerName,
  onClose,
}: CustomerWishlistDrawerProps) {
  const { data, isLoading } = useCustomerWishlist(customerId);

  const raw = data?.data;
  const items = Array.isArray(raw) ? raw : (raw?.items ?? []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-800">Wishlist</h2>
            <p className="text-xs text-slate-500 mt-0.5">{customerName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <FiX className="size-5" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="size-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
              <p className="mt-3 text-sm text-slate-500">Loading wishlist...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <FiHeart className="size-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No wishlist items found</p>
              <p className="text-xs text-slate-400 mt-1">This customer hasn&apos;t added any items to their wishlist yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-400">
                    {item.image ? (
                      <img src={item.image} alt={item.productName} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <FiHeart className="size-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.productName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">SKU: {item.sku}</p>
                    <p className="text-xs text-slate-500">{item.variant}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-800">${item.price.toFixed(2)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(item.addedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
