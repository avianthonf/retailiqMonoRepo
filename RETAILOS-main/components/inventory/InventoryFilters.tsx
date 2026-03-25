"use client";

import { Search, X, LayoutGrid, List, Plus, Upload } from "lucide-react";
import { ViewMode, SortOption } from "./types";
import { CATEGORIES } from "./inventoryData";

interface InventoryFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  sortBy: SortOption;
  onSortChange: (v: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
  onAddProduct: () => void;
  onImportCSV: () => void;
}

export default function InventoryFilters({
  search, onSearchChange, category, onCategoryChange,
  sortBy, onSortChange, viewMode, onViewModeChange,
  onAddProduct, onImportCSV,
}: InventoryFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search products or SKU..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="py-2 px-3 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="py-2 px-3 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
      >
        <option value="stock-asc">Stock: Low → High</option>
        <option value="stock-desc">Stock: High → Low</option>
        <option value="value-desc">Value: High → Low</option>
        <option value="margin-desc">Margin: High → Low</option>
      </select>

      {/* View Toggle */}
      <div className="flex items-center bg-muted rounded-lg p-1 gap-1">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-card shadow text-primary" : "text-muted-foreground hover:text-foreground"}`}
          title="Grid View"
        >
          <LayoutGrid size={16} />
        </button>
        <button
          onClick={() => onViewModeChange("table")}
          className={`p-1.5 rounded-md transition-all ${viewMode === "table" ? "bg-card shadow text-primary" : "text-muted-foreground hover:text-foreground"}`}
          title="Table View"
        >
          <List size={16} />
        </button>
      </div>

      {/* Actions */}
      <button
        onClick={() => onImportCSV()}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/70 border border-border rounded-lg transition-colors"
      >
        <Upload size={14} />
        <span className="hidden sm:inline">Import CSV</span>
      </button>

      <button
        onClick={() => onAddProduct()}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        <Plus size={15} />
        Add Product
      </button>
    </div>
  );
}
