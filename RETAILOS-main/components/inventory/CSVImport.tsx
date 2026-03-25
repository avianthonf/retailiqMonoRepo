"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Product } from "./types";
import { CATEGORIES } from "./inventoryData";

interface CSVImportProps {
  open: boolean;
  onClose: () => void;
  onImport: (products: Product[]) => void;
}

const REQUIRED = ["name", "sku", "price", "stock"];
const EXPECTED_HEADERS = ["name", "sku", "category", "price", "cost", "stock", "reorderPoint"];

interface ParsedRow {
  data: Record<string, string>;
  valid: boolean;
  errors: string[];
}

function parseCSV(text: string): { headers: string[]; rows: ParsedRow[] } {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rows: ParsedRow[] = lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.trim());
    const data: Record<string, string> = {};
    headers.forEach((h, i) => { data[h] = vals[i] ?? ""; });
    const errors: string[] = [];
    REQUIRED.forEach((r) => { if (!data[r]) errors.push(`Missing ${r}`); });
    if (data.price && isNaN(parseFloat(data.price))) errors.push("Invalid price");
    if (data.stock && isNaN(parseInt(data.stock))) errors.push("Invalid stock");
    return { data, valid: errors.length === 0, errors };
  });
  return { headers, rows };
}

export default function CSVImport({ open, onClose, onImport }: CSVImportProps) {
  const [step, setStep] = useState<"upload" | "preview">("upload");
  const [dragging, setDragging] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      setHeaders(parsed.headers);
      setRows(parsed.rows);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleImport = () => {
    const validRows = rows.filter((r) => r.valid);
    const products: Product[] = validRows.map((r, i) => {
      const price = parseFloat(r.data.price) || 0;
      const cost = parseFloat(r.data.cost) || 0;
      const stock = parseInt(r.data.stock, 10) || 0;
      const reorderPoint = parseInt(r.data.reorderPoint, 10) || 10;
      const margin = price > 0 ? Math.round(((price - cost) / price) * 100) : 0;
      let status: Product["status"] = "Good";
      if (stock === 0 || stock < reorderPoint * 0.25) status = "Critical";
      else if (stock < reorderPoint) status = "Low";
      else if (stock > reorderPoint * 4) status = "Overstocked";
      const cat = CATEGORIES.includes(r.data.category) ? r.data.category : "Electronics";
      return {
        id: `CSV${Date.now()}${i}`,
        name: r.data.name,
        sku: r.data.sku,
        category: cat,
        image: "https://placehold.co/300x160/1a1a2e/ffffff?text=Imported",
        stock, reorderPoint, price, cost, margin, status,
        lastOrdered: new Date().toISOString().split("T")[0],
        ordered: false,
      };
    });
    onImport(products);
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep("upload");
    setHeaders([]);
    setRows([]);
    onClose();
  };

  const validCount = rows.filter((r) => r.valid).length;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) resetAndClose(); }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
            <div>
              <h2 className="text-lg font-bold">Import Products via CSV</h2>
              {step === "preview" && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {validCount} of {rows.length} rows valid
                </p>
              )}
            </div>
            <button onClick={resetAndClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            {step === "upload" ? (
              <div className="space-y-5">
                {/* Drop Zone */}
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center h-56 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    dragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/60 hover:bg-muted/40"
                  }`}
                >
                  <FileText size={48} className="text-muted-foreground opacity-50 mb-3" />
                  <p className="text-sm font-medium">Drop your CSV file here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">.csv files only</p>
                  <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileInput} />
                </div>

                {/* Expected format */}
                <div className="rounded-xl bg-muted/50 border border-border p-4">
                  <p className="text-xs font-semibold mb-2 text-muted-foreground">Expected CSV columns:</p>
                  <code className="text-xs text-primary">{EXPECTED_HEADERS.join(", ")}</code>
                  <p className="text-xs text-muted-foreground mt-2">
                    Required: <span className="text-foreground font-medium">{REQUIRED.join(", ")}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Preview Table */}
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-3 py-2 text-left text-muted-foreground w-8">#</th>
                        {headers.map((h) => (
                          <th key={h} className="px-3 py-2 text-left text-muted-foreground capitalize">{h}</th>
                        ))}
                        <th className="px-3 py-2 text-center text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, 10).map((row, i) => (
                        <tr key={i} className={`border-b border-border last:border-0 ${!row.valid ? "bg-red-500/5" : ""}`}>
                          <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                          {headers.map((h) => (
                            <td key={h} className={`px-3 py-2 ${!row.data[h] && REQUIRED.includes(h) ? "text-red-400 font-semibold" : ""}`}>
                              {row.data[h] || <span className="text-muted-foreground italic">—</span>}
                            </td>
                          ))}
                          <td className="px-3 py-2 text-center">
                            {row.valid ? (
                              <CheckCircle2 size={14} className="text-emerald-400 inline" />
                            ) : (
                              <span title={row.errors.join(", ")}>
                                <AlertCircle size={14} className="text-red-400 inline" />
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rows.length > 10 && (
                  <p className="text-xs text-muted-foreground text-center">Showing first 10 of {rows.length} rows</p>
                )}
                {validCount < rows.length && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{rows.length - validCount} row(s) have errors and will be skipped on import.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            {step === "preview" && (
              <button onClick={() => setStep("upload")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Back
              </button>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <button onClick={resetAndClose} className="px-4 py-2 text-sm font-medium bg-muted hover:bg-muted/70 border border-border rounded-lg transition-colors">
                Cancel
              </button>
              {step === "preview" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleImport}
                  disabled={validCount === 0}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Upload size={14} />
                  Import {validCount} Product{validCount !== 1 ? "s" : ""}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
