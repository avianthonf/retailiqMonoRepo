"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

type EventType = "tax" | "payroll" | "supplier" | "milestone" | "subscription";
interface CalEvent { id: string; date: string; title: string; type: EventType; amount?: number; }

const TYPE_STYLE: Record<EventType, { color: string; bg: string; label: string }> = {
  tax: { color: "text-red-400", bg: "bg-red-400", label: "Tax" },
  payroll: { color: "text-blue-400", bg: "bg-blue-400", label: "Payroll" },
  supplier: { color: "text-orange-400", bg: "bg-orange-400", label: "Supplier" },
  milestone: { color: "text-emerald-400", bg: "bg-emerald-400", label: "Milestone" },
  subscription: { color: "text-purple-400", bg: "bg-purple-400", label: "Subscription" },
};

const INITIAL_EVENTS: CalEvent[] = [
  { id: "e1", date: "2026-03-28", title: "Staff Payroll", type: "payroll", amount: 14000 },
  { id: "e2", date: "2026-03-31", title: "Q1 Tax Estimate Due", type: "tax", amount: 8200 },
  { id: "e3", date: "2026-04-01", title: "Supplier Invoice – TechSupply", type: "supplier", amount: 7800 },
  { id: "e4", date: "2026-04-07", title: "SaaS Subscriptions", type: "subscription", amount: 650 },
  { id: "e5", date: "2026-04-10", title: "Revenue Milestone Q1", type: "milestone", amount: 75000 },
  { id: "e6", date: "2026-04-15", title: "Staff Payroll", type: "payroll", amount: 14000 },
  { id: "e7", date: "2026-04-20", title: "Office Rent Due", type: "supplier", amount: 2400 },
  { id: "e8", date: "2026-04-25", title: "Insurance Premium", type: "subscription", amount: 480 },
  { id: "e9", date: "2026-04-30", title: "Monthly Tax Filing", type: "tax", amount: 3100 },
  { id: "e10", date: "2026-05-01", title: "Spring Revenue Target", type: "milestone", amount: 90000 },
];

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const pad = (n: number) => String(n).padStart(2,"0");

export default function FinancialCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalEvent[]>(INITIAL_EVENTS);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: "", title: "", type: "payroll" as EventType, amount: "" });

  const prev = () => { if (month === 0) { setYear(y=>y-1); setMonth(11); } else setMonth(m=>m-1); };
  const next = () => { if (month === 11) { setYear(y=>y+1); setMonth(0); } else setMonth(m=>m+1); };

  const totalDays = new Date(year, month+1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const cells = Array.from({ length: startDay + totalDays }, (_,i) => i < startDay ? null : i - startDay + 1);

  const eventsForDate = (d: number) => events.filter(e => e.date === `${year}-${pad(month+1)}-${pad(d)}`);
  const upcoming = events.filter(e => e.date >= today.toISOString().slice(0,10)).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,8);

  const handleAdd = () => {
    if (!newEvent.date || !newEvent.title) return;
    setEvents(prev => [...prev, { id: Math.random().toString(36).slice(2), date: newEvent.date, title: newEvent.title, type: newEvent.type, amount: newEvent.amount ? Number(newEvent.amount) : undefined }]);
    setNewEvent({ date:"", title:"", type:"payroll", amount:"" });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 space-y-6 pb-20 md:pb-6">
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-emerald-500/15"><CalendarDays size={20} className="text-emerald-500" /></div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Financial Calendar</h1>
          </div>
          <p className="text-sm text-muted-foreground">Upcoming payments, tax deadlines, and financial milestones.</p>
        </div>
        <button onClick={()=>setShowModal(true)} className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
          <Plus size={14} /> Add Event
        </button>
      </motion.div>

      <div className="flex flex-wrap gap-3">
        {Object.entries(TYPE_STYLE).map(([k,v]) => (
          <span key={k} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`w-2.5 h-2.5 rounded-full inline-block ${v.bg}`}/>{v.label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <button onClick={prev} className="p-2 rounded-xl hover:bg-muted transition-colors"><ChevronLeft size={16}/></button>
            <h2 className="font-bold text-sm">{MONTHS[month]} {year}</h2>
            <button onClick={next} className="p-2 rounded-xl hover:bg-muted transition-colors"><ChevronRight size={16}/></button>
          </div>
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS.map(d=><div key={d} className="py-2 text-center text-[10px] font-bold text-muted-foreground uppercase">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day,i) => {
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const dayEvents = day ? eventsForDate(day) : [];
              return (
                <div key={i} className={`min-h-[72px] border-b border-r border-border/40 p-1.5 ${!day?"bg-muted/5":"hover:bg-muted/20 transition-colors"}`}>
                  {day && <>
                    <span className={`text-[10px] font-bold inline-flex w-5 h-5 items-center justify-center rounded-full ${isToday?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>{day}</span>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0,2).map(e=>(
                        <div key={e.id} title={e.title} className={`text-[9px] font-semibold px-1 py-0.5 rounded truncate ${TYPE_STYLE[e.type].color} bg-current/10`}>{e.title}</div>
                      ))}
                      {dayEvents.length>2 && <div className="text-[9px] text-muted-foreground">+{dayEvents.length-2}</div>}
                    </div>
                  </>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border"><h2 className="font-bold text-sm">Upcoming Events</h2></div>
          <div className="divide-y divide-border">
            {upcoming.map(e=>(
              <div key={e.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                <div className={`w-2 mt-1.5 h-2 rounded-full shrink-0 ${TYPE_STYLE[e.type].bg}`}/>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs truncate">{e.title}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(e.date+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}</p>
                  {e.amount && <p className={`text-[10px] font-bold mt-0.5 ${TYPE_STYLE[e.type].color}`}>${e.amount.toLocaleString()}</p>}
                </div>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${TYPE_STYLE[e.type].color}`}>{TYPE_STYLE[e.type].label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
            <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.95,opacity:0}} className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Add Financial Event</h3>
                <button onClick={()=>setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted"><X size={16}/></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Title</label>
                  <input value={newEvent.title} onChange={e=>setNewEvent(p=>({...p,title:e.target.value}))} placeholder="e.g. Supplier Payment" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Date</label>
                    <input type="date" value={newEvent.date} onChange={e=>setNewEvent(p=>({...p,date:e.target.value}))} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Amount ($)</label>
                    <input type="number" value={newEvent.amount} onChange={e=>setNewEvent(p=>({...p,amount:e.target.value}))} placeholder="0" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"/>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Type</label>
                  <select value={newEvent.type} onChange={e=>setNewEvent(p=>({...p,type:e.target.value as EventType}))} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer">
                    {Object.entries(TYPE_STYLE).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <button onClick={handleAdd} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">Add Event</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
