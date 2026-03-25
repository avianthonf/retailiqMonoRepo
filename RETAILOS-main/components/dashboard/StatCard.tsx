"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  name: string;
  value: number;
  chartData: { name: string; value: number }[];
  className?: string;
}

const StatCard = ({ name, value, chartData, className }: StatCardProps) => {
  return (
    <Card className={cn(
      "bg-card/40 backdrop-blur-md rounded-2xl shadow-xl border border-border/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group relative overflow-hidden",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-muted-foreground">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <AnimatedCounter
            end={value}
            duration={2}
            decimals={name.includes("Revenue") || name.includes("Profit") ? 2 : 0}
            prefix={name.includes("Revenue") || name.includes("Profit") ? "$" : ""}
            className="text-4xl font-bold"
          />
        </div>
        <div className="h-20 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#A680FF" // Can be updated to use CSS variable for primary if desired
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
