import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart3, ShoppingCart, Users } from 'lucide-react';

interface Transaction {
  id: string;
  customer: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  avatar: string;
}

export default function AnalyticsTab() {
  const transactions: Transaction[] = [
    { id: '1', customer: 'Olivia Martin', amount: '$1,999.00', status: 'completed', date: '2 hours ago' },
    { id: '2', customer: 'Jackson Lee', amount: '$399.00', status: 'completed', date: '4 hours ago' },
    { id: '3', customer: 'Isabella Nguyen', amount: '$299.00', status: 'pending', date: '6 hours ago' },
    { id: '4', customer: 'William Kim', amount: '$99.00', status: 'completed', date: '8 hours ago' },
    { id: '5', customer: 'Sofia Davis', amount: '$499.00', status: 'failed', date: '10 hours ago' },
  ];

  const activities: Activity[] = [
    { id: '1', user: 'John Doe', action: 'Created a new project', time: '5 min ago', avatar: 'JD' },
    { id: '2', user: 'Sarah Smith', action: 'Updated customer profile', time: '15 min ago', avatar: 'SS' },
    { id: '3', user: 'Mike Johnson', action: 'Completed order #1234', time: '1 hour ago', avatar: 'MJ' },
    { id: '4', user: 'Emma Wilson', action: 'Added new product', time: '2 hours ago', avatar: 'EW' },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-7 pt-2 animate-in fade-in duration-500">
      {/* Main Chart Area */}
      <Card className="lg:col-span-4 border-border/50 bg-card/40 backdrop-blur-md shadow-xl">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue" className="space-y-4 outline-none">
              <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-xl border border-border/50">
                <div className="text-center space-y-2">
                  <BarChart3 className="h-12 w-12 mx-auto text-primary/50 animate-pulse" />
                  <p className="text-sm font-medium text-muted-foreground/60">Revenue visualization area</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="orders" className="space-y-4 outline-none">
              <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-xl border border-border/50">
                <div className="text-center space-y-2">
                  <ShoppingCart className="h-12 w-12 mx-auto text-primary/50 animate-pulse" />
                  <p className="text-sm font-medium text-muted-foreground/60">Orders chart area</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="customers" className="space-y-4 outline-none">
              <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-xl border border-border/50">
                <div className="text-center space-y-2">
                  <Users className="h-12 w-12 mx-auto text-primary/50 animate-pulse" />
                  <p className="text-sm font-medium text-muted-foreground/60">Customers chart area</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Activity Mini */}
      <Card className="lg:col-span-3 border-border/50 bg-card/40 backdrop-blur-md shadow-xl">
        <CardHeader>
          <CardTitle>Team Activity</CardTitle>
          <CardDescription>Latest updates from your team</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-6 mt-2">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 group cursor-default">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:ring-primary/30">
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                      {activity.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold leading-none text-foreground group-hover:text-primary transition-colors">{activity.user}</p>
                    <p className="text-sm font-medium text-muted-foreground">{activity.action}</p>
                    <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="col-span-full border-border/50 bg-card/40 backdrop-blur-md shadow-xl mt-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>You have {transactions.length} recorded transactions tracking today.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl ring-1 ring-border/50 transition-[color,box-shadow,transform] active:scale-95">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/50 transition-colors cursor-default"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10 shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {transaction.customer
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-foreground">{transaction.customer}</p>
                    <p className="text-xs font-medium text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-sm font-black tracking-tight">{transaction.amount}</span>
                  <Badge
                    variant={
                      transaction.status === 'completed'
                        ? 'default'
                        : transaction.status === 'pending'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className="w-[85px] justify-center uppercase text-[10px] font-black tracking-widest leading-none h-6"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
