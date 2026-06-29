import { StatusBadge } from "@/components/common/StatusBadge";

interface CmsStatusBadgeProps {
  status: "PUBLISHED" | "DRAFT";
}

export default function CmsStatusBadge({ status }: CmsStatusBadgeProps) {
  return <StatusBadge status={status === "PUBLISHED" ? "Published" : "Draft"} />;
}
