import { describe, expect, it } from 'vitest';
import { getConfiguredApiBaseUrl, resolveApiUrl } from '@/api/client';

type TestEnv = {
  VITE_API_BASE_URL?: string;
};

describe('api client url helpers', () => {
  it('uses the configured backend base url when present', () => {
    expect(getConfiguredApiBaseUrl({ VITE_API_BASE_URL: 'https://api.example.com/' } as TestEnv)).toBe('https://api.example.com');
  });

  it('falls back to relative api calls when no backend base url is configured', () => {
    expect(getConfiguredApiBaseUrl({} as TestEnv)).toBe('');
    expect(resolveApiUrl('/api/v1/test', '')).toBeTypeOf('string');
  });

  it('resolves relative paths against the configured backend base url', () => {
    expect(resolveApiUrl('/api/v1/test', 'https://api.example.com')).toBe('https://api.example.com/api/v1/test');
  });
});
