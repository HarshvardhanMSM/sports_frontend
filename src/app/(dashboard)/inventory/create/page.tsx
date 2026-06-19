"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
      <InventoryForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/inventory")}
        isPending={isPending}
      />
    </div>
  );
}
