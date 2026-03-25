"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery, queryClient } from "@/lib/queryStore";
import {
  ChevronLeft,
  LayoutDashboard,
  ShoppingCart,
  Users,
  BarChart,
  Settings,
  Sparkles,
  Package,
  RefreshCw,
  Globe,
  CalendarDays,
  BellRing,
  FileBarChart,
  ShoppingBag,
} from "lucide-react";

interface NavItem {
  name: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard",         icon: LayoutDashboard, href: "/dashboard" },
  { name: "Inventory",         icon: Package,         href: "/dashboard/inventory" },
  { name: "Inventory Sync",    icon: RefreshCw,       href: "/dashboard/inventory-sync" },
  { name: "Orders",            icon: ShoppingBag,     href: "/dashboard/orders" },
  { name: "Customers",         icon: Users,           href: "/dashboard/customers" },
  { name: "Omnichannel",       icon: Globe,           href: "/dashboard/omnichannel" },
  { name: "Financials",        icon: BarChart,        href: "/dashboard/financials" },
  { name: "Fin. Calendar",     icon: CalendarDays,    href: "/dashboard/financial-calendar" },
  { name: "Smart Alerts",      icon: BellRing,        href: "/dashboard/smart-alerts" },
  { name: "AI Assistant",      icon: Sparkles,        href: "/dashboard/ai" },
  { name: "Analytics",         icon: FileBarChart,    href: "/dashboard/analytics" },
  { name: "Reports",           icon: BarChart,        href: "/dashboard/reports" },
  { name: "Settings",          icon: Settings,        href: "/dashboard/settings" },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const { data: hasStockAlert } = useQuery({ queryKey: ['unread-stock-alerts'] });
  const { data: hasAiInsight } = useQuery({ queryKey: ['unread-ai-insights'] });

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleNavClick = (name: string) => {
    if (name === "Inventory" && hasStockAlert) {
      queryClient.setQueryData(['unread-stock-alerts'], false);
    }
    if (name === "AI Assistant" && hasAiInsight) {
      queryClient.setQueryData(['unread-ai-insights'], false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={`hidden md:flex relative h-screen flex-col transition-[width] duration-500 ease-in-out border-r border-border/50 bg-background/60 backdrop-blur-xl z-50`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      
      {/* ── Logo Section ──────────────────────────────── */}
      <div className="p-6 flex items-center justify-between relative z-10">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10">
              <Package size={18} className="text-primary-foreground" />
            </div>
            <span className="font-black text-xl tracking-tighter text-foreground">Retail<span className="text-primary">OS</span></span>
          </motion.div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-[color,background-color,box-shadow,transform] duration-200 active:scale-95 ring-1 ring-transparent hover:ring-primary/20 shadow-sm"
        >
          <ChevronLeft className={`transition-transform duration-500 ${isCollapsed ? "rotate-180" : ""}`} size={18} />
        </button>
      </div>
        <nav className="mt-8 flex-1 overflow-y-auto overflow-x-hidden pb-20">
          {navItems.map((item) => {
            const showBadge = (item.name === "Inventory" && Boolean(hasStockAlert)) || (item.name === "AI Assistant" && Boolean(hasAiInsight));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => handleNavClick(item.name)}
              className={`group flex items-center gap-4 p-4 mx-2 rounded-lg transition-[background-color,box-shadow,color] duration-300 relative overflow-hidden ${
                pathname === item.href
                  ? "bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                  : "hover:bg-secondary hover:shadow-[0_0_15px_rgba(var(--primary),0.1)] text-foreground/70"
              }`}
              >
                {/* Glow border on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-r-full" />
                
                <div className="relative z-10 flex items-center justify-center">
                  {(() => {
                    const Icon = item.icon;
                    return <Icon className={`w-5 h-5 transition-[color,transform] duration-300 ${
                      pathname === item.href ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary group-hover:scale-110"
                    }`} />;
                  })()}
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5" aria-hidden="true">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-claude-orange opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-claude-orange"></span>
                    </span>
                  )}
                </div>
                {!isCollapsed && <span className={`z-10 font-semibold text-sm transition-colors ${
                  pathname === item.href
                    ? "text-primary"
                    : "group-hover:text-claude-charcoal dark:group-hover:text-claude-beige"
                }`}>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      {/* ── Footer / Status ──────────────────────────── */}
      <div className="p-4 border-t border-border/50 relative z-10">
        <div className={`flex items-center gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/10 transition-[justify-content] ${isCollapsed ? "justify-center" : ""}`}>
          <div className="relative" aria-hidden="true">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">System Active</span>
              <span className="text-[10px] text-muted-foreground font-medium">Synced 1m ago</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-md border-t border-border/10 flex items-center justify-around z-50 px-2 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] pb-safe">
        {navItems.slice(0, 5).map((item) => { // Only show top 5 on mobile to save space
          const showBadge = (item.name === "Inventory" && Boolean(hasStockAlert)) || (item.name === "AI Assistant" && Boolean(hasAiInsight));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => handleNavClick(item.name)}
              className={`relative p-2 flex flex-col items-center justify-center transition-colors active:scale-95 ${
                pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {(() => {
                const Icon = item.icon;
                return <Icon className="w-5 h-5 mb-1 flex-shrink-0" />;
              })()}
              <span className="text-[10px] truncate max-w-[60px] font-medium">{item.name}</span>
              {showBadge && (
                <span className="absolute top-1 right-2 flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-claude-orange opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-claude-orange"></span>
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
