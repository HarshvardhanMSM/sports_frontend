"use client";

import type { SubCategory } from "@/types/sub-category.types";
import SubCategoryRowActions from "./SubCategoryRowActions";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getImageUrl } from "@/lib/utils";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

interface SubCategoryTableProps {
  subCategories: SubCategory[];
  onDelete: (id: string) => void;
}

export default function SubCategoryTable({ subCategories, onDelete }: SubCategoryTableProps) {
  const columns: Column<SubCategory>[] = [
    {
      key: "image",
      header: "Image",
      cellClassName: "px-3 py-3 whitespace-nowrap",
      render: (sc) =>
        sc.image ? (
          <img
            src={getImageUrl(sc.image)}
            alt={sc.name}
            className="size-14 rounded-lg object-fill border border-slate-100 shadow-sm"
          />
        ) : (
          <div className="size-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">N/A</div>
        ),
    },
    {
      key: "name",
      header: "Name",
      render: (sc) => <span className="font-semibold text-slate-800">{sc.name}</span>,
    },
    {
      key: "parentCategory",
      header: "Parent Category",
      render: (sc) => <span className="text-slate-600 font-medium">{sc.categoryName || "—"}</span>,
    },
    {
      key: "slug",
      header: "Slug",
      render: (sc) => <span className="text-slate-500 font-mono text-xs">{sc.slug}</span>,
    },
    {
      key: "description",
      header: "Description",
      cellClassName: "px-6 py-4 max-w-[200px] truncate text-slate-500",
      render: (sc) => <>{sc.description}</>,
    },
    {
      key: "sortOrder",
      header: "Sort Order",
      render: (sc) => <span className="text-slate-800 font-semibold">{sc.sortOrder}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (sc) => <StatusBadge status={sc.isActive ? "Active" : "Inactive"} />,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (sc) => (
        <span className="text-slate-500">
          {new Date(sc.createdAt).toLocaleDateString("en-US", {
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
      render: (sc) => <SubCategoryRowActions id={sc.id} onDelete={onDelete} />,
    },
  ];

  return <DataTable columns={columns} data={subCategories} keyExtractor={(s) => s.id} />;
}
