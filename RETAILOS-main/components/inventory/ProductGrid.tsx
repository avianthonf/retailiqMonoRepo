"use client";

import { AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import { Product } from "./types";

interface ProductGridProps {
  products: Product[];
  onStockUpdate: (id: string, newStock: number) => void;
}

export default function ProductGrid({ products, onStockUpdate }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
        <span className="text-5xl">📦</span>
        <p className="text-lg font-semibold">No products found</p>
        <p className="text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onStockUpdate={onStockUpdate} />
        ))}
      </AnimatePresence>
    </div>
  );
}
