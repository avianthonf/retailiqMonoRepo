import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';

export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: (period = '30d') => [...analyticsKeys.all, 'dashboard', period] as const,
  revenue: (period = '30d') => [...analyticsKeys.all, 'revenue', period] as const,
  profit: (period = '30d') => [...analyticsKeys.all, 'profit', period] as const,
  topProducts: () => [...analyticsKeys.all, 'top-products'] as const,
  categoryBreakdown: () => [...analyticsKeys.all, 'category-breakdown'] as const,
  paymentModes: () => [...analyticsKeys.all, 'payment-modes'] as const,
  contribution: () => [...analyticsKeys.all, 'contribution'] as const,
  customerSummary: () => [...analyticsKeys.all, 'customer-summary'] as const,
  diagnostics: () => [...analyticsKeys.all, 'diagnostics'] as const,
};

export const useAnalyticsDashboard = (period = '30d') =>
  useQuery({
    queryKey: analyticsKeys.dashboard(period),
    queryFn: () => analyticsApi.getAnalyticsDashboard(period),
    staleTime: 30_000,
  });

export const useRevenue = (period = '30d') =>
  useQuery({
    queryKey: analyticsKeys.revenue(period),
    queryFn: () => analyticsApi.getRevenue(period),
    staleTime: 30_000,
  });

export const useProfit = (period = '30d') =>
  useQuery({
    queryKey: analyticsKeys.profit(period),
    queryFn: () => analyticsApi.getProfit(period),
    staleTime: 30_000,
  });

export const useTopProducts = () =>
  useQuery({
    queryKey: analyticsKeys.topProducts(),
    queryFn: () => analyticsApi.getTopProducts(),
    staleTime: 30_000,
  });

export const useCategoryBreakdown = () =>
  useQuery({
    queryKey: analyticsKeys.categoryBreakdown(),
    queryFn: () => analyticsApi.getCategoryBreakdown(),
    staleTime: 30_000,
  });

export const usePaymentModes = () =>
  useQuery({
    queryKey: analyticsKeys.paymentModes(),
    queryFn: () => analyticsApi.getPaymentModes(),
    staleTime: 30_000,
  });

export const useContribution = () =>
  useQuery({
    queryKey: analyticsKeys.contribution(),
    queryFn: () => analyticsApi.getContribution(),
    staleTime: 30_000,
  });

export const useCustomerSummaryAnalytics = () =>
  useQuery({
    queryKey: analyticsKeys.customerSummary(),
    queryFn: () => analyticsApi.getCustomerSummaryAnalytics(),
    staleTime: 30_000,
  });

export const useAnalyticsDiagnostics = () =>
  useQuery({
    queryKey: analyticsKeys.diagnostics(),
    queryFn: () => analyticsApi.getAnalyticsDiagnostics(),
    staleTime: 30_000,
  });

export default useAnalyticsDashboard;
