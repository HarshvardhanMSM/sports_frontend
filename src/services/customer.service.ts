import { api } from "./api";
import type {
  CustomerListResponse,
  CustomerSingleResponse,
  CustomerActionResponse,
  CustomerStatsResponse,
  WishlistResponse,
  CustomerListParams,
} from "@/types/customer.types";

export const CustomerService = {
  getAll(params?: CustomerListParams) {
    return api.get<CustomerListResponse>("/admin/customers", params);
  },

  getById(id: string) {
    return api.get<CustomerSingleResponse>(`/admin/customers/${id}`);
  },

  getStats() {
    return api.get<CustomerStatsResponse>("/admin/customers/stats");
  },

  getWishlist(userId: string) {
    return api.get<WishlistResponse>(`/admin/wishlist/${userId}`);
  },

  toggleActive(id: string) {
    return api.patch<CustomerActionResponse>(`/admin/customers/${id}/toggle-active`);
  },

  delete(id: string) {
    return api.delete<CustomerActionResponse>(`/admin/customers/${id}`);
  },
};
