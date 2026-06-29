"use client";

import React from "react";
import type { Brand } from "@/types/brand.types";
import BrandRowActions from "./BrandRowActions";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getImageUrl } from "@/lib/utils";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

interface BrandTableProps {
  brands: Brand[];
  onDelete: (id: string) => void;
}

export default function BrandTable({ brands, onDelete }: BrandTableProps) {
  const columns: Column<Brand>[] = [
    {
      key: "logo",
      header: "Logo",
      cellClassName: "px-3 py-3 whitespace-nowrap",
      render: (brand) => (
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
      ),
    },
    {
      key: "name",
      header: "Brand Name",
      render: (brand) => (
        <span className="font-semibold text-slate-800">{brand.name}</span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (brand) => (
        <span className="text-xs text-slate-400 font-mono">{brand.slug}</span>
      ),
    },
    {
      key: "categories",
      header: "Categories",
      render: (brand) =>
        brand.categories && brand.categories.length > 0 ? (
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
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (brand) => (
        <StatusBadge status={brand.isActive ? "Active" : "Inactive"} />
      ),
    },
    {
      key: "createdAt",
      header: "Created Date",
      render: (brand) => (
        <span className="text-slate-500">
          {brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      cellClassName: "px-6 py-4 whitespace-nowrap text-right text-xs",
      render: (brand) => <BrandRowActions id={brand.id} onDelete={onDelete} />,
    },
  ];

  return <DataTable columns={columns} data={brands} keyExtractor={(b) => b.id} />;
}
