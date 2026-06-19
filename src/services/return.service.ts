import { api } from "./api";
import type {
  ReturnListResponse,
  ReturnSingleResponse,
  ReturnActionResponse,
  ReturnListParams,
} from "@/types/return.types";

export const returnKeys = {
  all:     ()                       => ["returns"]             as const,
  lists:   ()                       => ["returns", "list"]     as const,
  list:    (p: ReturnListParams)    => ["returns", "list", p]  as const,
  details: ()                       => ["returns", "detail"]   as const,
  detail:  (id: string)             => ["returns", "detail", id] as const,
};

export const ReturnService = {
  getReturns(params?: ReturnListParams) {
    return api.get<ReturnListResponse>("/admin/returns", params);
  },

  getReturn(id: string) {
    return api.get<ReturnSingleResponse>(`/admin/returns/${id}`);
  },

  approveReturn(id: string) {
    return api.post<ReturnActionResponse>(`/admin/returns/${id}/approve`);
  },

  rejectReturn(id: string, reason: string) {
    return api.post<ReturnActionResponse>(`/admin/returns/${id}/reject`, { reason });
  },

  schedulePickup(id: string, data: { pickupDate: string; courierName?: string; notes?: string }) {
    return api.post<ReturnActionResponse>(`/admin/returns/${id}/schedule-pickup`, data);
  },

  markInTransit(id: string) {
    return api.post<ReturnActionResponse>(`/admin/returns/${id}/in-transit`);
  },

  markReceived(id: string) {
    return api.post<ReturnActionResponse>(`/admin/returns/${id}/received`);
  },

  processRefund(id: string, data: { amount: string; method: string }) {
    return api.post<ReturnActionResponse>(`/admin/returns/${id}/refund`, data);
  },

  completeReturn(id: string) {
    return api.post<ReturnActionResponse>(`/admin/returns/${id}/complete`);
  },
};
