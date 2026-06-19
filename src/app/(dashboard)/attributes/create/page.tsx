"use client";

import { useRouter } from "next/navigation";
import { useCreateAttribute } from "@/hooks/useAttributes";
import AttributeForm from "@/features/attributes/components/AttributeForm";

export default function CreateAttributePage() {
  const router = useRouter();
  const { mutateAsync: createAttribute, isPending } = useCreateAttribute();

  const handleSubmit = async (data: { name: string; slug?: string; isFilterable: boolean; isRequired: boolean; sortOrder: number }) => {
    await createAttribute({ ...data, sortOrder: Number(data.sortOrder) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Add New Attribute</h1>
        <p className="text-sm text-slate-500">Create a new product attribute.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-3xl">
        <AttributeForm onSubmit={handleSubmit} onCancel={() => router.push("/attributes")} isPending={isPending} />
      </div>
    </div>
  );
}
