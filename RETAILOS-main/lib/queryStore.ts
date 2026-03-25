"use client";

import { useState, useEffect } from 'react';

type Listener = (val: any) => void;
const cache: Record<string, any> = {};
const listeners: Record<string, Set<Listener>> = {};
const queryFns: Record<string, () => Promise<any>> = {};

export function setQueryData(keyArr: string[], data: any) {
  const key = keyArr.join('-');
  cache[key] = data;
  if (listeners[key]) {
    listeners[key].forEach(l => l(data));
  }
}

export function getQueryData(keyArr: string[]) {
  return cache[keyArr.join('-')];
}

export async function invalidateQueries({ queryKey }: { queryKey: string[] }) {
  const key = queryKey.join('-');
  if (queryFns[key]) {
    const data = await queryFns[key]();
    setQueryData(queryKey, data);
  }
}

export const queryClient = {
  setQueryData,
  getQueryData,
  invalidateQueries,
};

export function useQuery<T>({ queryKey, queryFn, refetchInterval }: { queryKey: string[], queryFn?: () => Promise<T>, refetchInterval?: number }) {
  const keyStr = queryKey.join('-');
  const [data, setData] = useState<T | undefined>(cache[keyStr]);
  const [isLoading, setIsLoading] = useState(!cache[keyStr] && !!queryFn);
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    if (queryFn) {
      queryFns[keyStr] = queryFn;
    }

    if (!listeners[keyStr]) listeners[keyStr] = new Set();
    const l = (d: any) => {
      setData(d);
      setIsLoading(false);
      setIsRefetching(false);
    };
    listeners[keyStr].add(l);

    const fetchIt = async (silently = false) => {
      if (!queryFn) return;
      if (!silently) setIsLoading(true);
      else setIsRefetching(true);
      try {
        const res = await queryFn();
        setQueryData(queryKey, res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsRefetching(false);
      }
    };

    if (!cache[keyStr] && queryFn) {
      fetchIt();
    }

    let interval: any;
    if (refetchInterval && queryFn) {
      interval = setInterval(() => fetchIt(true), refetchInterval);
    }

    return () => {
      listeners[keyStr].delete(l);
      if (interval) clearInterval(interval);
    };
  }, [keyStr]);

  return { data, isLoading, isRefetching };
}
