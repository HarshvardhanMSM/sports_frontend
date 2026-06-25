"use client";

import type { Category } from "@/types/category.types";
import CategoryRowActions from "./CategoryRowActions";
import Badge from "@/components/ui/badge/Badge";
import { getImageUrl } from "@/lib/utils";

interface CategoryTableProps {
  categories: Category[];
  onDelete: (id: string) => void;
}

export default function CategoryTable({ categories, onDelete }: CategoryTableProps) {
  if (categories.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm max-w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm text-slate-600">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4">Image</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Slug</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Products</th>
            <th className="px-6 py-4">Brands</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {categories.map((category) => (
            <tr key={category.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="px-3 py-3 whitespace-nowrap">
                {category.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    className="size-14 rounded-lg object-fill border border-slate-100 shadow-sm"
                  />
                ) : (
                  <div className="size-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                    N/A
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                {category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                {category.slug}
              </td>
              <td className="px-6 py-4 max-w-[200px] truncate text-slate-500">
                {category.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                {category.productsCount ?? 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {category.brands && category.brands.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {category.brands.map((brand) => (
                      <span
                        key={brand.id}
                        className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
                      >
                        {brand.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge color={category.isActive ? "success" : "error"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                {new Date(category.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                <CategoryRowActions id={category.id} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
