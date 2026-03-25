"use client";

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import { ExpenseCategory } from "./types";

interface ExpenseDonutProps {
  data: ExpenseCategory[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value, total } = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-semibold">{name}</p>
      <p className="text-muted-foreground">${value.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">{((value / total) * 100).toFixed(1)}% of total</p>
    </div>
  );
};

export default function ExpenseDonut({ data }: ExpenseDonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const enriched = data.map((d) => ({ ...d, total }));

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold text-sm mb-4">Expense Breakdown</h3>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={enriched}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              isAnimationActive={true}
              animationBegin={200}
              animationDuration={900}
            >
              {enriched.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center total */}
        <div className="text-center -mt-2 mb-4">
          <p className="text-xs text-muted-foreground">Total Expenses</p>
          <p className="text-lg font-bold">${total.toLocaleString()}</p>
        </div>

        {/* Legend with % */}
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2">
          {enriched.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-muted-foreground truncate flex-1">{d.name}</span>
              <span className="font-semibold text-foreground ml-auto whitespace-nowrap">
                {((d.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
