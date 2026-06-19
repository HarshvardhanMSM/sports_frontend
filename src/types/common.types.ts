// ─────────────────────────────────────────────────────────────────
// COMMON TYPES — shared across every domain
// ─────────────────────────────────────────────────────────────────

/** Standard envelope most REST APIs return. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** Paginated list envelope. */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/** Generic query params for list endpoints. */
export interface ListParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  status?: string;
}

export type EntityStatus = "Active" | "Inactive";
export type ID = string;
