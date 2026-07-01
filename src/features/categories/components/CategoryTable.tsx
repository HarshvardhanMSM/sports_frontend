"use client";

import type { Category } from "@/types/category.types";
import CategoryRowActions from "./CategoryRowActions";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getImageUrl } from "@/lib/utils";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

interface CategoryTableProps {
  categories: Category[];
  onDelete: (id: string) => void;
}

export default function CategoryTable({ categories, onDelete }: CategoryTableProps) {
  const columns: Column<Category>[] = [
    {
      key: "image",
      header: "Image",
      cellClassName: "px-3 py-3 whitespace-nowrap",
      render: (cat) =>
        cat.image ? (
          <img
            src={getImageUrl(cat.image)}
            alt={cat.name}
            className="size-14 rounded-lg object-fill border border-slate-100 shadow-sm"
          />
        ) : (
          <div className="size-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">N/A</div>
        ),
    },
    {
      key: "name",
      header: "Name",
      render: (cat) => <span className="font-semibold text-slate-800">{cat.name}</span>,
    },
    {
      key: "slug",
      header: "Slug",
      render: (cat) => <span className="text-slate-500 font-mono text-xs">{cat.slug}</span>,
    },
    {
      key: "description",
      header: "Description",
      cellClassName: "px-6 py-4 max-w-[200px] truncate text-slate-500",
      render: (cat) => <>{cat.description}</>,
    },
  
    {
      key: "brands",
      header: "Brands",
      render: (cat) =>
        cat.brands && cat.brands.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {cat.brands.map((brand) => (
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
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (cat) => <StatusBadge status={cat.isActive ? "Active" : "Inactive"} />,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (cat) => (
        <span className="text-slate-500">
          {new Date(cat.createdAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      cellClassName: "px-6 py-4 whitespace-nowrap text-right text-xs",
      render: (cat) => <CategoryRowActions id={cat.id} onDelete={onDelete} />,
    },
  ];

  return <DataTable columns={columns} data={categories} keyExtractor={(c) => c.id} />;
}
