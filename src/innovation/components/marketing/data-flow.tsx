import { dataFlow } from "@/lib/content";
import { Card } from "@/components/ui/card";

export function DataFlow() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {dataFlow.map((item) => (
        <Card className="relative overflow-hidden p-5" key={item.step}>
          <span className="text-sm font-bold text-coral">{item.step}</span>
          <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
        </Card>
      ))}
    </div>
  );
}
