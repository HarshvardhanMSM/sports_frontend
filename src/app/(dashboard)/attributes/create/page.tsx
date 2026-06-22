"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
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
      <div className="flex items-center gap-4">
        <Link
          href="/attributes"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <FiArrowLeft className="size-4" />
          Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add New Attribute</h1>
          <p className="text-sm text-slate-500">Create a new product attribute.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm max-w-full">
        <AttributeForm onSubmit={handleSubmit} onCancel={() => router.push("/attributes")} isPending={isPending} />
      </div>
    </div>
  );
}
