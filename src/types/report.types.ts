// ── API Envelope ──────────────────────────────────────────────
export interface ApiListResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// ── Date param helpers ───────────────────────────────────────
export type DateRangePreset = "today" | "last7" | "last30" | "last90" | "thisMonth" | "thisYear" | "custom";

export interface DateRange {
  from: string;
  to: string;
  preset: DateRangePreset;
}

// ── /admin/reports/sales ─────────────────────────────────────
export interface DailySaleItem {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

// ── /admin/reports/revenue ───────────────────────────────────
export interface RevenueReport {
  daily: RevenueDataPoint[];
  weekly: RevenueDataPoint[];
  monthly: RevenueDataPoint[];
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

// ── /admin/reports/products ──────────────────────────────────
export interface ProductReportItem {
  productId: string;
  productName: string;
  imageUrl?: string;
  totalSold: number;
  totalRevenue: number;
  orderCount: number;
}

// ── /admin/reports/categories ────────────────────────────────
export interface CategoryReportItem {
  category: string;
  products: number;
  unitsSold: number;
  revenue: number;
  percentage: number;
}

// ── /admin/reports/brands ────────────────────────────────────
export interface BrandReportItem {
  brand: string;
  products: number;
  unitsSold: number;
  revenue: number;
  percentage: number;
}

// ── /admin/reports/customers ─────────────────────────────────
export interface CustomerReport {
  newCustomers: number;
  repeatCustomers: number;
  topSpenders: TopSpenderItem[];
  totalCustomers: number;
}

export interface TopSpenderItem {
  customerId: string;
  customerName: string;
  orderCount: number;
  totalSpent: number;
}

// ── /admin/reports/returns ───────────────────────────────────
export interface ReturnsReport {
  totalReturns: number;
  completedReturns: number;
  pendingReturns: number;
  totalRefunded: number;
  returnRate: number;
  byReason: ReturnReasonItem[];
}

export interface ReturnReasonItem {
  reason: string;
  count: number;
  totalRefunded: number;
}

// ── /admin/reports/inventory ─────────────────────────────────
export interface InventoryReport {
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalInventoryItems: number;
  lowStock: LowStockItem[];
}

export interface LowStockItem {
  inventoryId: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  unitCost: string;
  imageUrl?: string;
}

// ── /admin/reports/marketing ─────────────────────────────────
export interface MarketingReport {
  totalCampaigns: number;
  totalSpend: number;
  totalConversions: number;
  totalRevenue: number;
  roas: number;
  channels: MarketingChannelData[];
}

export interface MarketingChannelData {
  channel: string;
  spend: number;
  conversions: number;
  revenue: number;
}

// ── /admin/reports/support ──────────────────────────────────
export interface SupportReport {
  totalTickets: number;
  resolvedTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  satisfactionRate: number;
}
