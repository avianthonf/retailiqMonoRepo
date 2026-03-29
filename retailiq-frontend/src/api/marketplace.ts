import { request } from '@/api/client';
import type {
  CreateMarketplaceOrderRequest,
  CreateMarketplaceOrderResponse,
  CreateRfqRequest,
  MarketplaceSearchRequest,
  SupplierOnboardRequest,
  SupplierOnboardResponse,
} from '@/types/api';
import type {
  MarketplaceCatalogItem,
  MarketplaceOrder,
  MarketplaceRecommendation,
  MarketplaceRfq,
  MarketplaceTracking,
} from '@/types/models';

const BASE = '/api/v1/marketplace';

interface RawCatalogItem {
  id?: string | number;
  sku?: string;
  name?: string;
  category?: string;
  unit_price?: number;
  moq?: number;
  supplier_profile_id?: string | number | null;
}

interface RawRecommendation {
  id?: string | number;
  product_name?: string;
  category?: string;
  urgency?: string;
  suggested_qty?: number;
  suggested_supplier_id?: string | number | null;
}

interface RawRfqResponse {
  rfq_id?: string | number;
  status?: string;
}

interface RawRfqResponseItem {
  id?: string | number;
  supplier_profile_id?: string | number;
  quoted_items?: unknown;
  total_price?: number;
  delivery_days?: number;
  status?: string;
}

interface RawRfq {
  id?: string | number;
  items?: Array<{ product_name?: string; quantity?: number; specifications?: string }>;
  status?: string;
  matched_suppliers_count?: number;
  created_at?: string;
  responses?: RawRfqResponseItem[];
}

interface RawOrderRecord {
  id?: string | number;
  order_number?: string;
  supplier_profile_id?: string | number;
  status?: string;
  total?: number;
  payment_status?: string;
  financed?: boolean;
  created_at?: string;
  expected_delivery?: string;
  subtotal?: number;
  tax?: number;
  shipping_cost?: number;
  loan_id?: string | number | null;
  shipping_tracking?: unknown;
  items?: Array<{
    catalog_item_id?: string | number;
    quantity?: number;
    unit_price?: number;
    subtotal?: number;
    product_name?: string;
    name?: string;
  }>;
}

interface RawTrackingEvent {
  status?: string;
  location?: string;
  timestamp?: string;
  provider?: string;
  eta?: string;
  delivered?: boolean;
}

interface RawTrackingResponse {
  status?: string;
  tracking_events?: RawTrackingEvent[];
  estimated_delivery?: string;
  logistics_provider?: string;
}

interface RawListOrdersResponse {
  orders?: RawOrderRecord[];
  total?: number;
}

const supplierLabel = (supplierProfileId?: string | number | null) =>
  supplierProfileId === null || supplierProfileId === undefined ? 'Unknown supplier' : `Supplier #${supplierProfileId}`;

const mapCatalogItem = (item: RawCatalogItem): MarketplaceCatalogItem => ({
  id: String(item.id ?? item.sku ?? ''),
  name: item.name ?? 'Catalog item',
  category: item.category ?? 'General',
  price: Number(item.unit_price ?? 0),
  supplier_name: supplierLabel(item.supplier_profile_id),
  rating: 0,
  image_url: null,
});

const mapRecommendation = (item: RawRecommendation): MarketplaceRecommendation => ({
  id: String(item.id ?? ''),
  product_name: item.product_name ?? 'Recommended item',
  category: item.category ?? 'General',
  urgency: item.urgency ?? 'normal',
  suggested_qty: Number(item.suggested_qty ?? 0),
  suggested_supplier_id: item.suggested_supplier_id ?? null,
});

const mapRfq = (rfq: RawRfq): MarketplaceRfq => ({
  id: String(rfq.id ?? ''),
  items: Array.isArray(rfq.items)
    ? rfq.items.map((item) => ({
        product_name: item.product_name ?? 'Item',
        quantity: Number(item.quantity ?? 0),
        specifications: item.specifications,
      }))
    : [],
  status: rfq.status ?? 'OPEN',
  matched_suppliers_count: Number(rfq.matched_suppliers_count ?? 0),
  created_at: rfq.created_at ?? new Date().toISOString(),
  responses: Array.isArray(rfq.responses)
    ? rfq.responses.map((response) => ({
        id: String(response.id ?? ''),
        supplier_profile_id: String(response.supplier_profile_id ?? ''),
        quoted_items: response.quoted_items ?? [],
        total_price: Number(response.total_price ?? 0),
        delivery_days: Number(response.delivery_days ?? 0),
        status: response.status ?? 'PENDING',
      }))
    : [],
});

const mapOrderItems = (items?: RawOrderRecord['items']) =>
  Array.isArray(items)
    ? items.map((item) => ({
        product_name: item.product_name ?? item.name ?? `Item ${String(item.catalog_item_id ?? '')}`,
        quantity: Number(item.quantity ?? 0),
        unit_price: Number(item.unit_price ?? 0),
      }))
    : [];

const mapOrder = (order: RawOrderRecord): MarketplaceOrder => ({
  id: String(order.id ?? ''),
  order_number: order.order_number ?? `PO-${String(order.id ?? '')}`,
  status: order.status ?? 'SUBMITTED',
  total: Number(order.total ?? 0),
  supplier_name: supplierLabel(order.supplier_profile_id),
  supplier_profile_id: order.supplier_profile_id ?? undefined,
  payment_status: order.payment_status,
  financed: order.financed,
  expected_delivery: order.expected_delivery,
  subtotal: order.subtotal,
  tax: order.tax,
  shipping_cost: order.shipping_cost,
  loan_id: order.loan_id,
  created_at: order.created_at ?? new Date().toISOString(),
  items: mapOrderItems(order.items),
});

const mapTracking = (orderId: string, response: RawTrackingResponse): MarketplaceTracking => ({
  order_id: orderId,
  status: response.status ?? 'UNKNOWN',
  events: Array.isArray(response.tracking_events)
    ? response.tracking_events.map((event) => ({
        timestamp: event.timestamp ?? new Date().toISOString(),
        status: event.status ?? 'Updated',
        location: event.location ?? response.logistics_provider ?? 'Unknown location',
        description: event.provider
          ? `${event.provider}${event.eta ? ` · ETA ${event.eta}` : ''}`
          : event.eta
            ? `ETA ${event.eta}`
            : '',
        provider: event.provider,
        eta: event.eta,
        delivered: event.delivered,
      }))
    : [],
});

export const searchCatalog = (params: MarketplaceSearchRequest = {}) =>
  request<{ items?: RawCatalogItem[]; total?: number }>({ url: `${BASE}/search`, method: 'GET', params }).then((response) => ({
    items: Array.isArray(response.items) ? response.items.map(mapCatalogItem) : [],
    total: Number(response.total ?? 0),
  }));

export const getRecommendations = () =>
  request<RawRecommendation[]>({ url: `${BASE}/recommendations`, method: 'GET' }).then((response) =>
    Array.isArray(response) ? response.map(mapRecommendation) : [],
  );

export const createRfq = (data: CreateRfqRequest) =>
  request<RawRfqResponse>({ url: `${BASE}/rfq`, method: 'POST', data });

export const getRfq = (rfqId: string) =>
  request<RawRfq>({ url: `${BASE}/rfq/${rfqId}`, method: 'GET' }).then(mapRfq);

export const createOrder = (data: CreateMarketplaceOrderRequest) =>
  request<CreateMarketplaceOrderResponse>({ url: `${BASE}/orders`, method: 'POST', data });

export const listOrders = () =>
  request<RawListOrdersResponse>({ url: `${BASE}/orders`, method: 'GET' }).then((response) => ({
    orders: Array.isArray(response.orders) ? response.orders.map(mapOrder) : [],
    total: Number(response.total ?? 0),
  }));

export const getOrder = (orderId: string) =>
  request<RawOrderRecord>({ url: `${BASE}/orders/${orderId}`, method: 'GET' }).then(mapOrder);

export const trackOrder = (orderId: string) =>
  request<RawTrackingResponse>({ url: `${BASE}/orders/${orderId}/track`, method: 'GET' }).then((response) => mapTracking(orderId, response));

export const getSupplierDashboard = (supplierId: number | string) =>
  request<Record<string, unknown>>({ url: `${BASE}/suppliers/dashboard`, method: 'GET', params: { supplier_id: supplierId } });

export const getSupplierCatalog = (supplierId: number | string) =>
  request<Record<string, unknown>>({ url: `${BASE}/suppliers/${supplierId}/catalog`, method: 'GET' });

export const onboardSupplier = (data: SupplierOnboardRequest) =>
  request<SupplierOnboardResponse>({ url: `${BASE}/suppliers/onboard`, method: 'POST', data });
