import { apiGet, apiPost } from '@/api/client';

export interface TaxConfigResponse {
  tax_id: string | null;
  registration_type: string;
  state_province?: string | null;
  is_tax_enabled: boolean;
}

export interface TaxCalculationRequest {
  items: Array<Record<string, unknown>>;
  country_code?: string;
}

export interface TaxCalculationResponse {
  taxable_amount: number;
  tax_amount: number;
  breakdown: Record<string, number>;
}

export interface TaxFilingSummaryResponse {
  period: string;
  country_code: string;
  total_taxable: number;
  total_tax: number;
  invoice_count: number;
  status: string;
  compiled_at: string | null;
}

export const getTaxConfig = (countryCode = 'IN') =>
  apiGet<TaxConfigResponse>('/api/v1/tax/config', { country_code: countryCode });

export const calculateTax = (payload: TaxCalculationRequest) =>
  apiPost<TaxCalculationResponse>('/api/v1/tax/calculate', payload);

export const getTaxFilingSummary = (period: string, countryCode = 'IN') =>
  apiGet<TaxFilingSummaryResponse>('/api/v1/tax/filing-summary', { period, country_code: countryCode });
