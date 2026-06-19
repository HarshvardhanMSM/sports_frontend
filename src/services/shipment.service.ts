import { api } from "./api";
import type {
  ShipmentListResponse,
  ShipmentSingleResponse,
  ShipmentActionResponse,
  ShipmentListParams,
} from "@/types/shipment.types";

export const shipmentKeys = {
  all:     ()                        => ["shipments"]             as const,
  lists:   ()                        => ["shipments", "list"]     as const,
  list:    (p: ShipmentListParams)   => ["shipments", "list", p]  as const,
  details: ()                        => ["shipments", "detail"]   as const,
  detail:  (id: string)              => ["shipments", "detail", id] as const,
};

export const ShipmentService = {
  getShipments(params?: ShipmentListParams) {
    return api.get<ShipmentListResponse>("/admin/shipments", params);
  },

  getShipment(id: string) {
    return api.get<ShipmentSingleResponse>(`/admin/shipments/${id}`);
  },

  updateShipmentStatus(id: string, data: { status: string; notes?: string }) {
    return api.patch<ShipmentActionResponse>(`/admin/shipments/${id}/status`, data);
  },
};
