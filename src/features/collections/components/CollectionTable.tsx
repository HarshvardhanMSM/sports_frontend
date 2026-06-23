"use client";

import React from "react";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import type { Collection } from "@/types/collection.types";
import Badge from "@/components/ui/badge/Badge";
import { getImageUrl } from "@/lib/utils";

interface CollectionTableProps {
  collections: Collection[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export default function CollectionTable({ collections, onEdit, onDelete, onView }: CollectionTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm max-w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm text-slate-600">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4">Banner</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Slug</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {collections.map((col) => (
            <tr key={col.id} className="group hover:bg-slate-50/50 transition-colors">
               <td className="px-6 py-4 whitespace-nowrap">
                {col.image || col.bannerImage ? (
                  <img
                    src={getImageUrl(col.image || col.bannerImage)}
                    alt={col.name}
                    className="size-10 rounded-lg object-cover border border-slate-100 shadow-sm"
                  />
                ) : (
                  <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">N/A</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">{col.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-mono">{col.slug}</td>
              <td className="px-6 py-4 max-w-[200px] truncate text-slate-500">{col.description || "-"}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge color={col.isActive ? "success" : "error"}>{col.isActive ? "Active" : "Inactive"}</Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-500">{new Date(col.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => onView(col.id)} className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEye className="size-4" /></button>
                  <Can permission="collection.update">
                    <button onClick={() => onEdit(col.id)} className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEdit2 className="size-4" /></button>
                  </Can>
                  <Can permission="collection.delete">
                    <button onClick={() => onDelete(col.id)} className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><FiTrash2 className="size-4" /></button>
                  </Can>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
