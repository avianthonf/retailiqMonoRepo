"use client";

import { Bell, Search, Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { ActionSearchBar, Action } from "@/components/ui/action-search-bar";
import { LineChart, PackageCheck, BrainCircuit, PieChart } from "lucide-react";

const Header = () => {
  const router = useRouter();

  const handleNotificationClick = () => {
    toast.success("No new notifications", {
      icon: "🔔",
      style: {
        borderRadius: "1rem",
        background: "#1D1D1D",
        color: "#F5F2ED",
      },
    });
  };

  const headerCommands: Action[] = [
    {
      id: "1",
      label: "View Revenue Report",
      icon: <LineChart className="h-4 w-4 text-blue-500" />,
      description: "Financials",
      short: "⌘R",
      end: "Analytics",
      href: "/dashboard/financials"
    },
    {
      id: "2",
      label: "Check Low Stock",
      icon: <PackageCheck className="h-4 w-4 text-orange-500" />,
      description: "Inventory alerts",
      short: "⌘I",
      end: "Inventory",
      href: "/dashboard/inventory"
    },
    {
      id: "3",
      label: "Ask AI Assistant",
      icon: <BrainCircuit className="h-4 w-4 text-purple-500" />,
      description: "Voice & text agent",
      short: "⌘K",
      end: "AI",
      href: "/dashboard/ai"
    },
    {
      id: "4",
      label: "Customer Analytics",
      icon: <PieChart className="h-4 w-4 text-green-500" />,
      description: "CRM & demographics",
      short: "⌘U",
      end: "Customers",
      href: "/dashboard/customers"
    },
    {
      id: "5",
      label: "Log a Transaction",
      icon: <LineChart className="h-4 w-4 text-emerald-500" />,
      description: "Add income or expense",
      short: "⌘T",
      end: "Finance",
      href: "/dashboard/financials"
    },
    {
      id: "6",
      label: "Open Orders",
      icon: <PackageCheck className="h-4 w-4 text-amber-500" />,
      description: "View & manage orders",
      short: "⌘O",
      end: "Orders",
      href: "/dashboard/orders"
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl transition-all duration-300">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="flex h-20 items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <div className="hidden lg:flex flex-col border-l-2 border-primary/30 pl-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 leading-none mb-1">Intelligence Layer</h2>
            <p className="text-xs font-bold text-foreground opacity-90 tracking-tight">System Status: <span className="text-emerald-500">Optimal</span></p>
          </div>
          <div className="relative group max-w-md w-80 lg:w-96 flex items-center -mt-3">
            <ActionSearchBar className="w-full" actions={headerCommands} hideLabel />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-muted/30 p-1.5 rounded-2xl border border-border/40 gap-1 shadow-sm">
            <ThemeToggle />
            <button 
              onClick={handleNotificationClick}
              className="relative p-2.5 rounded-xl hover:bg-background transition-all duration-300 group"
            >
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background shadow-[0_0_10px_rgba(var(--primary),0.5)] animate-pulse"></span>
            </button>
            <button 
              onClick={() => router.push("/dashboard/ai")}
              className="p-2.5 rounded-xl hover:bg-primary/10 transition-all duration-300 group"
              title="Open AI Advisor"
            >
              <Bot className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </button>
          </div>
          <div className="h-8 w-[1.5px] bg-border/40 mx-1" />
          <button
            onClick={() => router.push("/dashboard/settings")}
            className="flex items-center gap-3 pl-2 group transition-all duration-500 hover:scale-105"
          >
            <div className="flex flex-col items-end mr-1">
              <span className="text-xs font-black text-foreground tracking-tight group-hover:text-primary transition-colors">Admin Persona</span>
              <span className="text-[10px] text-muted-foreground/60 font-medium">Supervisor</span>
            </div>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl overflow-hidden border border-border/50 group-hover:border-primary/50 transition-all shadow-md">
                <img
                  src="https://i.pravatar.cc/150?u=admin"
                  alt="User Avatar"
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-lg border-4 border-background" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
