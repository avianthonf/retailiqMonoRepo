export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error: string | null;
  meta?: PaginationMeta;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
