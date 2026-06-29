"use client";

import React from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { RowActions } from "@/components/common/actions/RowActions";

interface CmsRowActionsProps {
  id: string;
  onDelete: (id: string) => void;
}

export default function CmsRowActions({ id, onDelete }: CmsRowActionsProps) {
  return (
    <RowActions
      actions={[
        { label: "View", icon: FiEye, href: `/cms/${id}` },
        { label: "Edit", icon: FiEdit, href: `/cms/edit/${id}`, permission: "cms.manage" },
        { label: "Delete", icon: FiTrash2, onClick: () => onDelete(id), permission: "cms.manage", variant: "danger" },
      ]}
    />
  );
}
