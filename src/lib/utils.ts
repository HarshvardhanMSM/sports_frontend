export function getImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  const base = process.env.NEXT_PUBLIC_IMAGES_URL || process.env.NEXT_PUBLIC_API_URL || "";
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

/**
 * Safely extracts an array from various common API response shapes (envelope wrapper, nested items, etc.).
 * Returns an empty array if no array can be found or extracted.
 */
export function safeArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (!data || typeof data !== "object") return [];

  const obj = data as Record<string, unknown>;

  // Check nested data object wrappers
  if (obj.data !== null && typeof obj.data === "object") {
    const nestedData = obj.data as Record<string, unknown>;
    if (Array.isArray(nestedData)) return nestedData as T[];
    if (Array.isArray(nestedData.items)) return nestedData.items as T[];
    if (Array.isArray(nestedData.products)) return nestedData.products as T[];
    if (Array.isArray(nestedData.customers)) return nestedData.customers as T[];
    if (Array.isArray(nestedData.users)) return nestedData.users as T[];
    if (Array.isArray(nestedData.roles)) return nestedData.roles as T[];
    if (Array.isArray(nestedData.tickets)) return nestedData.tickets as T[];
    if (Array.isArray(nestedData.templates)) return nestedData.templates as T[];
    if (Array.isArray(nestedData.permissions)) return nestedData.permissions as T[];
    
    // Dynamic search within data object for the first array field
    for (const key of Object.keys(nestedData)) {
      if (Array.isArray(nestedData[key])) return nestedData[key] as T[];
    }
  }

  // Check top-level properties
  if (Array.isArray(obj.items)) return obj.items as T[];
  if (Array.isArray(obj.products)) return obj.products as T[];
  if (Array.isArray(obj.customers)) return obj.customers as T[];
  if (Array.isArray(obj.users)) return obj.users as T[];
  if (Array.isArray(obj.roles)) return obj.roles as T[];
  if (Array.isArray(obj.tickets)) return obj.tickets as T[];
  if (Array.isArray(obj.templates)) return obj.templates as T[];
  if (Array.isArray(obj.permissions)) return obj.permissions as T[];

  // Dynamic search at top-level for the first array field
  for (const key of Object.keys(obj)) {
    if (Array.isArray(obj[key])) return obj[key] as T[];
  }

  return [];
}


