"use client";

import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { RowActions } from "@/components/common/actions/RowActions";
import type { RowActionItem } from "@/components/common/actions/RowActions";

interface AttributeRowActionsProps {
  id: string;
  onDelete: (id: string) => void;
}

export default function AttributeRowActions({ id, onDelete }: AttributeRowActionsProps) {
  const actions: RowActionItem[] = [
    {
      label: "View Details",
      icon: FiEye,
      href: `/attributes/${id}`,
    },
    {
      label: "Edit",
      icon: FiEdit,
      href: `/attributes/${id}/edit`,
      permission: "attribute.update",
    },
    {
      label: "Delete",
      icon: FiTrash2,
      onClick: () => onDelete(id),
      variant: "danger",
      permission: "attribute.delete",
    },
  ];

  return <RowActions actions={actions} />;
}
