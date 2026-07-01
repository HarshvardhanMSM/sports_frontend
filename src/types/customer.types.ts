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
  product?: { id: string; name: string; imageUrl?: string } | null; 
  variant?: { id: string; sku: string; price: string } | null;
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
    customers: Customer[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalCustomers: number;
    activeCustomers: number;
    verifiedCustomers: number;
    newThisMonth: number;
    newToday: number;
  };
  timestamp?: string;
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

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CustomerCart {
  id: string;
  subtotal: number;
  totalItems: number;
  items: CartItem[];
}

export interface CartResponse {
  message: string;
  data: CustomerCart;
}
