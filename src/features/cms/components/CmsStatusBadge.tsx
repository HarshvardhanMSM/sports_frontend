import Badge from "@/components/ui/badge/Badge";

interface CmsStatusBadgeProps {
  status: "PUBLISHED" | "DRAFT";
}

export default function CmsStatusBadge({ status }: CmsStatusBadgeProps) {
  return (
    <Badge color={status === "PUBLISHED" ? "success" : "warning"}>
      {status === "PUBLISHED" ? "Published" : "Draft"}
    </Badge>
  );
}
