import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RecentActivityProps {
  data: {
    type: string;
    description: string;
    time: string;
  }[];
  className?: string;
}

const RecentActivity = ({ data, className }: RecentActivityProps) => {
  return (
    <Card className={cn("bg-card/40 backdrop-blur-md rounded-2xl shadow-xl border border-border/50 flex flex-col h-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">
            Intelligence Feed
          </CardTitle>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 relative">
        <div className="space-y-6 relative h-full">
          <div className="absolute left-5 top-2 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />
          {data.map((item, index) => (
            <div key={index} className="flex items-start gap-4 relative z-10 group cursor-default">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ring-1 ring-border/50 transition-[transform,box-shadow] duration-300 group-hover:scale-110",
                  item.type === "order" ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
                )}
                aria-hidden="true"
              >
                <span className="text-lg" role="img" aria-label={item.type === "order" ? "order" : "alert"}>
                  {item.type === "order" ? "📦" : "⚠️"}
                </span>
              </div>
              <div className="flex-1 border-b border-border/20 pb-4 group-last:border-0">
                <p className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{item.description}</p>
                <p className="text-[10px] font-medium text-muted-foreground/60 mt-1 uppercase tracking-tighter">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
