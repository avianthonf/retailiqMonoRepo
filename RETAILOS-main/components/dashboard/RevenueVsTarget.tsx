"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RevenueVsTargetProps {
  data: {
    current: number;
    target: number;
  };
}

const RevenueVsTarget = ({ data }: RevenueVsTargetProps) => {
  const percentage = (data.current / data.target) * 100;

  return (
    <Card className="bg-card/40 backdrop-blur-md rounded-2xl shadow-xl border border-border/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">
          Revenue vs Target
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <div className="flex justify-between text-sm font-bold text-foreground mb-4">
            <span className="text-2xl">${data.current.toLocaleString()}</span>
            <span className="text-muted-foreground mt-2">${data.target.toLocaleString()}</span>
          </div>
          <div className="relative w-full h-4 mt-2 bg-secondary/50 rounded-full overflow-hidden border border-border/50">
            <motion.div
              className="absolute h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 -skew-x-12 animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueVsTarget;
