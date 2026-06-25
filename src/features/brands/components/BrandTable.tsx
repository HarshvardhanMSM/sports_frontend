"use client";

import React from "react";
import type { Brand } from "@/types/brand.types";
import BrandRowActions from "./BrandRowActions";
import Badge from "@/components/ui/badge/Badge";
import { getImageUrl } from "@/lib/utils";

interface BrandTableProps {
  brands: Brand[];
  onDelete: (id: string) => void;
}

export default function BrandTable({ brands, onDelete }: BrandTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm max-w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm text-slate-600">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4">Logo</th>
            <th className="px-6 py-4">Brand Name</th>
            <th className="px-6 py-4">Slug</th>
            <th className="px-6 py-4">Products</th>
            <th className="px-6 py-4">Categories</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Created Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {brands.map((brand) => (
            <tr key={brand.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="px-3 py-3 whitespace-nowrap">
                <div className="flex items-center justify-center size-14 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                  {brand.logo ? (
                    <img
                      src={getImageUrl(brand.logo)}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs font-bold text-slate-300">{brand.name.charAt(0)}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                {brand.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-mono">
                {brand.slug}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-semibold">
                {brand.productsCount ?? 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {brand.categories && brand.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {brand.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge color={brand.isActive ? "success" : "error"}>
                  {brand.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                {brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                <BrandRowActions id={brand.id} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
