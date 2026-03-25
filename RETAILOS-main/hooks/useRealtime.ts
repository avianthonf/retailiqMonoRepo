"use client";

import { useEffect } from 'react';
import { queryClient } from '@/lib/queryStore';
import toast from 'react-hot-toast';

export function useRealtime() {
  useEffect(() => {
    // Determine if we are in a browser environment
    if (typeof window === 'undefined') return;

    console.log('[RetailOS Realtime] Connected to simulation channel');

    // Polling simulation: Randomly dispatch events every 15 to 45 seconds
    const interval = setInterval(() => {
      const eventType = Math.random();

      if (eventType > 0.6) {
        // High frequency: New Order
        const amount = (Math.random() * 200 + 15).toFixed(2);
        toast.success(`New Order: $${amount} received!`, {
          icon: '📦',
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
            padding: '16px',
          },
        });
        
        // Invalidate the dashboard query to fetch the new order count and revenue
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        
      } else if (eventType > 0.3) {
        // Medium frequency: Stock Alert
        toast('Stock Alert: Item running low', {
          icon: '⚠️',
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
          },
        });
        
        queryClient.setQueryData(['unread-stock-alerts'], true);
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      } else {
        // Low frequency: AI Insight
        toast('New AI Insight generated', {
          icon: '✨',
          style: {
            borderRadius: '16px',
            background: '#2e1065',
            color: '#fff',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
          },
        });
        
        queryClient.setQueryData(['unread-ai-insights'], true);
        queryClient.invalidateQueries({ queryKey: ['insights'] });
      }
    }, Math.floor(Math.random() * 30000) + 15000); // 15-45 seconds

    return () => {
      clearInterval(interval);
      console.log('[RetailOS Realtime] Disconnected');
    };
  }, []);
}
