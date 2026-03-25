"use client";

import { useRealtime } from "@/hooks/useRealtime";

export default function RealtimeProvider() {
  useRealtime();
  return null;
}
