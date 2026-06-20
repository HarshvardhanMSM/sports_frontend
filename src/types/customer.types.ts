export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  verifiedCustomers: number;
  newThisMonth: number;
  newToday: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  variantId: string;
  product: { id: string; name: string; imageUrl?: string }; 
  variant: { id: string; sku: string; price: string };
  addedAt: string;
}

export interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CustomerListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Customer[];
    total: number;
  };
}

export interface CustomerSingleResponse {
  statusCode: number;
  message: string;
  data: Customer;
}

export interface CustomerActionResponse {
  statusCode?: number;
  message: string;
  data?: Customer;
}

export interface CustomerStatsResponse {
  statusCode: number;
  message: string;
  data: CustomerStats;
}

export interface WishlistResponse {
  statusCode: number;
  message: string;
  data: WishlistItem[] | { items: WishlistItem[]; total: number };
}
