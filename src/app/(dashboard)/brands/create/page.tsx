"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useCreateBrand } from "@/hooks/useBrands";
import BrandForm from "@/features/brands/components/BrandForm";
import type { BrandFormValues } from "@/features/brands/components/BrandForm";

export default function CreateBrandPage() {
  const router = useRouter();
  const { mutateAsync: createBrand, isPending } = useCreateBrand();

  const handleSubmit = async (data: BrandFormValues, logoFile: File | null, categoryIds: string[]) => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("slug", data.slug);
    fd.append("description", data.description);
    if (logoFile) fd.append("image", logoFile);
    if (categoryIds.length > 0) fd.append("categoryIds", JSON.stringify(categoryIds));
    await createBrand(fd);
  };

  const handleCancel = () => {
    router.push("/brands");
  };

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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add New Brand</h1>
          <p className="text-sm text-slate-500">Partner with a new sportswear brand.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm max-w-full">
        <BrandForm onSubmit={handleSubmit} onCancel={handleCancel} isPending={isPending} />
      </div>
    </div>
  );
}
