export type StockStatus = "Critical" | "Low" | "Good" | "Overstocked";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  image: string;
  stock: number;
  reorderPoint: number;
  price: number;
  cost: number;
  margin: number;
  status: StockStatus;
  lastOrdered: string;
  ordered?: boolean;
}

export type SortOption = "stock-asc" | "stock-desc" | "value-desc" | "margin-desc";
export type ViewMode = "grid" | "table";
