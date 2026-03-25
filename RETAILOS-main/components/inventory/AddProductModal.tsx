"use client";

import { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, ImageIcon } from "lucide-react";
import { Product } from "./types";
import { CATEGORIES } from "./inventoryData";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

const EMPTY_FORM = {
  name: "", sku: "", category: "Electronics",
  price: "", cost: "", stock: "", reorderPoint: "",
  image: "",
};

export default function AddProductModal({ open, onClose, onAdd }: AddProductModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const price = parseFloat(form.price) || 0;
  const cost = parseFloat(form.cost) || 0;
  const margin = price > 0 ? Math.round(((price - cost) / price) * 100) : 0;

  const handleField = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setForm((f) => ({ ...f, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleImageFile(file);
  };

  const handleSubmit = () => {
    if (!form.name || !form.sku || !form.price || !form.stock) return;
    const stock = parseInt(form.stock, 10) || 0;
    const reorderPoint = parseInt(form.reorderPoint, 10) || 10;
    let status: Product["status"] = "Good";
    if (stock === 0 || stock < reorderPoint * 0.25) status = "Critical";
    else if (stock < reorderPoint) status = "Low";
    else if (stock > reorderPoint * 4) status = "Overstocked";

    const newProduct: Product = {
      id: `P${Date.now()}`,
      name: form.name,
      sku: form.sku,
      category: form.category,
      image: form.image || "https://placehold.co/300x160/1a1a2e/ffffff?text=No+Image",
      stock,
      reorderPoint,
      price,
      cost,
      margin,
      status,
      lastOrdered: new Date().toISOString().split("T")[0],
      ordered: false,
    };
    onAdd(newProduct);
    setForm(EMPTY_FORM);
    setImagePreview(null);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 450, damping: 30, mass: 0.8 }}
          className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
            <h2 className="text-lg font-bold">Add New Product</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Image Upload */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Product Image</label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  dragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/60 hover:bg-muted/40"
                }`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setImagePreview(null); setForm((f) => ({ ...f, image: "" })); }}
                      className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black/80"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground pointer-events-none">
                    <ImageIcon size={32} className="opacity-50" />
                    <p className="text-sm font-medium">Drop image here or click to browse</p>
                    <p className="text-xs">PNG, JPG, WebP up to 10MB</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
              </div>
            </div>

            {/* Name + SKU */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Product Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleField("name", e.target.value)}
                  placeholder="e.g. Wireless Headphones"
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">SKU <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => handleField("sku", e.target.value)}
                  placeholder="e.g. EL-WH-001"
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-semibold mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => handleField("category", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
              >
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price + Cost + Margin */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Price ($) <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.price}
                  onChange={(e) => handleField("price", e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Cost ($)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.cost}
                  onChange={(e) => handleField("cost", e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Margin (auto)</label>
                <div className={`px-3 py-2 text-sm rounded-lg border border-border bg-muted font-semibold ${
                  margin > 50 ? "text-emerald-400" : margin > 30 ? "text-yellow-400" : margin > 0 ? "text-red-400" : "text-muted-foreground"
                }`}>
                  {price > 0 ? `${margin}%` : "—"}
                </div>
              </div>
            </div>

            {/* Stock + Reorder */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Initial Stock <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => handleField("stock", e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Reorder Point</label>
                <input
                  type="number"
                  min={0}
                  value={form.reorderPoint}
                  onChange={(e) => handleField("reorderPoint", e.target.value)}
                  placeholder="10"
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-muted hover:bg-muted/70 border border-border rounded-lg transition-colors">
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={!form.name || !form.sku || !form.price || !form.stock}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Upload size={14} />
              Add Product
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
