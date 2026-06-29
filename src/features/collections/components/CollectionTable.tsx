"use client";

import React from "react";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import type { Collection } from "@/types/collection.types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getImageUrl } from "@/lib/utils";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

interface CollectionTableProps {
  collections: Collection[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export default function CollectionTable({ collections, onEdit, onDelete, onView }: CollectionTableProps) {
  const columns: Column<Collection>[] = [
    {
      key: "banner",
      header: "Banner",
      cellClassName: "px-3 py-3 whitespace-nowrap",
      render: (col) =>
        col.image || col.bannerImage ? (
          <img
            src={getImageUrl(col.image || col.bannerImage)}
            alt={col.name}
            className="size-14 rounded-lg object-cover border border-slate-100 shadow-sm"
          />
        ) : (
          <div className="size-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">N/A</div>
        ),
    },
    {
      key: "name",
      header: "Name",
      render: (col) => <span className="font-semibold text-slate-800">{col.name}</span>,
    },
    {
      key: "slug",
      header: "Slug",
      render: (col) => <span className="text-xs text-slate-400 font-mono">{col.slug}</span>,
    },
    {
      key: "description",
      header: "Description",
      cellClassName: "px-6 py-4 max-w-[200px] truncate text-slate-500",
      render: (col) => <>{col.description || "-"}</>,
    },
    {
      key: "status",
      header: "Status",
      render: (col) => <StatusBadge status={col.isActive ? "Active" : "Inactive"} />,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (col) => <span className="text-slate-500">{new Date(col.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      cellClassName: "px-6 py-4 whitespace-nowrap text-right text-xs",
      render: (col) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => onView(col.id)} className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEye className="size-4" /></button>
          <Can permission="collection.update">
            <button onClick={() => onEdit(col.id)} className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEdit2 className="size-4" /></button>
          </Can>
          <Can permission="collection.delete">
            <button onClick={() => onDelete(col.id)} className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><FiTrash2 className="size-4" /></button>
          </Can>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={collections} keyExtractor={(c) => c.id} />;
}
