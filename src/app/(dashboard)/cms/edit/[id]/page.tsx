"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import CmsFormModal from "@/features/cms/components/CmsFormModal";
import { useCmsPage, useUpdateCmsPage } from "@/hooks/useCmsPages";

interface EditCmsPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCmsPage({ params }: EditCmsPageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const { data: pageRes, isLoading, error } = useCmsPage(id);
  const { mutateAsync: updatePage, isPending } = useUpdateCmsPage(id);

  const page = pageRes?.data;

  const handleSubmit = async (data: { title: string; slug: string; content: string; pageType: string; status: "DRAFT" | "PUBLISHED" }) => {
    await updatePage(data);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading page details...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center font-sans">
        <h2 className="text-lg font-bold text-slate-800">Page Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The page you are trying to edit does not exist or has been deleted.
        </p>
        <Link
          href="/cms"
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to Pages
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-full">
      <CmsFormModal page={page} onClose={() => router.push("/cms")} onSubmit={handleSubmit} isPending={isPending} />
    </div>
  );
}
