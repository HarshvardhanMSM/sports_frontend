"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProductRowActions from "./ProductRowActions";
import Badge from "@/components/ui/badge/Badge";
import type { Product } from "@/types/product.types";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export default function ProductTable({
  products,
  onDelete,
}: ProductTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? products.map((p) => p.id) : []);
  };

  const handleSelectRow = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setSelectedIds((prev) =>
      e.target.checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "Draft": return "warning";
      case "Inactive": return "dark";
      // case "Archived": return "error";
      default: return "default";
    }
  };

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-150 p-4 rounded-xl shadow-sm">
          <span className="text-sm font-semibold text-indigo-900">
            {selectedIds.length} product(s) selected
          </span>
          <button
            onClick={() => {
              selectedIds.forEach((id) => onDelete(id));
              setSelectedIds([]);
            }}
            className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-all"
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm max-w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-slate-600">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4 w-10">
                <input
                  type="checkbox"
                  checked={products.length > 0 && selectedIds.length === products.length}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-4"
                />
              </th>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Featured</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr
                key={product.id}
                className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product.id)}
                    onChange={(e) => handleSelectRow(e, product.id)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-4"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-10 rounded-lg object-cover border border-slate-100 shadow-sm"
                    />
                  ) : (
                    <div className="size-10 rounded-lg bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                      N/A
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                  <div className="max-w-[200px] truncate">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                  {product.brandName || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                  {product.categoryName || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge color={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.isFeatured ? (
                    <Badge color="success">Yes</Badge>
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold">No</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-xs" onClick={(e) => e.stopPropagation()}>
                  <ProductRowActions id={product.id} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-12 text-sm text-slate-500 font-medium">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}
