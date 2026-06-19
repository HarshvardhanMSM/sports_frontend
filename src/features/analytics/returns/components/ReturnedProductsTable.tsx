"use client";

import React from "react";
import { FiPackage } from "react-icons/fi";
import type { ReturnProduct } from "@/types/return-analytics.types";

interface Props {
  data: ReturnProduct[] | undefined;
  isLoading: boolean;
}

export default function ReturnedProductsTable({ data, isLoading }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Most Returned Products</h2>
        <p className="text-xs text-slate-500 mt-0.5">Products with highest return volume</p>
      </div>
      {isLoading ? (
        <div className="p-6 animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm font-semibold text-slate-500">No product return data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3.5 text-left">Product</th>
                <th className="px-6 py-3.5 text-left">Variant</th>
                <th className="px-6 py-3.5 text-right">Returns</th>
                <th className="px-6 py-3.5 text-right">Return Rate</th>
                <th className="px-6 py-3.5 text-right">Revenue Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((product, i) => (
                <tr key={product.productId || i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                        <FiPackage className="size-5" />
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{product.productName ?? "Unknown Product"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">{product.variantName ?? "-"}</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800">{product.returnCount ?? 0}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-rose-600">{Number(product.returnRate ?? 0).toFixed(1)}%</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                    -${Number(product.revenueLoss ?? 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
