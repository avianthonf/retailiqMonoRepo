import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AiInsightProps {
  insight: string;
}

const AiInsight = ({ insight }: AiInsightProps) => {
  return (
    <Card className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-xl border-0 text-primary-foreground relative overflow-hidden group h-full">
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity duration-1000 rotate-12 group-hover:rotate-0">
        <Sparkles size={64} className="animate-pulse" />
      </div>
      <CardContent className="p-8 relative z-10 h-full flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-white/80" />
          <h3 className="text-sm font-black uppercase tracking-widest text-white/80">AI Strategic Insight</h3>
        </div>
        <p className="text-xl font-semibold leading-relaxed tracking-tight">{insight}</p>
      </CardContent>
    </Card>
  );
};

export default AiInsight;
