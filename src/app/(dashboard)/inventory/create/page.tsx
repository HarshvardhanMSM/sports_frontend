"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useCreateInventory } from "@/hooks/useInventory";
import type { CreateInventoryRequest } from "@/types/inventory.types";
import InventoryForm from "@/features/inventory/components/InventoryForm";
import type { InventoryFormValues } from "@/features/inventory/components/InventoryForm";

export default function CreateInventoryPage() {
  const router = useRouter();
  const { mutateAsync: createInventory, isPending } = useCreateInventory();

  const handleSubmit = async (data: InventoryFormValues & { variantId?: string }) => {
    const body: CreateInventoryRequest = {
      variantSku: data.variantSku,
      variantId: data.variantId,
      quantity: data.quantity,
      reservedQuantity: data.reservedQuantity || undefined,
      lowStockThreshold: data.lowStockThreshold || undefined,
    };
    await createInventory(body);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/inventory"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <FiArrowLeft className="size-4" />
          Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Inventory</h1>
          <p className="text-sm text-slate-500">Add stock levels for product variants.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm max-w-full">
        <InventoryForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/inventory")}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
