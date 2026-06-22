"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiEye, FiRefreshCw, FiXCircle, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { OrderListItem } from "@/types/order.types";

interface OrdersTableProps {
  orders: OrderListItem[];
  onStatusUpdate: (order: OrderListItem) => void;
  onCancel: (order: OrderListItem) => void;
}

const STATUS_STYLES: Record<string, { bg: string; dot: string }> = {
  PENDING:           { bg: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-500" },
  CONFIRMED:         { bg: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", dot: "bg-blue-500" },
  PROCESSING:        { bg: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200", dot: "bg-indigo-500" },
  PACKED:            { bg: "bg-violet-50 text-violet-700 ring-1 ring-violet-200", dot: "bg-violet-500" },
  SHIPPED:           { bg: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200", dot: "bg-cyan-500" },
  OUT_FOR_DELIVERY:  { bg: "bg-orange-50 text-orange-700 ring-1 ring-orange-200", dot: "bg-orange-500" },
  DELIVERED:         { bg: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  CANCELLED:         { bg: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", dot: "bg-rose-500" },
  RETURN_REQUESTED:  { bg: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-500" },
  RETURNED:          { bg: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", dot: "bg-slate-400" },
};

const PAYMENT_STYLES: Record<string, string> = {
  PAID:     "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  PENDING:  "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  REFUNDED: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  FAILED:   "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

function Badge({ status, styles }: { status: string; styles: Record<string, { bg: string; dot: string }> }) {
  const s = styles[status] ?? { bg: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {status.replace(/_/g, " ")}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const cls = PAYMENT_STYLES[status] ?? "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}

/* ─── Image Lightbox ──────────────────────────────────────────────────── */

interface LightboxItem {
  imageUrl: string;
  productName: string;
  quantity?: number;
}

interface LightboxProps {
  items: LightboxItem[];
  startIndex: number;
  orderNumber: string;
  onClose: () => void;
}

function ImageLightbox({ items, startIndex, orderNumber, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const item = items[current];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 flex flex-col items-center gap-4 max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div>
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Order {orderNumber}</p>
            <p className="text-white font-semibold text-sm mt-0.5">
              {item.productName}
              {item.quantity != null && (
                <span className="ml-2 text-white/50 font-normal">× {item.quantity}</span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-9 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-square max-h-[60vh] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center shadow-2xl">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-white/30">
              <span className="text-8xl font-bold">{item.productName.charAt(0)}</span>
              <span className="text-sm">No image available</span>
            </div>
          )}

          {/* Prev / Next arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-xl bg-black/40 text-white hover:bg-black/60 transition-colors"
              >
                <FiChevronLeft className="size-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-xl bg-black/40 text-white hover:bg-black/60 transition-colors"
              >
                <FiChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {items.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {items.map((it, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`shrink-0 size-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === current
                    ? "border-white scale-110 shadow-lg"
                    : "border-white/20 opacity-60 hover:opacity-100"
                }`}
              >
                {it.imageUrl ? (
                  <img src={it.imageUrl} alt={it.productName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                    {it.productName.charAt(0)}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Counter */}
        {items.length > 1 && (
          <p className="text-white/40 text-xs">
            {current + 1} of {items.length} items
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Main Table ──────────────────────────────────────────────────────── */

export default function OrdersTable({ orders, onStatusUpdate, onCancel }: OrdersTableProps) {
  const [lightbox, setLightbox] = useState<{
    items: LightboxItem[];
    startIndex: number;
    orderNumber: string;
  } | null>(null);

  const openLightbox = (order: OrderListItem, clickedIndex: number) => {
    const items = order.items.map((item) => ({
      imageUrl: item.imageUrl ?? "",
      productName: item.productName,
      quantity: item.quantity,
    }));
    setLightbox({ items, startIndex: clickedIndex, orderNumber: order.orderNumber });
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/orders/${order.id}`} className="text-sm font-mono font-semibold text-indigo-600 hover:text-indigo-800">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">{order.userName}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {order.items.length > 0 && (
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, i) => (
                            item.imageUrl ? (
                              <button
                                key={i}
                                title={`View ${item.productName}`}
                                onClick={() => openLightbox(order, i)}
                                className="size-14 rounded-lg border-2 border-white overflow-hidden hover:scale-125 hover:z-10 hover:border-indigo-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              >
                                <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ) : (
                              <button
                                key={i}
                                title={item.productName}
                                onClick={() => openLightbox(order, i)}
                                className="size-7 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 hover:scale-125 hover:z-10 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-150 focus:outline-none"
                              >
                                {item.productName.charAt(0)}
                              </button>
                            )
                          ))}
                          {order.items.length > 3 && (
                            <button
                              onClick={() => openLightbox(order, 3)}
                              className="size-7 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 hover:scale-125 hover:z-10 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-150"
                            >
                              +{order.items.length - 3}
                            </button>
                          )}
                        </div>
                      )}
                      <span className="inline-flex items-center justify-center size-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                        {order.items.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-900">
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge status={order.status} styles={STATUS_STYLES} />
                  </td>
                  <td className="px-5 py-4">
                    <PaymentBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1 justify-end">
                      <Link
                        href={`/orders/${order.id}`}
                        className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        title="View"
                      >
                        <FiEye className="size-4" />
                      </Link>
                      <button
                        onClick={() => onStatusUpdate(order)}
                        className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        title="Update Status"
                      >
                        <FiRefreshCw className="size-4" />
                      </button>
                      {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                        <button
                          onClick={() => onCancel(order)}
                          className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          title="Cancel Order"
                        >
                          <FiXCircle className="size-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <span className="text-2xl text-slate-400">0</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">No orders found</p>
                        <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search or filter criteria.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lightbox Portal */}
      {lightbox && (
        <ImageLightbox
          items={lightbox.items}
          startIndex={lightbox.startIndex}
          orderNumber={lightbox.orderNumber}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
