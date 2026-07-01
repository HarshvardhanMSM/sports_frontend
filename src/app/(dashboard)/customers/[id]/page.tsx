"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiHeart,
  FiShoppingCart,
  FiCalendar,
  FiAlertCircle,
  FiPackage,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";
import { useCustomer, useCustomerWishlist, useCustomerCart, useToggleCustomerActive, useDeleteCustomer } from "@/hooks/useCustomers";
import type { WishlistItem, CartItem } from "@/types/customer.types";
import { resolveImageUrl } from "@/lib/image";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { EmptyState } from "@/components/common/EmptyState";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const { data: res, isLoading, error, refetch } = useCustomer(id);
  const { data: wishlistRes } = useCustomerWishlist(id ?? null);

  const customer = res?.data;
  const wishlistItems: WishlistItem[] = (() => {
    if (!wishlistRes) return [];
    const d = wishlistRes as unknown as Record<string, unknown>;
    const nested = d.data as WishlistItem[] | { items: WishlistItem[] } | undefined;
    if (Array.isArray(nested)) return nested;
    if (nested && "items" in nested && Array.isArray(nested.items)) return nested.items;
    if ("items" in d && Array.isArray(d.items)) return d.items as WishlistItem[];
    return [];
  })();

  const [showWishlist, setShowWishlist] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const { data: cartRes, isLoading: cartLoading, error: cartError } = useCustomerCart(showCart ? (id ?? null) : null);

  const toggleMutation = useToggleCustomerActive();
  const deleteMutation = useDeleteCustomer();

  const handleToggleActive = async () => {
    await toggleMutation.mutateAsync(id!);
    refetch();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    await deleteMutation.mutateAsync(id!);
    router.push("/customers");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <FiAlertCircle className="size-10 text-rose-500 mb-4" />
        <p className="text-sm font-semibold text-slate-800">Failed to load customer</p>
        <button onClick={() => refetch()} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/customers")}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <FiArrowLeft className="size-4" />
          Back
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-sm text-slate-500">{customer.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                  <FiUser className="size-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Full Name</p>
                  <p className="text-slate-800 font-semibold">{customer.firstName} {customer.lastName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <FiMail className="size-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Email</p>
                  <p className="text-slate-800 font-semibold">{customer.email}</p>
                </div>
              </div>
              {customer.mobile && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <FiPhone className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Mobile</p>
                    <p className="text-slate-800 font-semibold">{customer.mobile}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                  <FiCalendar className="size-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Registered</p>
                  <p className="text-slate-800 font-semibold">{new Date(customer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Preferences & Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  {customer.isEmailVerified ? (
                    <FiCheckCircle className="size-5 text-emerald-600" />
                  ) : (
                    <FiXCircle className="size-5 text-rose-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Email Verified</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    customer.isEmailVerified ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                  }`}>
                    {customer.isEmailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <FiUser className="size-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Account Status</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    customer.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {customer.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Quick Actions</h3>
            <button
              onClick={() => setShowWishlist(true)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <FiHeart className="size-4" />
              View Wishlist ({wishlistItems.length})
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <FiShoppingCart className="size-4" />
              View Cart
            </button>
            <button
              onClick={handleToggleActive}
              disabled={toggleMutation.isPending}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiUser className="size-4" />
              {toggleMutation.isPending ? "Toggling..." : customer.isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="w-full rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiXCircle className="size-4" />
              {deleteMutation.isPending ? "Deleting..." : "Delete Customer"}
            </button>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowCart(false)} />
          <div className="relative w-full max-w-2xl bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-800">Customer Cart</h2>
                <p className="text-xs text-slate-500 mt-0.5">{customer.firstName} {customer.lastName}</p>
              </div>
              <button onClick={() => setShowCart(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <FiXCircle className="size-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {cartLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-slate-100 rounded-xl" />
                    ))}
                  </div>
                  <div className="h-8 w-48 bg-slate-200 rounded-lg" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-slate-100 rounded-xl" />
                    ))}
                  </div>
                </div>
              ) : cartError ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <FiAlertCircle className="size-8 text-rose-500 mb-3" />
                  <p className="text-sm font-semibold text-slate-700">Failed to load cart</p>
                  <button onClick={() => setShowCart(false)} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                    Close
                  </button>
                </div>
              ) : (() => {
                const cart = cartRes?.data;
                if (!cart || cart.items.length === 0) {
                  return (
                    <EmptyState
                      icon={<FiShoppingCart className="size-6 text-slate-400" />}
                      title="No items found in customer cart."
                    />
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
                  <>
                    <StatsGrid columns={3}>
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
                      <StatCard
                        label="Last Updated"
                        value={new Date().toLocaleDateString()}
                        icon={FiClock}
                        color="blue"
                        variant="simple"
                      />
                    </StatsGrid>
                    <DataTable
                      columns={cartColumns}
                      data={cart.items}
                      keyExtractor={(item) => item.id}
                    />
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Drawer */}
      {showWishlist && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowWishlist(false)} />
          <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-800">Wishlist</h2>
                <p className="text-xs text-slate-500 mt-0.5">{customer.firstName} {customer.lastName}</p>
              </div>
              <button onClick={() => setShowWishlist(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <FiXCircle className="size-5" />
              </button>
            </div>
            <div className="p-6">
              {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <FiHeart className="size-8 text-slate-300 mb-3" />
                  <p className="text-sm font-semibold text-slate-700">No wishlist items</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlistItems.map((item: WishlistItem) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
