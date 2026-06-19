"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Add New Brand</h1>
        <p className="text-sm text-slate-500">Partner with a new sportswear brand.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-3xl">
        <BrandForm onSubmit={handleSubmit} onCancel={handleCancel} isPending={isPending} />
      </div>
    </div>
  );
}
