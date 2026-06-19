"use client";

import { useRouter } from "next/navigation";
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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Add New Collection</h1>
        <p className="text-sm text-slate-500">Create a new curated product collection.</p>
      </div>
      <div className="max-w-3xl">
        <CollectionForm onSubmit={handleSubmit} onCancel={() => router.push("/collections")} isPending={isPending} />
      </div>
    </div>
  );
}
