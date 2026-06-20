import { api } from "./api";
import type {
  ApiListResponse,
  DailySaleItem,
  RevenueReport,
  ProductReportItem,
  CategoryReportItem,
  BrandReportItem,
  CustomerReport,
  ReturnsReport,
  InventoryReport,
  MarketingReport,
  SupportReport,
} from "@/types/report.types";

export const reportKeys = {
  all:     ()                               => ["reports"]                as const,
  sales:   (p?: Record<string, string>)      => ["reports", "sales", p]   as const,
  revenue: (p?: Record<string, string>)      => ["reports", "revenue", p] as const,
  products:(p?: Record<string, string>)      => ["reports", "products", p]as const,
  categories:(p?: Record<string, string>)    => ["reports", "categories", p]as const,
  brands:  (p?: Record<string, string>)      => ["reports", "brands", p]  as const,
  customers:(p?: Record<string, string>)     => ["reports", "customers", p]as const,
  returns: (p?: Record<string, string>)      => ["reports", "returns", p] as const,
  inventory:(p?: Record<string, string>)     => ["reports", "inventory", p]as const,
  marketing:(p?: Record<string, string>)     => ["reports", "marketing", p]as const,
  support: (p?: Record<string, string>)      => ["reports", "support", p] as const,
};

export const ReportService = {
  getSales(params?: Record<string, string>) {
    return api.get<ApiListResponse<DailySaleItem[]>>("/admin/reports/sales", params)
      .then((res) => res.data);
  },
  getRevenue(params?: Record<string, string>) {
    return api.get<ApiListResponse<RevenueReport>>("/admin/reports/revenue", params)
      .then((res) => res.data);
  },
  getProducts(params?: Record<string, string>) {
    return api.get<ApiListResponse<ProductReportItem[]>>("/admin/reports/products", params)
      .then((res) => res.data);
  },
  getCategories(params?: Record<string, string>) {
    return api.get<ApiListResponse<CategoryReportItem[]>>("/admin/reports/categories", params)
      .then((res) => res.data);
  },
  getBrands(params?: Record<string, string>) {
    return api.get<ApiListResponse<BrandReportItem[]>>("/admin/reports/brands", params)
      .then((res) => res.data);
  },
  getCustomers(params?: Record<string, string>) {
    return api.get<ApiListResponse<CustomerReport>>("/admin/reports/customers", params)
      .then((res) => res.data);
  },
  getReturns(params?: Record<string, string>) {
    return api.get<ApiListResponse<ReturnsReport>>("/admin/reports/returns", params)
      .then((res) => res.data);
  },
  getInventory(params?: Record<string, string>) {
    return api.get<ApiListResponse<InventoryReport>>("/admin/reports/inventory", params)
      .then((res) => res.data);
  },
  getMarketing(params?: Record<string, string>) {
    return api.get<ApiListResponse<MarketingReport>>("/admin/reports/marketing", params)
      .then((res) => res.data);
  },
  getSupport(params?: Record<string, string>) {
    return api.get<ApiListResponse<SupportReport>>("/admin/reports/support", params)
      .then((res) => res.data);
  },
};
