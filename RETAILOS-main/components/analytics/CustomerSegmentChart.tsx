"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CustomerSegment } from "./types";

interface Props {
  data: CustomerSegment[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value, color } = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-2xl text-sm">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
        <span className="font-semibold">{name}</span>
      </div>
      <p className="text-muted-foreground mt-1">{value}% of total</p>
    </div>
  );
};

export default function CustomerSegmentChart({ data }: Props) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold text-sm mb-2">Customer Segments</h3>
      <p className="text-xs text-muted-foreground mb-4">Repeat vs New customers</p>

      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              isAnimationActive={true}
              animationBegin={200}
              animationDuration={800}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center stat */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-extrabold">{data[0]?.value}%</p>
            <p className="text-[10px] text-muted-foreground">Repeat Rate</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-bold">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
