"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

import { Product, ViewMode, SortOption, StockStatus } from "@/components/inventory/types";
import { MOCK_PRODUCTS } from "@/components/inventory/inventoryData";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import ProductGrid from "@/components/inventory/ProductGrid";
import ProductTable from "@/components/inventory/ProductTable";
import StockAlerts from "@/components/inventory/StockAlerts";
import AddProductModal from "@/components/inventory/AddProductModal";
import CSVImport from "@/components/inventory/CSVImport";
import { useEffect } from "react";

function calcStatus(stock: number, reorderPoint: number): StockStatus {
  if (stock === 0 || stock < reorderPoint * 0.25) return "Critical";
  if (stock < reorderPoint) return "Low";
  if (stock > reorderPoint * 4) return "Overstocked";
  return "Good";
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("stock-asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch((err) => console.error("Inventory load error:", err))
      .finally(() => setLoading(false));
  }, []);

  /* ── Derived: Stock Alerts ───────────────────────── */
  const alerts = useMemo(
    () => products.filter((p) => (p.status === "Critical" || p.status === "Low") && !p.ordered),
    [products]
  );

  /* ── Derived: Filtered + Sorted Products ────────── */
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }
    switch (sortBy) {
      case "stock-asc":  list.sort((a, b) => a.stock - b.stock); break;
      case "stock-desc": list.sort((a, b) => b.stock - a.stock); break;
      case "value-desc": list.sort((a, b) => b.price * b.stock - a.price * a.stock); break;
      case "margin-desc":list.sort((a, b) => b.margin - a.margin); break;
    }
    return list;
  }, [products, search, category, sortBy]);

  /* ── Handlers ────────────────────────────────────── */
  const handleStockUpdate = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, stock: newStock, status: calcStatus(newStock, p.reorderPoint) }
          : p
      )
    );
  };

  const handleMarkAsOrdered = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ordered: true, status: "Good" as StockStatus }
          : p
      )
    );
  };

  const handleAddProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const handleCSVImport = (newProducts: Product[]) => {
    setProducts((prev) => [...newProducts, ...prev]);
  };

  /* ── Summary Stats ───────────────────────────────── */
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const totalSKUs = products.length;
  const criticalCount = products.filter((p) => p.status === "Critical").length;
  const avgMargin = Math.round(products.reduce((s, p) => s + p.margin, 0) / products.length);

  return (
    <div className="flex gap-6 h-full min-h-0">
      {/* ── Main Content ─────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-6 min-w-0 overflow-y-auto">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package size={22} className="text-primary" />
            <h1 className="text-2xl font-bold">Inventory</h1>
          </div>
          <p className="text-sm text-muted-foreground">Manage your product stock, pricing, and reorder levels.</p>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total SKUs", value: totalSKUs, color: "text-foreground", prefix: "" },
            { label: "Inventory Value", value: totalValue, color: "text-foreground", prefix: "$" },
            { label: "Critical Items", value: criticalCount, color: criticalCount > 0 ? "text-red-400" : "text-emerald-400", prefix: "" },
            { label: "Avg. Margin", value: avgMargin, color: avgMargin > 40 ? "text-emerald-400" : avgMargin > 25 ? "text-yellow-400" : "text-red-400", prefix: "", suffix: "%" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-card border border-border rounded-xl px-5 py-4 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <p className="text-xs text-muted-foreground font-medium mb-1">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.color}`}>
                <AnimatedCounter
                  end={kpi.value}
                  prefix={kpi.prefix}
                />
                {kpi.suffix}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filters Toolbar */}
        <InventoryFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddProduct={() => setShowAddModal(true)}
          onImportCSV={() => setShowCSVModal(true)}
        />

        {/* Product count */}
        <p className="text-xs text-muted-foreground -mt-2">
          Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> of {totalSKUs} products
        </p>

        {/* Product View — Grid or Table with animated transition */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ProductGrid products={filteredProducts} onStockUpdate={handleStockUpdate} />
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ProductTable
                products={filteredProducts}
                onStockUpdate={handleStockUpdate}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Stock Alerts Sidebar ─────────────────────── */}
      <StockAlerts alerts={alerts} onMarkAsOrdered={handleMarkAsOrdered} />

      {/* ── Modals ───────────────────────────────────── */}
      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProduct}
      />
      <CSVImport
        open={showCSVModal}
        onClose={() => setShowCSVModal(false)}
        onImport={handleCSVImport}
      />
    </div>
  );
}
