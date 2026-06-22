"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useCreateCollection } from "@/hooks/useCollections";
import CollectionForm from "@/features/collections/components/CollectionForm";
import type { CreateCollectionRequest } from "@/types/collection.types";

export default function CreateCollectionPage() {
  const router = useRouter();
  const { mutateAsync: createCollection, isPending } = useCreateCollection();

  const handleSubmit = async (data: CreateCollectionRequest) => {
    await createCollection(data);
  };

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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add New Collection</h1>
          <p className="text-sm text-slate-500">Create a new curated product collection.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm max-w-full">
        <CollectionForm onSubmit={handleSubmit} onCancel={() => router.push("/collections")} isPending={isPending} />
      </div>
    </div>
  );
}
