"use client";

import type { Attribute } from "@/types/attribute.types";
import AttributeRowActions from "./AttributeRowActions";
import Badge from "@/components/ui/badge/Badge";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

interface AttributeTableProps {
  attributes: Attribute[];
  onDelete: (id: string) => void;
}

export default function AttributeTable({ attributes, onDelete }: AttributeTableProps) {
  const columns: Column<Attribute>[] = [
    {
      key: "name",
      header: "Name",
      render: (attr) => <span className="font-semibold text-slate-800">{attr.name}</span>,
    },
    {
      key: "slug",
      header: "Slug",
      render: (attr) => <span className="text-slate-500 font-mono text-xs">{attr.slug}</span>,
    },
    {
      key: "isFilterable",
      header: "Filterable",
      render: (attr) => (
        <Badge color={attr.isFilterable ? "success" : "dark"}>
          {attr.isFilterable ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "isRequired",
      header: "Required",
      render: (attr) => (
        <Badge color={attr.isRequired ? "primary" : "dark"}>
          {attr.isRequired ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "sortOrder",
      header: "Sort Order",
      render: (attr) => <span className="text-slate-800 font-semibold">{attr.sortOrder}</span>,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (attr) => (
        <span className="text-slate-500">
          {new Date(attr.createdAt).toLocaleDateString("en-US", {
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
      render: (attr) => <AttributeRowActions id={attr.id} onDelete={onDelete} />,
    },
  ];

  return <DataTable columns={columns} data={attributes} keyExtractor={(a) => a.id} />;
}
