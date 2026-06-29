"use client";

import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { RowActions } from "@/components/common/actions/RowActions";
import type { RowActionItem } from "@/components/common/actions/RowActions";

interface BrandRowActionsProps {
  id: string;
  onDelete: (id: string) => void;
}

export default function BrandRowActions({ id, onDelete }: BrandRowActionsProps) {
  const actions: RowActionItem[] = [
    {
      label: "Edit",
      icon: FiEdit,
      href: `/brands/edit/${id}`,
      permission: "brand.update",
    },
    {
      label: "Delete",
      icon: FiTrash2,
      onClick: () => onDelete(id),
      variant: "danger",
      permission: "brand.delete",
    },
  ];

  return <RowActions actions={actions} />;
}
