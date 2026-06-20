import { api } from "./api";
import type {
  DeliveryCharge,
  CreateDeliveryChargeDto,
  UpdateDeliveryChargeDto,
  AuditEntry,
  DeliveryChargeListResponse,
  DeliveryChargeSingleResponse,
  AuditHistoryResponse,
} from "@/types/delivery-charge.types";

export const deliveryChargeKeys = {
  all:      ()                            => ["delivery-charges"]               as const,
  list:     ()                            => ["delivery-charges", "list"]       as const,
  detail:   (id: string)                  => ["delivery-charges", "detail", id] as const,
  history:  (id: string)                  => ["delivery-charges", "history", id]as const,
};

export const DeliveryChargeService = {
  async getAll(): Promise<DeliveryCharge[]> {
    const res = await api.get<DeliveryChargeListResponse>("/admin/delivery-charges");
    return res.data.items;
  },

  async getById(id: string): Promise<DeliveryCharge> {
    const res = await api.get<DeliveryChargeSingleResponse>(`/admin/delivery-charges/${id}`);
    return res.data;
  },

  async create(data: CreateDeliveryChargeDto): Promise<DeliveryCharge> {
    const res = await api.post<DeliveryChargeSingleResponse>("/admin/delivery-charges", data);
    return res.data;
  },

  async update(id: string, data: UpdateDeliveryChargeDto): Promise<DeliveryCharge> {
    const res = await api.patch<DeliveryChargeSingleResponse>(`/admin/delivery-charges/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete<void>(`/admin/delivery-charges/${id}`);
  },

  async toggle(id: string): Promise<DeliveryCharge> {
    const res = await api.patch<DeliveryChargeSingleResponse>(`/admin/delivery-charges/${id}/toggle`);
    return res.data;
  },

  async getHistory(id: string): Promise<AuditEntry[]> {
    const res = await api.get<AuditHistoryResponse>(`/admin/delivery-charges/${id}/history`);
    return res.data;
  },
};
