"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useInventoryItem, useUpdateInventory } from "@/hooks/useInventory";
import type { UpdateInventoryRequest } from "@/types/inventory.types";
import InventoryForm from "@/features/inventory/components/InventoryForm";
import type { InventoryFormValues } from "@/features/inventory/components/InventoryForm";

export default function EditInventoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isLoading } = useInventoryItem(id);
  const { mutateAsync: updateInventory, isPending } = useUpdateInventory(id ?? "");

  if (id == null) {
    router.push("/inventory");
    return null;
  }

  const item = data?.data;

  const handleSubmit = async (formData: InventoryFormValues & { variantId?: string; variantSku?: string }) => {
    const body: UpdateInventoryRequest = {
      variantId: formData.variantId,
      variantSku: formData.variantSku,
      quantity: formData.quantity,
      reservedQuantity: formData.reservedQuantity || undefined,
      reorderPoint: formData.reorderPoint || undefined,
      lowStockThreshold: formData.lowStockThreshold || undefined,
      reorderQuantity: formData.reorderQuantity || undefined,
    };
    await updateInventory(body);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm font-semibold text-slate-800">Inventory item not found</p>
        <button onClick={() => router.push("/inventory")} className="mt-4 text-sm text-indigo-600 hover:underline">
          Back to inventory
        </button>
      </div>
    );
  }

  const defaultValues: InventoryFormValues = {
    variantSku: item.variantSku ?? "",
    quantity: item.quantity,
    reservedQuantity: item.reservedQuantity,
    reorderPoint: item.reorderPoint,
    lowStockThreshold: item.lowStockThreshold,
    reorderQuantity: item.reorderQuantity,
  };

  return (
    <div className="space-y-6">
      <InventoryForm
        defaultValues={defaultValues}
        initialVariant={{ variantId: item.variantId, variantSku: item.variantSku ?? "" }}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/inventory")}
        isPending={isPending}
      />
    </div>
  );
}
