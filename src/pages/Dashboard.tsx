import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { SummaryCard } from "@/components/SummaryCard";
import { BalanceChart } from "@/components/BalanceChart";
import { SpendingChart } from "@/components/SpendingChart";
import { QRPayCard } from "@/components/QRPayCard";

export default function Dashboard() {
  const { totalBalance, totalIncome, totalExpenses } = useFinance();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Your financial overview at a glance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          value={`$${totalBalance.toLocaleString()}`}
          icon={Wallet}
          variant="primary"
          updatedAt={new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        />
        <SummaryCard title="Total Income" value={`$${totalIncome.toLocaleString()}`} icon={TrendingUp} variant="income" />
        <SummaryCard title="Total Expenses" value={`$${totalExpenses.toLocaleString()}`} icon={TrendingDown} variant="expense" />
        <QRPayCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BalanceChart />
        <SpendingChart />
      </div>
    </div>
  );
}
