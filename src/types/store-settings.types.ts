export interface StoreSettings {
  id: string;
  storeName: string;
  storeTagline: string;
  storeEmail: string;
  supportEmail: string;
  phone: string;
  whatsapp: string;
  websiteUrl: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  description: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  // latitude: string | null;
  // longitude: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStoreSettingsDto {
  storeName?: string;
  storeTagline?: string;
  storeEmail?: string;
  supportEmail?: string;
  phone?: string;
  whatsapp?: string;
  websiteUrl?: string;
  description?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
}

export interface StoreSettingsResponse {
  statusCode: number;
  message: string;
  data: StoreSettings;
}
