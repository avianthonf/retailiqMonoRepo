"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@/lib/queryStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActionSearchBar, Action } from '@/components/ui/action-search-bar';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Calendar,
  FileText,
  MoveRight,
  PhoneCall,
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  Search as InputIcon,
  PackageCheck,
  BrainCircuit,
  PieChart,
  LineChart,
} from 'lucide-react';
import SkeletonCard from '@/components/dashboard/SkeletonCard';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon }) => {
  return (
    <Card className="overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center mt-1">
          {trend === 'up' ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-xs ml-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {change}
          </span>
          <span className="text-xs text-muted-foreground ml-1">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface Transaction {
  id: string;
  customer: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  date: string;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  avatar: string;
}

const PremiumDashboard: React.FC = () => {
  const router = useRouter();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["fast", "intelligent", "modular", "secure", "beautiful"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  // Fetch backend data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery<any>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      return res.json();
    },
    refetchInterval: 60000,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery<any>({
    queryKey: ['recentOrders'],
    queryFn: async () => {
      const res = await fetch('/api/orders?limit=5');
      if (!res.ok) throw new Error('Failed to fetch recent orders');
      return res.json();
    },
    refetchInterval: 60000,
  });

  if (dashboardLoading || ordersLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 pt-8">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // Transform Backend Stats
  const rawStats = dashboardData?.stats || [];
  const getIconForStat = (name: string) => {
    if (name.includes('Revenue') || name.includes('Sales')) return <DollarSign className="h-4 w-4" />;
    if (name.includes('Orders')) return <ShoppingCart className="h-4 w-4" />;
    if (name.includes('Users') || name.includes('Staff') || name.includes('Customers')) return <Users className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const stats = rawStats.map((stat: any, i: number) => ({
    title: stat.name,
    value: stat.name.includes('Revenue') ? `$${stat.value.toLocaleString()}` : stat.value.toLocaleString(),
    change: ['+20.1%', '+12.5%', '-2.4%', '+5.0%'][i % 4],
    trend: ['up', 'up', 'down', 'up'][i % 4] as 'up' | 'down',
    icon: getIconForStat(stat.name),
  }));

  // Transform Backend Transactions (Orders)
  const transactions: Transaction[] = (ordersData?.orders || []).map((o: any) => ({
    id: o.id.toString(),
    customer: o.customer,
    amount: `$${o.total.toFixed(2)}`,
    status: o.status.toLowerCase() as any, // 'completed', 'pending'
    date: o.date,
  }));

  // Transform Backend Activities
  const recentActivities = dashboardData?.recentActivity || [];
  const activities: Activity[] = recentActivities.map((act: any, idx: number) => ({
    id: `act-${idx}`,
    user: act.type === 'system' ? 'System' : act.description.split('by ')[1] || 'Agent',
    action: act.description,
    time: act.time,
    avatar: act.type === 'system' ? 'SY' : (act.description.split('by ')[1] || 'A').substring(0, 2).toUpperCase(),
  }));

  const retailOSCommands: Action[] = [
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
      icon: <PackageCheck className="h-4 w-4 text-orange-500" />,
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
      icon: <PieChart className="h-4 w-4 text-green-500" />,
      description: "CRM & demographics",
      short: "⌘U",
      end: "Customers",
      href: "/dashboard/customers",
    },
    {
      id: "5",
      label: "Log a Transaction",
      icon: <LineChart className="h-4 w-4 text-emerald-500" />,
      description: "Add income or expense",
      short: "⌘T",
      end: "Finance",
      href: "/dashboard/financials",
    },
    {
      id: "6",
      label: "Open Orders",
      icon: <PackageCheck className="h-4 w-4 text-amber-500" />,
      description: "View & manage orders",
      short: "⌘O",
      end: "Orders",
      href: "/dashboard/orders",
    },
  ];


  const bentoFeatures = [
    {
      Icon: BrainCircuit,
      name: "AI-Powered Insights",
      description: "RetailOS uses predictive modeling to forecast sales and stock depletion out-of-the-box.",
      href: "/dashboard",
      cta: "View Insights",
      background: <div className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: PackageCheck,
      name: "Inventory Sync",
      description: "Real-time sync across warehouses and physical storefronts.",
      href: "/inventory",
      cta: "Check Stock",
      background: <div className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: GlobeIcon,
      name: "Omnichannel Growth",
      description: "Connect retail, e-commerce, and B2B orders seamlessly.",
      href: "/orders",
      cta: "Manage Orders",
      background: <div className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: CalendarIcon,
      name: "Financial Calendar",
      description: "Filter automated ledgers by fiscal quarter.",
      href: "/financials",
      cta: "View Financials",
      background: <div className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: BellIcon,
      name: "Smart Alerts",
      description:
        "Get notified exactly when stock drops below threshold.",
      href: "/dashboard",
      cta: "Alert Settings",
      background: <div className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section with Animated Text */}
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
        <CardContent className="p-12">
          <div className="flex gap-8 items-center justify-center flex-col">

            <div className="flex gap-4 flex-col">
              <h1 className="text-4xl md:text-6xl max-w-2xl tracking-tighter text-center font-regular">
                <span className="text-foreground">RetailOS is remarkably</span>
                <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                  &nbsp;
                  {titles.map((title, index) => (
                    <motion.span
                      key={index}
                      className="absolute font-semibold text-primary"
                      initial={{ opacity: 0, y: "-100" }}
                      transition={{ type: "spring", stiffness: 50 }}
                      animate={
                        titleNumber === index
                          ? { y: 0, opacity: 1 }
                          : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                      }
                    >
                      {title}
                    </motion.span>
                  ))}
                </span>
              </h1>
              <p className="text-base md:text-lg leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
                Managing modern retail operations is already tough. RetailOS cleanly unifies point of sale, inventory, and intelligence into one command center.
              </p>
              {dashboardData?.aiInsight && (
                <TextShimmer className="text-sm font-medium mx-auto text-primary" duration={2}>
                  {`AI Insight: ${dashboardData.aiInsight}`}
                </TextShimmer>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Search Bar Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Retail Command Palette</CardTitle>
          <CardDescription>Search actions, query AI limits, or launch tools</CardDescription>
        </CardHeader>
        <CardContent>
          <ActionSearchBar actions={retailOSCommands} />
        </CardContent>
      </Card>
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Overview</h1>
          <p className="text-muted-foreground mt-1">
            Real-time intelligence and execution metrics from your operations.
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" className="space-x-2 font-medium">
            <Calendar className="h-4 w-4" />
            <span>Last 30 days</span>
          </Button>
          <Button className="space-x-2 font-medium">
            <FileText className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: any, index: number) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Main Chart Area */}
        <Card className="lg:col-span-4 border-border/50">
          <CardHeader>
            <CardTitle>Core Analytics</CardTitle>
            <CardDescription>Visual breakdown of RetailOS modules</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
              </TabsList>
              <TabsContent value="revenue" className="space-y-4">
                <Link href="/dashboard/financials">
                  <div className="h-[300px] flex flex-col items-center justify-center bg-muted/10 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="text-center space-y-3">
                      <BarChart3 className="h-12 w-12 mx-auto text-primary/60 group-hover:text-primary transition-colors" />
                      <p className="text-base font-semibold text-foreground">Revenue & P&L Report</p>
                      <p className="text-sm text-muted-foreground max-w-xs">Track monthly revenue, expenses, gross profit and net margins across all channels.</p>
                      <Button size="sm" className="mt-2">View Financials →</Button>
                    </div>
                  </div>
                </Link>
              </TabsContent>
              <TabsContent value="orders" className="space-y-4">
                <Link href="/dashboard/orders">
                  <div className="h-[300px] flex flex-col items-center justify-center bg-muted/10 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="text-center space-y-3">
                      <ShoppingCart className="h-12 w-12 mx-auto text-primary/60 group-hover:text-primary transition-colors" />
                      <p className="text-base font-semibold text-foreground">Order Management</p>
                      <p className="text-sm text-muted-foreground max-w-xs">View, filter and manage all orders. Track fulfillment status and customer order history.</p>
                      <Button size="sm" className="mt-2">View Orders →</Button>
                    </div>
                  </div>
                </Link>
              </TabsContent>
              <TabsContent value="customers" className="space-y-4">
                <Link href="/dashboard/customers">
                  <div className="h-[300px] flex flex-col items-center justify-center bg-muted/10 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="text-center space-y-3">
                      <Users className="h-12 w-12 mx-auto text-primary/60 group-hover:text-primary transition-colors" />
                      <p className="text-base font-semibold text-foreground">Customer Analytics</p>
                      <p className="text-sm text-muted-foreground max-w-xs">Explore customer segments, lifetime value, retention rates and CRM activity logs.</p>
                      <Button size="sm" className="mt-2">View Customers →</Button>
                    </div>
                  </div>
                </Link>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3 border-border/50">
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>Real-time audit log from RetailOS operations</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-6 mt-2">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                        {activity.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold leading-none text-foreground">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                      <p className="text-xs font-medium text-muted-foreground/60">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Bento Grid Features */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Platform Capabilities</CardTitle>
          <CardDescription>Deep dive into RetailOS flagship features</CardDescription>
        </CardHeader>
        <CardContent>
          <BentoGrid className="lg:grid-rows-3 mt-4">
            {bentoFeatures.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Transactions</CardTitle>
              <CardDescription>Streaming the latest {transactions.length} captured orders</CardDescription>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="outline" size="sm" className="font-semibold shadow-sm">
                View Ledger
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-2">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/10 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10 shadow-sm border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {transaction.customer.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-foreground">{transaction.customer}</p>
                    <p className="text-xs font-medium text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-sm font-bold">{transaction.amount}</span>
                  <Badge
                    variant={
                      transaction.status === 'completed'
                        ? 'default'
                        : transaction.status === 'pending'
                        ? 'secondary'
                        : 'outline'
                    }
                    className="w-[90px] justify-center uppercase tracking-wider text-[10px]"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="py-8 text-center text-muted-foreground text-sm font-medium">
                No recent transactions found on the ledger.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumDashboard;
