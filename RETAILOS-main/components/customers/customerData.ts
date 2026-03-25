import { Customer, CustomerSegment } from "./types";

function genId() { return Math.random().toString(36).slice(2, 9); }
function orderId() { return "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase(); }

// ── Segment assignment based on RFM ──────────────────────────────────────────
export function deriveSegment(recency: number, frequency: number, monetary: number): CustomerSegment {
  const total = recency + frequency + monetary;
  if (total >= 13) return "Champion";
  if (total >= 10) return "Loyal";
  if (recency <= 2 && total >= 7) return "At Risk";
  if (recency <= 1) return "Lost";
  return "New";
}

export const SEGMENT_COLORS: Record<CustomerSegment, string> = {
  Champion: "#10b981",
  Loyal:    "#6366f1",
  "At Risk": "#f59e0b",
  Lost:     "#ef4444",
  New:      "#8b5cf6",
};

export const SEGMENT_INFO = [
  { name: "Champion" as CustomerSegment, color: "#10b981", icon: "🏆", description: "High value, frequent, recent buyers" },
  { name: "Loyal"    as CustomerSegment, color: "#6366f1", icon: "💎", description: "Regular, consistent buyers" },
  { name: "At Risk"  as CustomerSegment, color: "#f59e0b", icon: "⚠️", description: "Were active but no recent activity" },
  { name: "Lost"     as CustomerSegment, color: "#ef4444", icon: "❌", description: "No activity for extended period" },
  { name: "New"      as CustomerSegment, color: "#8b5cf6", icon: "🌟", description: "Recently acquired with few purchases" },
];

// ── Avatar color from name hash ──────────────────────────────────────────────
const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#a78bfa", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#14b8a6", "#f97316", "#3b82f6",
];
export function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

// ── Mock customers ───────────────────────────────────────────────────────────
const RAW: Omit<Customer, "segment" | "avgOrderValue">[] = [
  {
    id: "cust-001", firstName: "Sarah", lastName: "Chen", email: "sarah.chen@email.com", phone: "+1 415-555-0101",
    totalSpent: 12840, orderCount: 28, lastSeen: "2026-03-16", firstPurchase: "2024-06-12",
    rfm: { recency: 5, frequency: 5, monetary: 5 }, tags: ["VIP", "Early Adopter"],
    notes: [
      { id: genId(), date: "2026-03-15", text: "Loved the new headphones collection, requested early access to next drop", type: "note" },
      { id: genId(), date: "2026-02-20", text: "Sent thank you for reaching $10k lifetime spend", type: "message" },
    ],
    orders: [
      { id: orderId(), date: "2026-03-14", items: 3, total: 489.97, status: "completed" },
      { id: orderId(), date: "2026-02-28", items: 1, total: 129.99, status: "completed" },
      { id: orderId(), date: "2026-02-10", items: 2, total: 274.50, status: "completed" },
      { id: orderId(), date: "2026-01-18", items: 4, total: 612.00, status: "completed" },
      { id: orderId(), date: "2025-12-22", items: 5, total: 890.00, status: "completed" },
    ],
  },
  {
    id: "cust-002", firstName: "Marcus", lastName: "Williams", email: "marcus.w@email.com", phone: "+1 212-555-0202",
    totalSpent: 8420, orderCount: 19, lastSeen: "2026-03-12", firstPurchase: "2024-09-05",
    rfm: { recency: 5, frequency: 4, monetary: 4 }, tags: ["Wholesale"],
    notes: [
      { id: genId(), date: "2026-03-10", text: "Interested in bulk pricing for office supplies", type: "note" },
    ],
    orders: [
      { id: orderId(), date: "2026-03-10", items: 6, total: 1240.00, status: "completed" },
      { id: orderId(), date: "2026-02-15", items: 2, total: 348.00, status: "completed" },
      { id: orderId(), date: "2026-01-22", items: 3, total: 520.00, status: "completed" },
      { id: orderId(), date: "2025-12-18", items: 1, total: 89.99, status: "refunded" },
    ],
  },
  {
    id: "cust-003", firstName: "Emily", lastName: "Rodriguez", email: "emily.r@email.com", phone: "+1 305-555-0303",
    totalSpent: 6250, orderCount: 15, lastSeen: "2026-03-08", firstPurchase: "2025-01-15",
    rfm: { recency: 4, frequency: 4, monetary: 3 }, tags: ["Newsletter"],
    notes: [],
    orders: [
      { id: orderId(), date: "2026-03-05", items: 2, total: 189.98, status: "completed" },
      { id: orderId(), date: "2026-02-08", items: 1, total: 74.99, status: "completed" },
      { id: orderId(), date: "2026-01-12", items: 3, total: 340.00, status: "completed" },
    ],
  },
  {
    id: "cust-004", firstName: "James", lastName: "O'Brien", email: "james.ob@email.com", phone: "+1 617-555-0404",
    totalSpent: 4180, orderCount: 12, lastSeen: "2026-02-20", firstPurchase: "2025-03-22",
    rfm: { recency: 3, frequency: 3, monetary: 3 }, tags: [],
    notes: [
      { id: genId(), date: "2026-02-18", text: "Asked about return policy for electronics", type: "note" },
    ],
    orders: [
      { id: orderId(), date: "2026-02-18", items: 1, total: 299.99, status: "completed" },
      { id: orderId(), date: "2026-01-05", items: 2, total: 158.00, status: "completed" },
    ],
  },
  {
    id: "cust-005", firstName: "Aisha", lastName: "Patel", email: "aisha.p@email.com", phone: "+1 408-555-0505",
    totalSpent: 9640, orderCount: 22, lastSeen: "2026-03-15", firstPurchase: "2024-08-10",
    rfm: { recency: 5, frequency: 5, monetary: 4 }, tags: ["VIP", "Referral Program"],
    notes: [
      { id: genId(), date: "2026-03-14", text: "Referred 3 new customers this month!", type: "note" },
      { id: genId(), date: "2026-03-01", text: "Sent exclusive 15% discount code", type: "message" },
    ],
    orders: [
      { id: orderId(), date: "2026-03-13", items: 2, total: 384.00, status: "completed" },
      { id: orderId(), date: "2026-02-25", items: 4, total: 620.00, status: "completed" },
      { id: orderId(), date: "2026-02-02", items: 1, total: 149.99, status: "completed" },
      { id: orderId(), date: "2026-01-10", items: 3, total: 445.00, status: "completed" },
    ],
  },
  {
    id: "cust-006", firstName: "David", lastName: "Kim", email: "david.kim@email.com", phone: "+1 310-555-0606",
    totalSpent: 2180, orderCount: 6, lastSeen: "2025-12-15", firstPurchase: "2025-06-20",
    rfm: { recency: 1, frequency: 2, monetary: 2 }, tags: ["Inactive"],
    notes: [
      { id: genId(), date: "2026-01-05", text: "Sent win-back campaign email", type: "message" },
    ],
    orders: [
      { id: orderId(), date: "2025-12-10", items: 1, total: 89.99, status: "completed" },
      { id: orderId(), date: "2025-11-02", items: 2, total: 240.00, status: "completed" },
    ],
  },
  {
    id: "cust-007", firstName: "Lisa", lastName: "Thompson", email: "lisa.t@email.com", phone: "+1 773-555-0707",
    totalSpent: 3420, orderCount: 9, lastSeen: "2026-01-10", firstPurchase: "2025-04-18",
    rfm: { recency: 2, frequency: 3, monetary: 2 }, tags: [],
    notes: [],
    orders: [
      { id: orderId(), date: "2026-01-08", items: 2, total: 220.00, status: "completed" },
      { id: orderId(), date: "2025-12-20", items: 3, total: 380.00, status: "completed" },
      { id: orderId(), date: "2025-11-15", items: 1, total: 119.99, status: "completed" },
    ],
  },
  {
    id: "cust-008", firstName: "Robert", lastName: "Garcia", email: "robert.g@email.com", phone: "+1 713-555-0808",
    totalSpent: 1250, orderCount: 3, lastSeen: "2025-10-22", firstPurchase: "2025-08-14",
    rfm: { recency: 1, frequency: 1, monetary: 1 }, tags: ["Churned"],
    notes: [
      { id: genId(), date: "2025-11-15", text: "Did not respond to win-back offers", type: "note" },
    ],
    orders: [
      { id: orderId(), date: "2025-10-20", items: 1, total: 450.00, status: "completed" },
      { id: orderId(), date: "2025-09-05", items: 2, total: 280.00, status: "refunded" },
    ],
  },
  {
    id: "cust-009", firstName: "Nina", lastName: "Johansson", email: "nina.j@email.com", phone: "+1 206-555-0909",
    totalSpent: 5890, orderCount: 14, lastSeen: "2026-03-16", firstPurchase: "2025-02-10",
    rfm: { recency: 5, frequency: 4, monetary: 3 }, tags: ["Newsletter", "Early Adopter"],
    notes: [
      { id: genId(), date: "2026-03-15", text: "Excellent feedback on kitchen product line", type: "note" },
    ],
    orders: [
      { id: orderId(), date: "2026-03-14", items: 2, total: 178.00, status: "completed" },
      { id: orderId(), date: "2026-02-20", items: 1, total: 64.99, status: "completed" },
      { id: orderId(), date: "2026-01-28", items: 3, total: 420.00, status: "completed" },
    ],
  },
  {
    id: "cust-010", firstName: "Alex", lastName: "Nguyen", email: "alex.n@email.com", phone: "+1 512-555-1010",
    totalSpent: 780, orderCount: 2, lastSeen: "2026-03-10", firstPurchase: "2026-02-28",
    rfm: { recency: 4, frequency: 1, monetary: 1 }, tags: ["New Customer"],
    notes: [],
    orders: [
      { id: orderId(), date: "2026-03-08", items: 1, total: 480.00, status: "processing" },
      { id: orderId(), date: "2026-02-28", items: 1, total: 300.00, status: "completed" },
    ],
  },
  {
    id: "cust-011", firstName: "Olivia", lastName: "Martinez", email: "olivia.m@email.com", phone: "+1 602-555-1111",
    totalSpent: 7200, orderCount: 17, lastSeen: "2026-02-28", firstPurchase: "2024-11-02",
    rfm: { recency: 3, frequency: 4, monetary: 4 }, tags: ["VIP"],
    notes: [
      { id: genId(), date: "2026-02-25", text: "Requested gift wrapping for future orders", type: "note" },
    ],
    orders: [
      { id: orderId(), date: "2026-02-25", items: 3, total: 540.00, status: "completed" },
      { id: orderId(), date: "2026-01-18", items: 1, total: 199.99, status: "completed" },
    ],
  },
  {
    id: "cust-012", firstName: "Tyler", lastName: "Brooks", email: "tyler.b@email.com", phone: "+1 303-555-1212",
    totalSpent: 920, orderCount: 3, lastSeen: "2026-03-14", firstPurchase: "2026-01-20",
    rfm: { recency: 5, frequency: 1, monetary: 1 }, tags: [],
    notes: [],
    orders: [
      { id: orderId(), date: "2026-03-12", items: 1, total: 350.00, status: "completed" },
      { id: orderId(), date: "2026-02-10", items: 2, total: 420.00, status: "completed" },
      { id: orderId(), date: "2026-01-20", items: 1, total: 150.00, status: "completed" },
    ],
  },
];

export const MOCK_CUSTOMERS: Customer[] = RAW.map((c) => ({
  ...c,
  segment: deriveSegment(c.rfm.recency, c.rfm.frequency, c.rfm.monetary),
  avgOrderValue: Number((c.totalSpent / c.orderCount).toFixed(2)),
}));

export function getCustomerById(id: string): Customer | undefined {
  return MOCK_CUSTOMERS.find((c) => c.id === id);
}
