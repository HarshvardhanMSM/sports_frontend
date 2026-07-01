"use client";

import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { RowActions } from "@/components/common/actions/RowActions";
import type { RowActionItem } from "@/components/common/actions/RowActions";

interface EmailTemplateRowActionsProps {
  id: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EmailTemplateRowActions({ id, onEdit, onDelete }: EmailTemplateRowActionsProps) {
  const actions: RowActionItem[] = [
    {
      label: "Edit",
      icon: FiEdit,
      onClick: () => onEdit(id),
      permission: "email_template.update",
    },
    {
      label: "Delete",
      icon: FiTrash2,
      onClick: () => onDelete(id),
      variant: "danger",
      permission: "email_template.delete",
    },
  ];

  return <RowActions actions={actions} />;
}
