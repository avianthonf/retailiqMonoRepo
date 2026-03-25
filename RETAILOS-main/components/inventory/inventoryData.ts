import { Product, StockStatus } from "./types";

function calcStatus(stock: number, reorderPoint: number): StockStatus {
  if (stock === 0 || stock < reorderPoint * 0.25) return "Critical";
  if (stock < reorderPoint) return "Low";
  if (stock > reorderPoint * 4) return "Overstocked";
  return "Good";
}

function calcMargin(price: number, cost: number) {
  return Math.round(((price - cost) / price) * 100);
}

const raw = [
  { id: "P001", name: "Wireless Noise-Cancelling Headphones", sku: "EL-WNC-001", category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80", stock: 3, reorderPoint: 20, price: 249.99, cost: 110.00, lastOrdered: "2024-02-10" },
  { id: "P002", name: "Mechanical Gaming Keyboard", sku: "EL-MKB-002", category: "Electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80", stock: 8, reorderPoint: 15, price: 129.99, cost: 55.00, lastOrdered: "2024-01-28" },
  { id: "P003", name: "4K UHD Webcam", sku: "EL-CAM-003", category: "Electronics", image: "https://images.unsplash.com/photo-1593640408182-31c228b09b1d?w=300&q=80", stock: 45, reorderPoint: 10, price: 89.99, cost: 35.00, lastOrdered: "2024-03-01" },
  { id: "P004", name: "Smart LED Desk Lamp", sku: "HM-LED-004", category: "Home", image: "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=300&q=80", stock: 0, reorderPoint: 12, price: 59.99, cost: 18.00, lastOrdered: "2024-01-15" },
  { id: "P005", name: "Ergonomic Office Chair", sku: "HM-CHR-005", category: "Home", image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=300&q=80", stock: 112, reorderPoint: 5, price: 399.99, cost: 180.00, lastOrdered: "2024-02-20" },
  { id: "P006", name: "Premium Running Shoes", sku: "AP-RUN-006", category: "Apparel", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80", stock: 6, reorderPoint: 25, price: 149.99, cost: 62.00, lastOrdered: "2024-02-05" },
  { id: "P007", name: "Slim Fit Merino Sweater", sku: "AP-SWT-007", category: "Apparel", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=80", stock: 34, reorderPoint: 20, price: 79.99, cost: 28.00, lastOrdered: "2024-03-05" },
  { id: "P008", name: "Insulated Water Bottle 32oz", sku: "HM-BTL-008", category: "Home", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=80", stock: 200, reorderPoint: 30, price: 34.99, cost: 8.00, lastOrdered: "2024-02-28" },
  { id: "P009", name: "Organic Cold Brew Coffee (6-pack)", sku: "GR-CBR-009", category: "Grocery", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&q=80", stock: 5, reorderPoint: 24, price: 28.99, cost: 12.00, lastOrdered: "2024-01-20" },
  { id: "P010", name: "Artisan Grain-Free Granola", sku: "GR-GNL-010", category: "Grocery", image: "https://images.unsplash.com/photo-1555708982-8645ec9ce3cc?w=300&q=80", stock: 18, reorderPoint: 30, price: 12.99, cost: 4.50, lastOrdered: "2024-03-02" },
  { id: "P011", name: "Portable SSD 1TB", sku: "EL-SSD-011", category: "Electronics", image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=300&q=80", stock: 22, reorderPoint: 10, price: 109.99, cost: 48.00, lastOrdered: "2024-02-15" },
  { id: "P012", name: "Bamboo Cutting Board Set", sku: "HM-CUT-012", category: "Home", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80", stock: 2, reorderPoint: 15, price: 39.99, cost: 11.00, lastOrdered: "2024-01-30" },
  { id: "P013", name: "Yoga Mat Premium", sku: "AP-YMT-013", category: "Apparel", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80", stock: 80, reorderPoint: 20, price: 69.99, cost: 22.00, lastOrdered: "2024-02-25" },
  { id: "P014", name: "Matcha Green Tea (50 sachets)", sku: "GR-TEA-014", category: "Grocery", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&q=80", stock: 11, reorderPoint: 40, price: 19.99, cost: 6.00, lastOrdered: "2024-03-08" },
  { id: "P015", name: "True Wireless Earbuds", sku: "EL-TWS-015", category: "Electronics", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&q=80", stock: 58, reorderPoint: 15, price: 79.99, cost: 24.00, lastOrdered: "2024-03-10" },
  { id: "P016", name: "Stainless Steel French Press", sku: "HM-FRP-016", category: "Home", image: "https://images.unsplash.com/photo-1523942839745-7848c839b661?w=300&q=80", stock: 4, reorderPoint: 10, price: 44.99, cost: 14.00, lastOrdered: "2024-02-12" },
  { id: "P017", name: "Linen Button-Down Shirt", sku: "AP-LBS-017", category: "Apparel", image: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=300&q=80", stock: 13, reorderPoint: 18, price: 54.99, cost: 19.00, lastOrdered: "2024-01-22" },
  { id: "P018", name: "Protein Powder Vanilla 2kg", sku: "GR-PRO-018", category: "Grocery", image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=300&q=80", stock: 29, reorderPoint: 20, price: 49.99, cost: 20.00, lastOrdered: "2024-03-06" },
  { id: "P019", name: "Ultra-slim Power Bank 20000mAh", sku: "EL-PBK-019", category: "Electronics", image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=300&q=80", stock: 1, reorderPoint: 12, price: 59.99, cost: 22.00, lastOrdered: "2024-01-18" },
  { id: "P020", name: "Cast Iron Skillet 10\"", sku: "HM-SKL-020", category: "Home", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&q=80", stock: 95, reorderPoint: 10, price: 54.99, cost: 18.00, lastOrdered: "2024-02-18" },
];

export const MOCK_PRODUCTS: Product[] = raw.map((p) => ({
  ...p,
  margin: calcMargin(p.price, p.cost),
  status: calcStatus(p.stock, p.reorderPoint),
  ordered: false,
}));

export const CATEGORIES = ["All", "Electronics", "Apparel", "Grocery", "Home"];
