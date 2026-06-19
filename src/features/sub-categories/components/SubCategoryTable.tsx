"use client";

import type { SubCategory } from "@/types/sub-category.types";
import SubCategoryRowActions from "./SubCategoryRowActions";
import Badge from "@/components/ui/badge/Badge";
import { getImageUrl } from "@/lib/utils";

interface SubCategoryTableProps {
  subCategories: SubCategory[];
  onDelete: (id: string) => void;
}

export default function SubCategoryTable({ subCategories, onDelete }: SubCategoryTableProps) {
  if (subCategories.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm max-w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm text-slate-600">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4">Image</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Parent Category</th>
            <th className="px-6 py-4">Slug</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Sort Order</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {subCategories.map((sc) => (
            <tr key={sc.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                {sc.image ? (
                  <img
                    src={getImageUrl(sc.image)}
                    alt={sc.name}
                    className="size-10 rounded-lg object-cover border border-slate-100 shadow-sm"
                  />
                ) : (
                  <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">N/A</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">{sc.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">{sc.categoryName || "—"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">{sc.slug}</td>
              <td className="px-6 py-4 max-w-[200px] truncate text-slate-500">{sc.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-semibold">{sc.sortOrder}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge color={sc.isActive ? "success" : "error"}>
                  {sc.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                {new Date(sc.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                <SubCategoryRowActions id={sc.id} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
