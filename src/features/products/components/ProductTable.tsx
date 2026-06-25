"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProductRowActions from "./ProductRowActions";
import BulkDeleteConfirmModal from "./BulkDeleteConfirmModal";
import Badge from "@/components/ui/badge/Badge";
import type { Product } from "@/types/product.types";
import { resolveImageUrl } from "@/lib/image";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  isBulkDeleting?: boolean;
}

export default function ProductTable({
  products,
  onDelete,
  onBulkDelete,
  isBulkDeleting,
}: ProductTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? products.map((p) => p.id) : []);
  };

  const handleSelectRow = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setSelectedIds((prev) =>
      e.target.checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleBulkDelete = () => {
    onBulkDelete?.(selectedIds);
    setSelectedIds([]);
    setShowBulkConfirm(false);
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Clear Selection
            </button>
            <button
              onClick={() => setShowBulkConfirm(true)}
              className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-all"
            >
              Delete Selected
            </button>
          </div>
          {showBulkConfirm && (
            <BulkDeleteConfirmModal
              count={selectedIds.length}
              onClose={() => { setShowBulkConfirm(false); }}
              onConfirm={handleBulkDelete}
              isPending={isBulkDeleting ?? false}
            />
          )}
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
                <td className="px-3 py-3 whitespace-nowrap">
                  {(() => {
                    const primaryImg = product.images?.find((img) => img.isPrimary) || product.images?.[0];
                    const imgUrl = primaryImg?.imageUrl || product.image;
                    return imgUrl ? (
                      <img
                        src={resolveImageUrl(imgUrl)}
                        alt={product.name}
                        className="size-16 rounded-lg object-fill border border-slate-100 shadow-sm"
                      />
                    ) : (
                      <div className="size-14 rounded-lg bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                        N/A
                      </div>
                    );
                  })()}
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
                    <span className="text-xs text-slate-400 font-semibold">
                      <Badge color="error">No</Badge>

                    </span>
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
