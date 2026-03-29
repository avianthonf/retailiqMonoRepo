import { describe, expect, it, vi, beforeEach } from 'vitest';
import { marketIntelligenceApi } from '@/api/marketIntelligence';

const mocks = vi.hoisted(() => ({
  request: vi.fn(),
}));

vi.mock('@/api/client', () => ({
  request: mocks.request,
}));

describe('marketIntelligenceApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends backend-supported signal filters and maps the response', async () => {
    mocks.request.mockResolvedValue([
      {
        id: 10,
        signal_type: 'PRICE',
        category_id: 7,
        region_code: 'KA',
        value: 115,
        confidence: 0.8,
        timestamp: '2026-03-29T10:00:00Z',
      },
    ]);

    const response = await marketIntelligenceApi.getPriceSignals({ category_id: '7', signal_type: 'PRICE' });

    expect(mocks.request).toHaveBeenCalledWith(expect.objectContaining({
      url: '/api/v1/market/signals',
      method: 'GET',
      params: expect.objectContaining({ category_id: '7', signal_type: 'PRICE' }),
    }));
    expect(response.signals[0]).toEqual(expect.objectContaining({
      id: '10',
      category_id: '7',
      region: 'KA',
      trend: 'UP',
    }));
  });

  it('computes indices with the real backend payload shape', async () => {
    mocks.request.mockResolvedValue({
      category_id: 9,
      new_index: 110,
    });

    const response = await marketIntelligenceApi.computePriceIndex({ category_id: '9', product_ids: [] });

    expect(mocks.request).toHaveBeenCalledWith(expect.objectContaining({
      url: '/api/v1/market/indices/compute',
      method: 'POST',
      data: { category_id: '9' },
    }));
    expect(response).toEqual(expect.objectContaining({
      category_id: '9',
      category: '9',
      index_value: 110,
    }));
  });
});
