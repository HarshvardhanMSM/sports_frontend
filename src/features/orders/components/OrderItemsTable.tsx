"use client";

import React from "react";
import type { OrderItem } from "@/types/order.types";
import { resolveImageUrl } from "@/lib/image";

interface OrderItemsTableProps {
  items: OrderItem[];
}

export default function OrderItemsTable({ items }: OrderItemsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Order Items</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3.5 text-left">Product</th>
              <th className="px-6 py-3.5 text-left">SKU</th>
              <th className="px-6 py-3.5 text-right">Qty</th>
              <th className="px-6 py-3.5 text-right">Unit Price</th>
              <th className="px-6 py-3.5 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <img
                        src={resolveImageUrl(item.imageUrl)}
                        alt={item.productName}
                        className="size-10 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                        {item.productName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-xs text-slate-400">{item.variantName}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">{item.sku}</td>
                <td className="px-6 py-4 text-right text-sm text-slate-700">{item.quantity}</td>
                <td className="px-6 py-4 text-right text-sm text-slate-700">${Number(item.unitPrice).toFixed(2)}</td>
                <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">${Number(item.totalPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
