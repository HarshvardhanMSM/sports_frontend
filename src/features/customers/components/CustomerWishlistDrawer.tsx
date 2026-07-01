"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiX, FiHeart, FiShoppingCart, FiPackage, FiDollarSign, FiClock, FiAlertCircle } from "react-icons/fi";
import { useCustomerWishlist, useCustomerCart } from "@/hooks/useCustomers";
import { resolveImageUrl } from "@/lib/image";
import type { WishlistItem, CartItem } from "@/types/customer.types";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";

interface CustomerWishlistDrawerProps {
  customerId: string;
  customerName: string;
  onClose: () => void;
  initialTab?: "wishlist" | "cart";
}

export default function CustomerWishlistDrawer({
  customerId,
  customerName,
  onClose,
  initialTab = "wishlist",
}: CustomerWishlistDrawerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"wishlist" | "cart">(initialTab);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTab(initialTab);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialTab]);

  const { data: wishlistData, isLoading: wishlistLoading } = useCustomerWishlist(customerId);
  const { data: cartRes, isLoading: cartLoading, error: cartError } = useCustomerCart(
    activeTab === "cart" ? customerId : null
  );

  const wishlistItems: WishlistItem[] = (() => {
    if (!wishlistData) return [];
    const d = wishlistData as unknown as Record<string, unknown>;
    const nested = d.data as WishlistItem[] | { items: WishlistItem[] } | undefined;
    if (Array.isArray(nested)) return nested;
    if (nested && "items" in nested && Array.isArray(nested.items)) return nested.items;
    if ("items" in d && Array.isArray(d.items)) return d.items as WishlistItem[];
    return [];
  })();

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {activeTab === "wishlist" ? "Wishlist" : "Shopping Cart"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{customerName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                router.push(`/customers/${customerId}`);
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
            >
              View Profile
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <FiX className="size-5" />
            </button>
          </div>
        </div>

        {/* Tabs switcher */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50 shrink-0">
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "wishlist"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <FiHeart className="size-4" />
            Wishlist ({wishlistItems.length})
          </button>
          <button
            onClick={() => setActiveTab("cart")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "cart"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <FiShoppingCart className="size-4" />
            Shopping Cart
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === "wishlist" ? (
            wishlistLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="size-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
                <p className="mt-3 text-sm text-slate-500">Loading wishlist...</p>
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <FiHeart className="size-6 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700">No wishlist items found</p>
                <p className="text-xs text-slate-400 mt-1">This customer hasn&apos;t added any items to their wishlist yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-400">
                      {item.product && resolveImageUrl(item.product.imageUrl) ? (
                        <img src={resolveImageUrl(item.product.imageUrl)} alt={item.product.name} className="h-full w-full object-cover rounded-lg" />
                      ) : (
                        <FiHeart className="size-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.product?.name || "Unknown Product"}</p>
                      <p className="text-xs text-slate-500 mt-0.5">SKU: {item.variant?.sku || "N/A"}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-800">${(Number(item.variant?.price) || 0).toFixed(2)}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(item.addedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Cart Tab */
            cartLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-slate-100 rounded-xl" />
                  <div className="h-20 bg-slate-100 rounded-xl" />
                </div>
                <div className="h-32 bg-slate-100 rounded-xl" />
              </div>
            ) : cartError ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FiAlertCircle className="size-8 text-rose-500 mb-3" />
                <p className="text-sm font-semibold text-slate-700">Failed to load shopping cart</p>
                <p className="text-xs text-slate-400 mt-1">Please try again later.</p>
              </div>
            ) : (() => {
              const cart = cartRes?.data;
              if (!cart || cart.items.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                      <FiShoppingCart className="size-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No items found in customer cart</p>
                    <p className="text-xs text-slate-400 mt-1">This customer&apos;s cart is currently empty.</p>
                  </div>
                );
              }

              const cartColumns: Column<CartItem>[] = [
                {
                  key: "variant",
                  header: "Variant",
                  render: (item) => (
                    <span className="text-xs font-mono text-slate-600">{item.variantId}</span>
                  ),
                },
                {
                  key: "quantity",
                  header: "Qty",
                  render: (item) => (
                    <span className="text-sm font-semibold text-slate-800">{item.quantity}</span>
                  ),
                },
                {
                  key: "unitPrice",
                  header: "Unit Price",
                  render: (item) => (
                    <span className="text-sm text-slate-700">${item.unitPrice.toFixed(2)}</span>
                  ),
                },
                {
                  key: "lineTotal",
                  header: "Total",
                  render: (item) => (
                    <span className="text-sm font-bold text-slate-800">${item.lineTotal.toFixed(2)}</span>
                  ),
                },
              ];

              return (
                <div className="space-y-6">
                  <StatsGrid columns={2}>
                    <StatCard
                      label="Total Items"
                      value={cart.totalItems}
                      icon={FiPackage}
                      color="indigo"
                      variant="simple"
                    />
                    <StatCard
                      label="Cart Subtotal"
                      value={`$${cart.subtotal.toFixed(2)}`}
                      icon={FiDollarSign}
                      color="emerald"
                      variant="simple"
                    />
                  </StatsGrid>
                  <DataTable
                    columns={cartColumns}
                    data={cart.items}
                    keyExtractor={(item) => item.id}
                  />
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}

