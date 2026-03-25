"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Users, MessageCircle, Tag, Plus,
  ChevronDown, ChevronUp, StickyNote, ExternalLink,
} from "lucide-react";
import Link from "next/link";

import {
  MOCK_CUSTOMERS, SEGMENT_INFO, SEGMENT_COLORS, avatarColor,
} from "@/components/customers/customerData";
import RFMIndicator from "@/components/customers/RFMIndicator";
import SendMessageModal from "@/components/customers/SendMessageModal";
import { Customer, CustomerSegment } from "@/components/customers/types";

function genId() { return Math.random().toString(36).slice(2, 9); }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<CustomerSegment | "All">("All");
  const [spendRange, setSpendRange] = useState<[number, number]>([0, 99999]);
  const [sortKey, setSortKey] = useState<"totalSpent" | "orderCount" | "lastSeen">("totalSpent");
  const [sortAsc, setSortAsc] = useState(false);

  // Inline actions
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState<Record<string, string>>({});
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Message modal
  const [messageTarget, setMessageTarget] = useState<Customer | null>(null);

  // Filter & sort
  const filtered = useMemo(() => {
    return customers
      .filter((c) => {
        const q = search.toLowerCase();
        const match = !q || c.firstName.toLowerCase().includes(q) || c.lastName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
        const seg = segmentFilter === "All" || c.segment === segmentFilter;
        const spend = c.totalSpent >= spendRange[0] && c.totalSpent <= spendRange[1];
        return match && seg && spend;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortKey === "totalSpent") diff = a.totalSpent - b.totalSpent;
        if (sortKey === "orderCount") diff = a.orderCount - b.orderCount;
        if (sortKey === "lastSeen") diff = a.lastSeen.localeCompare(b.lastSeen);
        return sortAsc ? diff : -diff;
      });
  }, [customers, search, segmentFilter, spendRange, sortKey, sortAsc]);

  // Segment counts
  const segmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    customers.forEach((c) => { counts[c.segment] = (counts[c.segment] || 0) + 1; });
    return counts;
  }, [customers]);

  const handleAddNote = useCallback((customerId: string) => {
    const text = noteInput[customerId]?.trim();
    if (!text) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, notes: [{ id: genId(), date: new Date().toISOString().slice(0, 10), text, type: "note" as const }, ...c.notes] }
          : c
      )
    );
    setNoteInput((prev) => ({ ...prev, [customerId]: "" }));
    setActiveNote(null);
  }, [noteInput]);

  const handleAddTag = useCallback((customerId: string) => {
    const tag = tagInput[customerId]?.trim();
    if (!tag) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId && !c.tags.includes(tag)
          ? { ...c, tags: [...c.tags, tag] }
          : c
      )
    );
    setTagInput((prev) => ({ ...prev, [customerId]: "" }));
    setActiveTag(null);
  }, [tagInput]);

  const handleSendMessage = useCallback((customerId: string, message: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, notes: [{ id: genId(), date: new Date().toISOString().slice(0, 10), text: message, type: "message" as const }, ...c.notes] }
          : c
      )
    );
  }, []);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortAsc((p) => !p);
    else { setSortKey(key); setSortAsc(false); }
  };

  const SortIcon = ({ col }: { col: typeof sortKey }) =>
    sortKey === col
      ? sortAsc ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />
      : <ChevronDown size={12} className="opacity-30" />;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-primary/15"><Users size={20} className="text-primary" /></div>
            <h1 className="text-2xl font-extrabold tracking-tight">Customers</h1>
          </div>
          <p className="text-sm text-muted-foreground">{customers.length} customers · Segmented by RFM scoring</p>
        </div>
      </motion.div>

      {/* ── Segment cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {SEGMENT_INFO.map((seg, i) => (
          <motion.button
            key={seg.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSegmentFilter(segmentFilter === seg.name ? "All" : seg.name)}
            className={`bg-card border rounded-2xl p-4 text-left transition-all hover:scale-[1.02] ${
              segmentFilter === seg.name ? "border-primary shadow-lg shadow-primary/20" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{seg.icon}</span>
              <span className="text-xl font-extrabold" style={{ color: seg.color }}>
                {segmentCounts[seg.name] || 0}
              </span>
            </div>
            <p className="text-xs font-bold">{seg.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{seg.description}</p>
          </motion.button>
        ))}
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select
          value={segmentFilter}
          onChange={(e) => setSegmentFilter(e.target.value as CustomerSegment | "All")}
          className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="All">All Segments</option>
          {SEGMENT_INFO.map((s) => <option key={s.name} value={s.name}>{s.icon} {s.name}</option>)}
        </select>
        <select
          value={`${spendRange[0]}-${spendRange[1]}`}
          onChange={(e) => {
            const [lo, hi] = e.target.value.split("-").map(Number);
            setSpendRange([lo, hi]);
          }}
          className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="0-99999">All Spend</option>
          <option value="0-1000">Under $1,000</option>
          <option value="1000-5000">$1k – $5k</option>
          <option value="5000-10000">$5k – $10k</option>
          <option value="10000-99999">$10k+</option>
        </select>
        <span className="text-xs text-muted-foreground">
          Showing <span className="font-bold text-foreground">{filtered.length}</span> of {customers.length}
        </span>
      </div>

      {/* ── Customer table ──────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Segment</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">RFM</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground cursor-pointer select-none hover:text-foreground"
                    onClick={() => handleSort("totalSpent")}>
                  <span className="inline-flex items-center gap-1">Spent <SortIcon col="totalSpent" /></span>
                </th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground cursor-pointer select-none hover:text-foreground hidden sm:table-cell"
                    onClick={() => handleSort("orderCount")}>
                  <span className="inline-flex items-center gap-1">Orders <SortIcon col="orderCount" /></span>
                </th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground cursor-pointer select-none hover:text-foreground"
                    onClick={() => handleSort("lastSeen")}>
                  <span className="inline-flex items-center gap-1">Last Seen <SortIcon col="lastSeen" /></span>
                </th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.map((c, i) => {
                  const initials = c.firstName[0] + c.lastName[0];
                  const bg = avatarColor(c.firstName + c.lastName);
                  return (
                    <motion.tr
                      key={c.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-border last:border-0 hover:bg-muted/50 border-l-4 border-l-transparent hover:border-l-primary transition-all group"
                    >
                      {/* Avatar + Name + Email */}
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/customers/${c.id}`} className="flex items-center gap-3 group/link">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                            style={{ backgroundColor: bg }}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-xs group-hover/link:text-primary transition-colors">
                              {c.firstName} {c.lastName}
                              <ExternalLink size={10} className="inline-block ml-1 opacity-0 group-hover/link:opacity-60" />
                            </p>
                            <p className="text-[10px] text-muted-foreground">{c.email}</p>
                            {/* Tags */}
                            {c.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {c.tags.map((t) => (
                                  <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      </td>

                      {/* Segment */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className="text-[10px] font-bold px-2 py-1 rounded-full"
                          style={{ backgroundColor: SEGMENT_COLORS[c.segment] + "22", color: SEGMENT_COLORS[c.segment] }}
                        >
                          {c.segment}
                        </span>
                      </td>

                      {/* RFM */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <RFMIndicator rfm={c.rfm} size="sm" />
                      </td>

                      {/* Spent */}
                      <td className="px-4 py-3 text-right font-bold">${c.totalSpent.toLocaleString()}</td>

                      {/* Orders */}
                      <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell">{c.orderCount}</td>

                      {/* Last seen */}
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                        {new Date(c.lastSeen).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {/* Add Note */}
                          <button
                            onClick={() => setActiveNote(activeNote === c.id ? null : c.id)}
                            title="Add Note"
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                          >
                            <StickyNote size={13} className={activeNote === c.id ? "text-primary" : "text-muted-foreground"} />
                          </button>
                          {/* Add Tag */}
                          <button
                            onClick={() => setActiveTag(activeTag === c.id ? null : c.id)}
                            title="Add Tag"
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                          >
                            <Tag size={13} className={activeTag === c.id ? "text-primary" : "text-muted-foreground"} />
                          </button>
                          {/* Send Message */}
                          <button
                            onClick={() => setMessageTarget(c)}
                            title="Send Message"
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                          >
                            <MessageCircle size={13} className="text-muted-foreground" />
                          </button>
                        </div>

                        {/* Inline note input */}
                        <AnimatePresence>
                          {activeNote === c.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden mt-2"
                            >
                              <div className="flex gap-1">
                                <input
                                  type="text" placeholder="Quick note…"
                                  value={noteInput[c.id] || ""}
                                  onChange={(e) => setNoteInput((p) => ({ ...p, [c.id]: e.target.value }))}
                                  onKeyDown={(e) => e.key === "Enter" && handleAddNote(c.id)}
                                  className="flex-1 px-2 py-1 text-[10px] bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/40"
                                  autoFocus
                                />
                                <button onClick={() => handleAddNote(c.id)} className="px-2 py-1 bg-primary text-primary-foreground rounded-lg text-[10px] font-bold">
                                  <Plus size={10} />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Inline tag input */}
                        <AnimatePresence>
                          {activeTag === c.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden mt-2"
                            >
                              <div className="flex gap-1">
                                <input
                                  type="text" placeholder="New tag…"
                                  value={tagInput[c.id] || ""}
                                  onChange={(e) => setTagInput((p) => ({ ...p, [c.id]: e.target.value }))}
                                  onKeyDown={(e) => e.key === "Enter" && handleAddTag(c.id)}
                                  className="flex-1 px-2 py-1 text-[10px] bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/40"
                                  autoFocus
                                />
                                <button onClick={() => handleAddTag(c.id)} className="px-2 py-1 bg-primary text-primary-foreground rounded-lg text-[10px] font-bold">
                                  <Plus size={10} />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Send Message Modal ──────────────────────────────────────────── */}
      <SendMessageModal
        open={!!messageTarget}
        customerName={messageTarget ? `${messageTarget.firstName} ${messageTarget.lastName}` : ""}
        onClose={() => setMessageTarget(null)}
        onSend={(msg) => {
          if (messageTarget) handleSendMessage(messageTarget.id, msg);
          setMessageTarget(null);
        }}
      />
    </div>
  );
}
