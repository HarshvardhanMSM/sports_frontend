"use client";

import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { RowActions } from "@/components/common/actions/RowActions";
import type { RowActionItem } from "@/components/common/actions/RowActions";

interface CategoryRowActionsProps {
  id: string;
  onDelete: (id: string) => void;
}

export default function CategoryRowActions({ id, onDelete }: CategoryRowActionsProps) {
  const actions: RowActionItem[] = [
    {
      label: "View & Edit",
      icon: FiEye,
      href: `/categories/${id}/edit`,
      permission: "category.update",
    },
    {
      label: "Edit",
      icon: FiEdit,
      href: `/categories/${id}/edit`,
      permission: "category.update",
    },
    {
      label: "Delete",
      icon: FiTrash2,
      onClick: () => onDelete(id),
      variant: "danger",
      permission: "category.delete",
    },
  ];

  return <RowActions actions={actions} />;
}
