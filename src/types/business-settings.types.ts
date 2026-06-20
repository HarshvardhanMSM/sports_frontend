export interface BusinessSettings {
  companyName: string;
  gstNumber: string;
  panNumber: string;
  cinNumber: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface UpdateBusinessSettingsDto {
  companyName?: string;
  gstNumber?: string;
  panNumber?: string;
  cinNumber?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export interface BusinessSettingsResponse {
  statusCode: number;
  message: string;
  data: BusinessSettings;
}
