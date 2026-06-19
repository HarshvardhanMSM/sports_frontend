import { api } from "./api";
import type {
  OrderListResponse,
  OrderSingleResponse,
  OrderStatusUpdateResponse,
  OrderCancelResponse,
  OrderListParams,
} from "@/types/order.types";

export const orderKeys = {
  all:     ()                        => ["orders"]                  as const,
  lists:   ()                        => ["orders", "list"]          as const,
  list:    (p: OrderListParams)      => ["orders", "list", p]       as const,
  details: ()                        => ["orders", "detail"]        as const,
  detail:  (id: string)              => ["orders", "detail", id]    as const,
};

export const OrderService = {
  getOrders(params?: OrderListParams) {
    return api.get<OrderListResponse>("/admin/orders", params);
  },

  getOrder(id: string) {
    return api.get<OrderSingleResponse>(`/admin/orders/${id}`);
  },

  updateOrderStatus(id: string, status: string) {
    return api.patch<OrderStatusUpdateResponse>(`/admin/orders/${id}/status`, { status });
  },

  cancelOrder(id: string, reason: string) {
    return api.patch<OrderCancelResponse>(`/admin/orders/${id}/cancel`, { reason });
  },
};
