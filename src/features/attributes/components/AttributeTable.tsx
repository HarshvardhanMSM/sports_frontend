"use client";

import type { Attribute } from "@/types/attribute.types";
import AttributeRowActions from "./AttributeRowActions";
import Badge from "@/components/ui/badge/Badge";

interface AttributeTableProps {
  attributes: Attribute[];
  onDelete: (id: string) => void;
}

export default function AttributeTable({ attributes, onDelete }: AttributeTableProps) {
  if (attributes.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm max-w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm text-slate-600">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Slug</th>
            <th className="px-6 py-4">Filterable</th>
            <th className="px-6 py-4">Required</th>
            <th className="px-6 py-4">Sort Order</th>
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {attributes.map((attr) => (
            <tr key={attr.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">{attr.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">{attr.slug}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge color={attr.isFilterable ? "success" : "dark"}>
                  {attr.isFilterable ? "Yes" : "No"}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge color={attr.isRequired ? "primary" : "dark"}>
                  {attr.isRequired ? "Yes" : "No"}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-semibold">{attr.sortOrder}</td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                {new Date(attr.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                <AttributeRowActions id={attr.id} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
