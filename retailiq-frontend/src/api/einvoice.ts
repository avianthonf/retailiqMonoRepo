import { apiGet, apiPost } from '@/api/client';

export interface EInvoiceGenerateRequest {
  transaction_id: string;
  country_code?: string;
}

export interface EInvoiceStatusResponse {
  invoice_id: string;
  transaction_id: string;
  country_code: string;
  invoice_format: string;
  invoice_number: string | null;
  authority_ref: string | null;
  status: string;
  submitted_at: string | null;
  qr_code_url: string | null;
}

export const generateEInvoice = (payload: EInvoiceGenerateRequest) =>
  apiPost<EInvoiceStatusResponse>('/api/v2/einvoice/generate', payload);

export const getEInvoiceStatus = (invoiceId: string) =>
  apiGet<EInvoiceStatusResponse>(`/api/v2/einvoice/status/${invoiceId}`);
