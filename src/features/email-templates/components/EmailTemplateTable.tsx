"use client";

import React from "react";
import type { EmailTemplate } from "@/types/email-template.types";
import EmailTemplateRowActions from "./EmailTemplateRowActions";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

interface EmailTemplateTableProps {
  templates: EmailTemplate[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EmailTemplateTable({ templates, onEdit, onDelete }: EmailTemplateTableProps) {
  const columns: Column<EmailTemplate>[] = [
    {
      key: "name",
      header: "Name",
      render: (tpl) => (
        <span className="font-semibold text-slate-800">{tpl.name}</span>
      ),
    },
    {
      key: "code",
      header: "Code",
      render: (tpl) => (
        <span className="text-xs text-slate-400 font-mono">{tpl.code}</span>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (tpl) => (
        <span className="text-slate-600">{tpl.subject}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (tpl) => (
        <StatusBadge status={tpl.isActive ? "Active" : "Inactive"} />
      ),
    },
    {
      key: "updatedAt",
      header: "Updated Date",
      render: (tpl) => (
        <span className="text-slate-500">
          {tpl.updatedAt ? new Date(tpl.updatedAt).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      cellClassName: "px-6 py-4 whitespace-nowrap text-right text-xs",
      render: (tpl) => (
        <EmailTemplateRowActions id={tpl.id} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];

  return <DataTable columns={columns} data={templates} keyExtractor={(t) => t.id} />;
}
