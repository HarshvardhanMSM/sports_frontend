/**
 * ─────────────────────────────────────────────────────────────────
 * ORDER SERVICE + QUERY KEYS
 * ─────────────────────────────────────────────────────────────────
 */

import { api } from "./api";
import type { ListParams, PaginatedResponse } from "@/types/common.types";

// ── Types (inline for now — expand into order.types.ts as needed) ──

export type FullOrderStatus = "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled";
export type PaymentStatus   = "Paid" | "Pending" | "Refunded" | "Failed";
export type ReturnStatus    = "Pending" | "Approved" | "Refunded" | "Rejected";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: FullOrderStatus;
  paymentStatus: PaymentStatus;
}

export interface Return {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  reason: string;
  amount: number;
  status: ReturnStatus;
  date: string;
}

export interface OrderListParams extends ListParams {
  status?: FullOrderStatus | "All";
  paymentStatus?: PaymentStatus | "All";
  dateFrom?: string;
  dateTo?: string;
}

// ── Query Keys ────────────────────────────────────────────────────

export const orderKeys = {
  all:     ()                          => ["orders"]                    as const,
  lists:   ()                          => ["orders", "list"]            as const,
  list:    (params: OrderListParams)   => ["orders", "list", params]    as const,
  detail:  (id: string)               => ["orders", "detail", id]      as const,
  returns: ()                          => ["returns"]                   as const,
  return:  (id: string)               => ["returns", "detail", id]     as const,
};

// ── API Functions ─────────────────────────────────────────────────

export const OrderService = {
  /** GET /api/orders */
  getOrders(params?: OrderListParams) {
    return api.get<PaginatedResponse<Order>>("/api/orders", params);
  },

  /** GET /api/orders/:id */
  getOrder(id: string) {
    return api.get<Order>(`/api/orders/${id}`);
  },

  /** PATCH /api/orders/:id/status */
  updateOrderStatus(id: string, status: FullOrderStatus) {
    return api.patch<Order>(`/api/orders/${id}/status`, { status });
  },

  /** GET /api/returns */
  getReturns(params?: ListParams) {
    return api.get<PaginatedResponse<Return>>("/api/returns", params);
  },

  /** GET /api/returns/:id */
  getReturn(id: string) {
    return api.get<Return>(`/api/returns/${id}`);
  },

  /** PATCH /api/returns/:id/status */
  updateReturnStatus(id: string, status: ReturnStatus) {
    return api.patch<Return>(`/api/returns/${id}/status`, { status });
  },
};
