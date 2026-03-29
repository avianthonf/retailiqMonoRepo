import { useState, type ChangeEvent } from 'react';
import { PageFrame } from '@/components/layout/PageFrame';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { normalizeApiError } from '@/utils/errors';
import type { CreateMarketplaceOrderResponse } from '@/types/api';
import {
  useMarketplaceOrderQuery,
  useMarketplaceSearchQuery,
  useMarketplaceRecommendationsQuery,
  useMarketplaceOrdersQuery,
  useCreateRfqMutation,
  useCreateMarketplaceOrderMutation,
  useMarketplaceTrackingQuery,
} from '@/hooks/marketplace';
import type { MarketplaceCatalogItem, MarketplaceOrder, MarketplaceRecommendation } from '@/types/models';

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'rfq'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [rfqForm, setRfqForm] = useState({ product_name: '', quantity: '', specifications: '' });
  const [orderLookupId, setOrderLookupId] = useState('');
  const [orderForm, setOrderForm] = useState({
    supplier_id: '',
    catalog_item_id: '',
    quantity: '1',
    payment_terms: 'prepaid',
    finance_requested: false,
  });
  const [orderCreationResult, setOrderCreationResult] = useState<{ order_number: string; status: string; total: number } | null>(null);

  const searchParams = { query: searchQuery || undefined, category: category || undefined };
  const catalogQuery = useMarketplaceSearchQuery(searchParams);
  const recsQuery = useMarketplaceRecommendationsQuery();
  const ordersQuery = useMarketplaceOrdersQuery();
  const orderDetailQuery = useMarketplaceOrderQuery(orderLookupId);
  const trackingQuery = useMarketplaceTrackingQuery(orderLookupId);
  const createRfq = useCreateRfqMutation();
  const createOrderMutation = useCreateMarketplaceOrderMutation();

  const catalogItems = catalogQuery.data?.items ?? (Array.isArray(catalogQuery.data) ? catalogQuery.data : []) as MarketplaceCatalogItem[];
  const recommendations = (Array.isArray(recsQuery.data) ? recsQuery.data : []) as MarketplaceRecommendation[];
  const orders = ordersQuery.data?.orders ?? (Array.isArray(ordersQuery.data) ? ordersQuery.data : []) as MarketplaceOrder[];

  const handleCreateRfq = () => {
    if (!rfqForm.product_name || !rfqForm.quantity) return;
    createRfq.mutate({
      items: [{
        product_name: rfqForm.product_name,
        quantity: Number(rfqForm.quantity),
        specifications: rfqForm.specifications || undefined,
      }],
    }, {
      onSuccess: () => setRfqForm({ product_name: '', quantity: '', specifications: '' }),
    });
  };

  const handleCreateOrder = () => {
    if (!orderForm.supplier_id || !orderForm.catalog_item_id || !orderForm.quantity) return;

    createOrderMutation.mutate({
      items: [{
        catalog_item_id: orderForm.catalog_item_id,
        quantity: Number(orderForm.quantity),
      }],
      shipping_address: undefined,
      supplier_id: Number(orderForm.supplier_id),
      payment_terms: orderForm.payment_terms,
      finance_requested: orderForm.finance_requested,
    }, {
      onSuccess: (response: CreateMarketplaceOrderResponse) => {
        setOrderCreationResult({
          order_number: response.order_number,
          status: response.status,
          total: response.total,
        });
        setOrderForm({
          supplier_id: '',
          catalog_item_id: '',
          quantity: '1',
          payment_terms: 'prepaid',
          finance_requested: false,
        });
      },
    });
  };

  return (
    <PageFrame title="Marketplace" subtitle="Browse suppliers, place orders, and manage procurement.">
      <div className="button-row" style={{ marginBottom: '1.5rem' }}>
        <Button variant={activeTab === 'catalog' ? 'primary' : 'ghost'} onClick={() => setActiveTab('catalog')}>Catalog</Button>
        <Button variant={activeTab === 'orders' ? 'primary' : 'ghost'} onClick={() => setActiveTab('orders')}>Orders</Button>
        <Button variant={activeTab === 'rfq' ? 'primary' : 'ghost'} onClick={() => setActiveTab('rfq')}>Request for Quote</Button>
      </div>

      {activeTab === 'catalog' && (
        <div>
          {/* Search bar */}
          <div className="button-row" style={{ marginBottom: '1rem', gap: '0.5rem' }}>
            <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ maxWidth: 300 }} />
            <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ maxWidth: 200 }} />
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card className="mb-6">
              <CardHeader><CardTitle>Recommended for You</CardTitle></CardHeader>
              <CardContent>
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                  {recommendations.slice(0, 6).map((item) => (
                    <div key={item.id} style={{ minWidth: 180, padding: '0.75rem', background: '#f9fafb', borderRadius: '0.375rem' }}>
                      <strong>{item.product_name}</strong>
                      <div className="muted" style={{ fontSize: '0.85rem' }}>{item.category}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Badge variant="info">Qty {item.suggested_qty}</Badge>
                        <Badge variant={item.urgency === 'high' ? 'danger' : item.urgency === 'medium' ? 'warning' : 'secondary'}>{item.urgency}</Badge>
                      </div>
                      <div className="muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Supplier: {item.suggested_supplier_id ?? 'Any'}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Catalog results */}
          {catalogQuery.isLoading ? <SkeletonLoader variant="rect" height={300} /> : catalogQuery.isError ? (
            <ErrorState error={normalizeApiError(catalogQuery.error)} onRetry={() => void catalogQuery.refetch()} />
          ) : catalogItems.length === 0 ? (
            <EmptyState title="No products found" body="Try adjusting your search or browse by category." />
          ) : (
            <DataTable<MarketplaceCatalogItem>
              columns={[
                { key: 'name', header: 'Product', render: (row: MarketplaceCatalogItem) => row.name },
                { key: 'category', header: 'Category', render: (row: MarketplaceCatalogItem) => row.category },
                { key: 'moq', header: 'MOQ', render: (row: MarketplaceCatalogItem) => row.moq ?? '—' },
                { key: 'supplier', header: 'Supplier', render: (row: MarketplaceCatalogItem) => row.supplier_name },
                { key: 'price', header: 'Price', render: (row: MarketplaceCatalogItem) => `₹${row.price}` },
                { key: 'rating', header: 'Rating', render: (row: MarketplaceCatalogItem) => <Badge variant="info">{row.rating.toFixed(1)}★</Badge> },
              ]}
              data={catalogItems}
            />
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <Card className="mb-6">
            <CardHeader><CardTitle>Create Purchase Order</CardTitle></CardHeader>
            <CardContent>
              <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <Input placeholder="Supplier ID" value={orderForm.supplier_id} onChange={(e: ChangeEvent<HTMLInputElement>) => setOrderForm({ ...orderForm, supplier_id: e.target.value })} />
                <Input placeholder="Catalog Item ID" value={orderForm.catalog_item_id} onChange={(e: ChangeEvent<HTMLInputElement>) => setOrderForm({ ...orderForm, catalog_item_id: e.target.value })} />
                <Input type="number" placeholder="Quantity" value={orderForm.quantity} onChange={(e: ChangeEvent<HTMLInputElement>) => setOrderForm({ ...orderForm, quantity: e.target.value })} />
                <Input placeholder="Payment terms" value={orderForm.payment_terms} onChange={(e: ChangeEvent<HTMLInputElement>) => setOrderForm({ ...orderForm, payment_terms: e.target.value })} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <input
                  type="checkbox"
                  checked={orderForm.finance_requested}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setOrderForm({ ...orderForm, finance_requested: event.target.checked })}
                />
                Request RetailIQ financing
              </label>
              <div className="button-row" style={{ marginTop: '1rem' }}>
                <Button onClick={handleCreateOrder} disabled={createOrderMutation.isPending || !orderForm.supplier_id || !orderForm.catalog_item_id}>
                  {createOrderMutation.isPending ? 'Submitting...' : 'Create order'}
                </Button>
              </div>
              {orderCreationResult && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#ecfeff', borderRadius: '0.5rem' }}>
                  <strong>Order created:</strong> {orderCreationResult.order_number} · {orderCreationResult.status} · ₹{orderCreationResult.total.toLocaleString()}
                </div>
              )}
              {createOrderMutation.isError && <p className="text-danger" style={{ marginTop: '0.5rem' }}>{normalizeApiError(createOrderMutation.error).message}</p>}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader><CardTitle>Lookup Order</CardTitle></CardHeader>
            <CardContent>
              <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr auto' }}>
                <Input placeholder="Enter order ID" value={orderLookupId} onChange={(e: ChangeEvent<HTMLInputElement>) => setOrderLookupId(e.target.value)} />
                <Button onClick={() => setOrderLookupId(orderLookupId.trim())} disabled={!orderLookupId.trim()}>Load order</Button>
              </div>

              {orderLookupId && orderDetailQuery.isLoading ? <SkeletonLoader variant="rect" height={120} /> : null}

              {orderDetailQuery.isError ? (
                <div style={{ marginTop: '1rem' }}>
                  <ErrorState error={normalizeApiError(orderDetailQuery.error)} onRetry={() => void orderDetailQuery.refetch()} />
                </div>
              ) : orderDetailQuery.data ? (
                <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                    <div><div className="muted">Order #</div><strong>{orderDetailQuery.data.order_number}</strong></div>
                    <div><div className="muted">Status</div><Badge variant={orderDetailQuery.data.status === 'DELIVERED' ? 'success' : orderDetailQuery.data.status === 'CANCELLED' ? 'danger' : 'info'}>{orderDetailQuery.data.status}</Badge></div>
                    <div><div className="muted">Total</div><strong>₹{orderDetailQuery.data.total.toLocaleString()}</strong></div>
                    <div><div className="muted">Payment</div><strong>{orderDetailQuery.data.payment_status ?? 'PENDING'}</strong></div>
                  </div>

                  {orderDetailQuery.data.items.length > 0 && (
                    <div>
                      <div className="muted" style={{ marginBottom: '0.5rem' }}>Items</div>
                      <DataTable<{ product_name: string; quantity: number; unit_price: number }>
                        columns={[
                          { key: 'product_name', header: 'Product', render: (row) => row.product_name },
                          { key: 'quantity', header: 'Qty', render: (row) => row.quantity },
                          { key: 'unit_price', header: 'Unit price', render: (row) => `₹${row.unit_price}` },
                        ]}
                        data={orderDetailQuery.data.items}
                      />
                    </div>
                  )}

                  <div>
                    <div className="muted" style={{ marginBottom: '0.5rem' }}>Tracking</div>
                    {trackingQuery.isLoading ? <SkeletonLoader variant="rect" height={90} /> : null}
                    {trackingQuery.data?.events.length ? (
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {trackingQuery.data.events.map((event) => (
                          <div key={`${event.timestamp}-${event.status}`} style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.375rem' }}>
                            <strong>{event.status}</strong>
                            <div className="muted" style={{ fontSize: '0.85rem' }}>{event.location}</div>
                            <div className="muted" style={{ fontSize: '0.8rem' }}>{new Date(event.timestamp).toLocaleString()}</div>
                            {event.description && <div style={{ marginTop: '0.25rem' }}>{event.description}</div>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="muted">No tracking events available for this order.</p>
                    )}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {ordersQuery.isLoading ? <SkeletonLoader variant="rect" height={300} /> : ordersQuery.isError ? (
            <ErrorState error={normalizeApiError(ordersQuery.error)} onRetry={() => void ordersQuery.refetch()} />
          ) : orders.length === 0 ? (
            <EmptyState title="No orders" body="Your marketplace orders will appear here." />
          ) : (
            <DataTable<MarketplaceOrder>
              columns={[
                { key: 'order', header: 'Order #', render: (row: MarketplaceOrder) => row.order_number },
                { key: 'supplier', header: 'Supplier', render: (row: MarketplaceOrder) => row.supplier_name ?? `Supplier #${row.supplier_profile_id ?? '—'}` },
                { key: 'total', header: 'Total', render: (row: MarketplaceOrder) => `₹${row.total.toLocaleString()}` },
                { key: 'status', header: 'Status', render: (row: MarketplaceOrder) => {
                  const v = row.status === 'DELIVERED' ? 'success' : row.status === 'SUBMITTED' ? 'warning' : row.status === 'CANCELLED' ? 'danger' : 'info';
                  return <Badge variant={v}>{row.status}</Badge>;
                }},
                { key: 'payment_status', header: 'Payment', render: (row: MarketplaceOrder) => row.payment_status ?? 'PENDING' },
                { key: 'financed', header: 'Financed', render: (row: MarketplaceOrder) => <Badge variant={row.financed ? 'success' : 'secondary'}>{row.financed ? 'Yes' : 'No'}</Badge> },
                { key: 'date', header: 'Date', render: (row: MarketplaceOrder) => new Date(row.created_at).toLocaleDateString() },
              ]}
              data={orders}
            />
          )}
        </div>
      )}

      {activeTab === 'rfq' && (
        <Card>
          <CardHeader><CardTitle>Create Request for Quote</CardTitle></CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <Input placeholder="Product Name *" value={rfqForm.product_name} onChange={(e: ChangeEvent<HTMLInputElement>) => setRfqForm({ ...rfqForm, product_name: e.target.value })} />
              <Input type="number" placeholder="Quantity *" value={rfqForm.quantity} onChange={(e: ChangeEvent<HTMLInputElement>) => setRfqForm({ ...rfqForm, quantity: e.target.value })} />
              <Input placeholder="Specifications (optional)" value={rfqForm.specifications} onChange={(e: ChangeEvent<HTMLInputElement>) => setRfqForm({ ...rfqForm, specifications: e.target.value })} />
            </div>
            <div className="button-row" style={{ marginTop: '1rem' }}>
              <Button onClick={handleCreateRfq} disabled={createRfq.isPending}>
                {createRfq.isPending ? 'Submitting...' : 'Submit RFQ'}
              </Button>
            </div>
            {createRfq.isError && <p className="text-danger" style={{ marginTop: '0.5rem' }}>{normalizeApiError(createRfq.error).message}</p>}
            {createRfq.isSuccess && <p style={{ marginTop: '0.5rem', color: '#16a34a' }}>RFQ submitted successfully!</p>}
          </CardContent>
        </Card>
      )}
    </PageFrame>
  );
}
