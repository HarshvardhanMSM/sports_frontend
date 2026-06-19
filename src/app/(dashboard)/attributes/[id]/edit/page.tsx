"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAttribute, useUpdateAttribute } from "@/hooks/useAttributes";
import AttributeForm from "@/features/attributes/components/AttributeForm";

interface EditAttributePageProps {
  params: Promise<{ id: string }>;
}

export default function EditAttributePage({ params }: EditAttributePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useAttribute(id);
  const { mutateAsync: updateAttribute, isPending } = useUpdateAttribute(id);

  const handleSubmit = async (formData: { name: string; slug?: string; isFilterable: boolean; isRequired: boolean; sortOrder: number }) => {
    await updateAttribute({ ...formData, sortOrder: Number(formData.sortOrder) });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading attribute...</p>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center font-sans">
        <h2 className="text-lg font-bold text-slate-800">Attribute Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The attribute you are trying to edit does not exist.</p>
        <button onClick={() => router.push("/attributes")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Back to Attributes</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Edit Attribute</h1>
        <p className="text-sm text-slate-500">Update attribute details and settings.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-3xl">
        <AttributeForm
          initialData={data.data}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/attributes")}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
