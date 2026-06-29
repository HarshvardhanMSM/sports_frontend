"use client";

import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { RowActions } from "@/components/common/actions/RowActions";
import type { RowActionItem } from "@/components/common/actions/RowActions";

interface SubCategoryRowActionsProps {
  id: string;
  onDelete: (id: string) => void;
}

export default function SubCategoryRowActions({ id, onDelete }: SubCategoryRowActionsProps) {
  const actions: RowActionItem[] = [
    {
      label: "View Details",
      icon: FiEye,
      href: `/sub-categories/${id}`,
    },
    {
      label: "Edit",
      icon: FiEdit,
      href: `/sub-categories/${id}/edit`,
    },
    {
      label: "Delete",
      icon: FiTrash2,
      onClick: () => onDelete(id),
      variant: "danger",
    },
  ];

  return <RowActions actions={actions} />;
}
