"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import CmsFormModal from "@/features/cms/components/CmsFormModal";
import { useCreateCmsPage } from "@/hooks/useCmsPages";

export default function CreateCmsPage() {
  const router = useRouter();
  const { mutateAsync: createPage, isPending } = useCreateCmsPage();

  const handleSubmit = async (data: { title: string; slug: string; content: string; pageType: string; status: "DRAFT" | "PUBLISHED" }) => {
    await createPage(data);
  };

  return (
    <div className="max-w-full">
      <CmsFormModal page={null} onClose={() => router.push("/cms")} onSubmit={handleSubmit} isPending={isPending} />
    </div>
  );
}
