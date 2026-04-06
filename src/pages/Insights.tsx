import { InsightsCards } from "@/components/InsightsCards";
import { BalanceChart } from "@/components/BalanceChart";

export default function Insights() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Insights</h2>
        <p className="text-sm text-muted-foreground mt-1">Smart observations about your finances</p>
      </div>
      <InsightsCards />
      <BalanceChart />
    </div>
  );
}
