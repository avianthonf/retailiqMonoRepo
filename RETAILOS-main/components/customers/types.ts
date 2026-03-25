export type CustomerSegment = "Champion" | "Loyal" | "At Risk" | "Lost" | "New";

export interface RFMScore {
  recency: number;    // 1–5 (5 = recent)
  frequency: number;  // 1–5 (5 = frequent)
  monetary: number;   // 1–5 (5 = high value)
}

export interface CustomerNote {
  id: string;
  date: string;
  text: string;
  type: "note" | "message" | "tag";
}

export interface CustomerOrder {
  id: string;
  date: string;
  items: number;
  total: number;
  status: "completed" | "processing" | "refunded";
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalSpent: number;
  orderCount: number;
  avgOrderValue: number;
  lastSeen: string;       // ISO date
  firstPurchase: string;  // ISO date
  segment: CustomerSegment;
  rfm: RFMScore;
  tags: string[];
  notes: CustomerNote[];
  orders: CustomerOrder[];
}

export interface SegmentInfo {
  name: CustomerSegment;
  count: number;
  color: string;
  icon: string;
  description: string;
}
