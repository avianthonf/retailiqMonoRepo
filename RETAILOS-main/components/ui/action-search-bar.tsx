"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Send,
    LineChart,
    PackageSearch,
    Users,
    BrainCircuit,
    FileText,
    Bell,
    Globe,
    RefreshCw,
} from "lucide-react";

function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export interface Action {
    id: string;
    label: string;
    icon: React.ReactNode;
    description?: string;
    short?: string;
    end?: string;
    href?: string;
}

interface SearchResult {
    actions: Action[];
}

const allActions: Action[] = [
    {
        id: "1",
        label: "View Revenue Report",
        icon: <LineChart className="h-4 w-4 text-blue-500" />,
        description: "Financials",
        short: "⌘R",
        end: "Analytics",
        href: "/dashboard/financials",
    },
    {
        id: "2",
        label: "Check Low Stock",
        icon: <PackageSearch className="h-4 w-4 text-orange-500" />,
        description: "Inventory alerts",
        short: "⌘I",
        end: "Inventory",
        href: "/dashboard/inventory",
    },
    {
        id: "3",
        label: "Ask AI Assistant",
        icon: <BrainCircuit className="h-4 w-4 text-purple-500" />,
        description: "Voice & text agent",
        short: "⌘K",
        end: "AI",
        href: "/dashboard/ai",
    },
    {
        id: "4",
        label: "Customer Analytics",
        icon: <Users className="h-4 w-4 text-green-500" />,
        description: "CRM & demographics",
        short: "⌘U",
        end: "Customers",
        href: "/dashboard/customers",
    },
    {
        id: "5",
        label: "Inventory Sync",
        icon: <RefreshCw className="h-4 w-4 text-cyan-500" />,
        description: "Stock sync & reorders",
        short: "⌘S",
        end: "Operations",
        href: "/dashboard/inventory-sync",
    },
    {
        id: "6",
        label: "Omnichannel Growth",
        icon: <Globe className="h-4 w-4 text-indigo-500" />,
        description: "Channel performance",
        short: "",
        end: "Growth",
        href: "/dashboard/omnichannel",
    },
    {
        id: "7",
        label: "Financial Calendar",
        icon: <FileText className="h-4 w-4 text-emerald-500" />,
        description: "Upcoming payments & dates",
        short: "",
        end: "Finance",
        href: "/dashboard/financial-calendar",
    },
    {
        id: "8",
        label: "Smart Alerts",
        icon: <Bell className="h-4 w-4 text-red-500" />,
        description: "Manage your notifications",
        short: "",
        end: "Alerts",
        href: "/dashboard/smart-alerts",
    },
];

function ActionSearchBar({ actions = allActions, className, hideLabel }: { actions?: Action[], className?: string, hideLabel?: boolean }) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<SearchResult | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedAction, setSelectedAction] = useState<Action | null>(null);
    const debouncedQuery = useDebounce(query, 200);

    useEffect(() => {
        if (!isFocused) {
            setResult(null);
            return;
        }

        if (!debouncedQuery) {
            setResult({ actions });
            return;
        }

        const normalizedQuery = debouncedQuery.toLowerCase().trim();
        const filteredActions = actions.filter((action) => {
            const searchableText = `${action.label} ${action.description || ""} ${action.end || ""}`.toLowerCase();
            return searchableText.includes(normalizedQuery);
        });

        setResult({ actions: filteredActions });
    }, [debouncedQuery, isFocused, actions]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const container = {
        hidden: { opacity: 0, height: 0 },
        show: {
            opacity: 1,
            height: "auto",
            transition: { height: { duration: 0.4 }, staggerChildren: 0.05 },
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: { height: { duration: 0.3 }, opacity: { duration: 0.2 } },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
    };

    const handleFocus = () => {
        setSelectedAction(null);
        setIsFocused(true);
    };

    return (
        <div className={className || "w-full max-w-xl mx-auto"}>
            <div className="relative flex flex-col justify-start items-center">
                <div className="w-full max-w-sm sticky top-0 z-10 pt-4 pb-1">
                    {!hideLabel && (
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block" htmlFor="search">
                            Search Commands
                        </label>
                    )}
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search pages & actions…"
                            value={query}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            className="pl-3 pr-9 py-1.5 h-9 text-sm rounded-lg focus-visible:ring-offset-0"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4">
                            <AnimatePresence mode="popLayout">
                                {query.length > 0 ? (
                                    <motion.div key="send" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Send className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="search" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-sm z-50">
                    <AnimatePresence>
                        {isFocused && result && !selectedAction && (
                            <motion.div
                                className="absolute w-full border rounded-md shadow-sm overflow-hidden dark:border-gray-800 bg-white dark:bg-black mt-1"
                                variants={container}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                            >
                                <motion.ul>
                                    {result.actions.length === 0 ? (
                                        <li className="px-3 py-4 text-center text-sm text-gray-400">No results found</li>
                                    ) : (
                                        result.actions.map((action) => (
                                            <motion.li
                                                key={action.id}
                                                className="px-3 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-zinc-900 cursor-pointer rounded-md"
                                                variants={item}
                                                layout
                                                onClick={() => {
                                                    setSelectedAction(action);
                                                    if (action.href) router.push(action.href);
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">{action.icon}</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{action.label}</span>
                                                    <span className="text-xs text-gray-400">{action.description}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {action.short && <span className="text-xs text-gray-400">{action.short}</span>}
                                                    <span className="text-xs text-gray-400 text-right">{action.end}</span>
                                                </div>
                                            </motion.li>
                                        ))
                                    )}
                                </motion.ul>
                                <div className="mt-1 px-3 py-2 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Press ⌘K to open commands</span>
                                        <span>ESC to cancel</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export { ActionSearchBar };
