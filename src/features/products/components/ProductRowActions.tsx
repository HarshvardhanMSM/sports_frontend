"use client";

import React from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { RowActions } from "@/components/common/actions/RowActions";

interface ProductRowActionsProps {
  id: string;
  onDelete: (id: string) => void;
}

export default function ProductRowActions({ id, onDelete }: ProductRowActionsProps) {
  return (
    <RowActions
      actions={[
        { label: "View Details", icon: FiEye, href: `/products/${id}` },
        { label: "Edit", icon: FiEdit, href: `/products/edit/${id}`, permission: "product.update" },
        { label: "Delete", icon: FiTrash2, onClick: () => onDelete(id), permission: "product.delete", variant: "danger" },
      ]}
    />
  );
}
