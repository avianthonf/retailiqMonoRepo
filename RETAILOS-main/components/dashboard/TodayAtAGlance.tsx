import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TodayAtAGlanceProps {
  data: {
    name: string;
    value: string | number;
  }[];
}

const TodayAtAGlance = ({ data }: TodayAtAGlanceProps) => {
  return (
    <Card className="bg-card/40 backdrop-blur-md rounded-2xl shadow-xl border border-border/50 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">
          Today at a glance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {data.map((item) => (
            <div 
              key={item.name} 
              className="p-5 bg-secondary/30 rounded-2xl border border-secondary/50 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group"
            >
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 group-hover:text-primary transition-colors">{item.name}</p>
              <p className="text-2xl font-black text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayAtAGlance;
