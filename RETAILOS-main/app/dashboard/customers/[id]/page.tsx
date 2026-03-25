"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Mail, Phone, Calendar, ShoppingBag,
  DollarSign, MessageCircle, StickyNote, Tag, Plus,
  TrendingUp, Clock, Package,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

import { getCustomerById, SEGMENT_COLORS, avatarColor } from "@/components/customers/customerData";
import RFMIndicator from "@/components/customers/RFMIndicator";
import SendMessageModal from "@/components/customers/SendMessageModal";
import { Customer, CustomerNote } from "@/components/customers/types";

function genId() { return Math.random().toString(36).slice(2, 9); }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="font-bold mb-1">{label}</p>
      <p className="text-primary font-semibold">${payload[0]?.value?.toFixed(2)}</p>
    </div>
  );
};

export default function CustomerProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const baseCustomer = getCustomerById(id);

  const [notes, setNotes] = useState<CustomerNote[]>(baseCustomer?.notes ?? []);
  const [tags, setTags] = useState<string[]>(baseCustomer?.tags ?? []);
  const [newNote, setNewNote] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  if (!baseCustomer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold mb-2">Customer not found</p>
          <Link href="/dashboard/customers" className="text-primary hover:underline text-sm">← Back to customers</Link>
        </div>
      </div>
    );
  }

  const c = baseCustomer;
  const initials = c.firstName[0] + c.lastName[0];
  const bg = avatarColor(c.firstName + c.lastName);

  // Build spending timeline from orders
  const spendingTimeline = useMemo(() => {
    const sorted = [...c.orders].sort((a, b) => a.date.localeCompare(b.date));
    let running = 0;
    return sorted.map((o) => {
      running += o.total;
      return {
        date: new Date(o.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        total: o.total,
        cumulative: running,
      };
    });
  }, [c.orders]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      { id: genId(), date: new Date().toISOString().slice(0, 10), text: newNote.trim(), type: "note" },
      ...prev,
    ]);
    setNewNote("");
  };

  const handleAddTag = () => {
    if (!newTag.trim() || tags.includes(newTag.trim())) return;
    setTags((prev) => [...prev, newTag.trim()]);
    setNewTag("");
  };

  const handleSendMessage = (msg: string) => {
    setNotes((prev) => [
      { id: genId(), date: new Date().toISOString().slice(0, 10), text: msg, type: "message" },
      ...prev,
    ]);
  };

  const daysSinceLastSeen = Math.floor((Date.now() - new Date(c.lastSeen).getTime()) / 86400000);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
      {/* ── Back link ────────────────────────────────────────────────────── */}
      <Link href="/dashboard/customers"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={14} /> Back to Customers
      </Link>

      {/* ── Profile header ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0"
               style={{ backgroundColor: bg }}>
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold">{c.firstName} {c.lastName}</h1>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: SEGMENT_COLORS[c.segment] + "22", color: SEGMENT_COLORS[c.segment] }}
              >
                {c.segment}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Mail size={12} /> {c.email}</span>
              <span className="flex items-center gap-1"><Phone size={12} /> {c.phone}</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> Customer since {new Date(c.firstPurchase).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
            </div>
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">{t}</span>
              ))}
              <div className="flex items-center gap-1 ml-1">
                <input
                  type="text" placeholder="Add tag…" value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  className="w-20 px-2 py-0.5 text-[10px] bg-muted border border-border rounded-full focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                <button onClick={handleAddTag} className="p-0.5 rounded-full bg-primary/20 hover:bg-primary/30">
                  <Plus size={10} className="text-primary" />
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <button onClick={() => setShowMessage(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
              <MessageCircle size={14} /> Send Message
            </button>
            <span className="text-center text-[10px] text-muted-foreground">
              Last seen {daysSinceLastSeen === 0 ? "today" : `${daysSinceLastSeen}d ago`}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Stats + RFM row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: DollarSign, label: "Total Spent", value: `$${c.totalSpent.toLocaleString()}`, color: "#10b981" },
          { icon: ShoppingBag, label: "Orders", value: c.orderCount.toString(), color: "#6366f1" },
          { icon: TrendingUp, label: "Avg. Order", value: `$${c.avgOrderValue.toFixed(2)}`, color: "#8b5cf6" },
          { icon: Clock, label: "Last Seen", value: new Date(c.lastSeen).toLocaleDateString("en-US", { month: "short", day: "numeric" }), color: "#f59e0b" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: stat.color + "22" }}>
                <stat.icon size={13} style={{ color: stat.color }} />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">{stat.label}</span>
            </div>
            <p className="text-xl font-extrabold">{stat.value}</p>
          </motion.div>
        ))}

        {/* RFM Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="bg-card border border-border rounded-2xl p-4"
        >
          <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-3">RFM Score</p>
          <RFMIndicator rfm={c.rfm} size="md" />
        </motion.div>
      </div>

      {/* ── Spending timeline + Orders ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Spending chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-sm mb-4">Spending Timeline</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={spendingTimeline} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} width={44} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cumulative" stroke="#6366f1" strokeWidth={2} fill="url(#spendGrad)" dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order history */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-bold text-sm">Order History</h3>
            <p className="text-xs text-muted-foreground">{c.orders.length} orders</p>
          </div>
          <div className="max-h-[230px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 sticky top-0">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Order</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Date</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-muted-foreground">Items</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">Total</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {c.orders.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/25">
                    <td className="px-4 py-2 text-xs font-mono text-muted-foreground">{o.id}</td>
                    <td className="px-4 py-2 text-xs">{new Date(o.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-4 py-2 text-center text-xs text-muted-foreground">{o.items}</td>
                    <td className="px-4 py-2 text-right font-semibold text-xs">${o.total.toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        o.status === "completed" ? "bg-emerald-500/15 text-emerald-400" :
                        o.status === "processing" ? "bg-amber-500/15 text-amber-400" :
                        "bg-red-500/15 text-red-400"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Notes section ────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm">Notes & Messages</h3>
          <span className="text-xs text-muted-foreground">{notes.length} entries</span>
        </div>

        {/* Add note */}
        <div className="flex gap-2 mb-4">
          <input
            type="text" placeholder="Add a note…" value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
            className="flex-1 px-3 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button onClick={handleAddNote}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
            <Plus size={14} />
          </button>
        </div>

        {/* Notes list */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {notes.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No notes yet</p>
          )}
          {notes.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50"
            >
              <div className={`p-1 rounded-lg mt-0.5 ${n.type === "message" ? "bg-primary/15" : n.type === "tag" ? "bg-amber-500/15" : "bg-muted"}`}>
                {n.type === "message" ? <MessageCircle size={12} className="text-primary" /> :
                 n.type === "tag" ? <Tag size={12} className="text-amber-400" /> :
                 <StickyNote size={12} className="text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <p className="text-xs">{n.text}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(n.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {n.type === "message" && " · Sent message"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Message Modal ────────────────────────────────────────────────── */}
      <SendMessageModal
        open={showMessage}
        customerName={`${c.firstName} ${c.lastName}`}
        onClose={() => setShowMessage(false)}
        onSend={handleSendMessage}
      />
    </div>
  );
}
