"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useBrand, useUpdateBrand, useUpdateBrandJson } from "@/hooks/useBrands";
import BrandForm from "@/features/brands/components/BrandForm";
import type { BrandFormValues } from "@/features/brands/components/BrandForm";

interface EditBrandPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBrandPage({ params }: EditBrandPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: brandRes, isLoading, error } = useBrand(id);
  const { mutateAsync: updateBrand, isPending } = useUpdateBrand(id);
  const { mutateAsync: updateBrandJson, isPending: isJsonPending } = useUpdateBrandJson(id);

  const brand = brandRes?.data;

  const handleSubmit = async (data: BrandFormValues, logoFile: File | null, categoryIds: string[]) => {
    if (logoFile) {
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("slug", data.slug);
      fd.append("description", data.description);
      fd.append("image", logoFile);
      if (categoryIds.length > 0) fd.append("categoryIds", JSON.stringify(categoryIds));
      await updateBrand(fd);
    } else {
      await updateBrandJson({
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: data.isActive,
        categoryIds,
      });
    }
  };

  const handleCancel = () => {
    router.push("/brands");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading brand details...</p>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center font-sans">
        <h2 className="text-lg font-bold text-slate-800">Brand Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The brand you are trying to edit does not exist or has been deleted.
        </p>
        <button
          onClick={handleCancel}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to Brands
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/brands"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <FiArrowLeft className="size-4" />
          Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Brand</h1>
          <p className="text-sm text-slate-500">Modify details for {brand.name}.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm max-w-full">
        <BrandForm initialData={brand} onSubmit={handleSubmit} onCancel={handleCancel} isPending={isPending || isJsonPending} />
      </div>
    </div>
  );
}
