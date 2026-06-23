/**
 * Maps route paths to required permission slugs.
 * Used by PermissionGuard and Sidebar to gate access.
 *
 * For nested routes (e.g. /products/123), the guard matches by prefix.
 */
export const ROUTE_PERMISSIONS: Record<string, string> = {
  "/dashboard": "dashboard.view",

  "/categories": "category.view",
  "/sub-categories": "category.view",
  "/products": "product.view",
  "/brands": "brand.view",
  "/collections": "collection.view",
  "/attributes": "attribute.view",
  "/product-reviews": "review.view",

  "/inventory": "inventory.view",
  "/stock-movements": "inventory.view",
  "/inventory-alerts": "inventory.view",
  "/inventory-reports": "inventory.view",

  "/orders": "order.view",
  "/returns": "return.view",
  "/shipments": "shipment.view",

  "/customers": "customer.view",
  "/customer-support": "support.view",

  "/cms": "cms.view",
  "/pages": "cms.view",
  "/faq": "cms.view",
  "/terms": "cms.view",
  "/privacy": "cms.view",

  "/reports/sales": "reports.view",
  "/financial-reports": "reports.view",
  "/reports/products": "reports.view",
  "/reports/customers": "reports.view",
  "/analytics/returns": "reports.view",

  "/admin-users": "admin.view",
  "/roles": "roles.manage",
  "/permissions": "permissions.manage",
  "/audit-logs": "audit.view",

  "/settings/general": "settings.view",
  "/settings/delivery-charges": "delivery-charge.view",
};

/**
 * Finds the required permission for a given pathname.
 * Tries exact match first, then falls back to longest prefix match.
 */
export function getRoutePermission(pathname: string): string | undefined {
  if (ROUTE_PERMISSIONS[pathname]) return ROUTE_PERMISSIONS[pathname];

  const sortedRoutes = Object.keys(ROUTE_PERMISSIONS).sort(
    (a, b) => b.length - a.length,
  );
  for (const route of sortedRoutes) {
    if (pathname.startsWith(route + "/") || pathname.startsWith(route + "?")) {
      return ROUTE_PERMISSIONS[route];
    }
  }

  return undefined;
}
