"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useCollection, useUpdateCollection } from "@/hooks/useCollections";
import CollectionForm from "@/features/collections/components/CollectionForm";
import type { UpdateCollectionRequest } from "@/types/collection.types";
import { CollectionService } from "@/services/collection.service";

interface EditCollectionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCollectionPage({ params }: EditCollectionPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isPending: isLoading, isError } = useCollection(id);
  const { mutateAsync: updateCollection, isPending: isSaving } = useUpdateCollection(id);

  const handleSubmit = async (formData: {
    name: string;
    slug?: string;
    description?: string;
    isActive: boolean;
    bannerImageFile: File | null;
    productIds: string[];
  }) => {
    const jsonPayload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      isActive: Boolean(formData.isActive),
      productIds: formData.productIds,
    };

    if (formData.bannerImageFile) {
      const fd = new FormData();
      fd.append("name", formData.name);
      if (formData.slug) fd.append("slug", formData.slug);
      if (formData.description) fd.append("description", formData.description);
      fd.append("image", formData.bannerImageFile);
      fd.append("productIds", JSON.stringify(formData.productIds));
      await CollectionService.updateCollection(id, fd);
    }

    await updateCollection(jsonPayload as unknown as UpdateCollectionRequest);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading collection details...</p>
      </div>
    );
  }

  const collection = data?.data;

  if (isError || !collection) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
        <h2 className="text-lg font-bold text-slate-800">Collection Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The collection you are trying to edit does not exist or has been deleted.</p>
        <button onClick={() => router.push("/collections")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Back to Collections</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/collections"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <FiArrowLeft className="size-4" />
          Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Collection</h1>
          <p className="text-sm text-slate-500">Modify details for {collection.name}.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm max-w-full">
        <CollectionForm initialData={collection} onSubmit={handleSubmit} onCancel={() => router.push("/collections")} isPending={isSaving} />
      </div>
    </div>
  );
}
