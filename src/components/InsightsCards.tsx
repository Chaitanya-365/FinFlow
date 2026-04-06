import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertCircle, Award } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";

export function InsightsCards() {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === "expense");
    const catTotals: Record<string, number> = {};
    expenses.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });

    const highestCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

    // Monthly comparison
    const now = new Date();
    const thisMonth = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === "expense";
    }).reduce((s, t) => s + t.amount, 0);

    const lastMonth = transactions.filter(t => {
      const d = new Date(t.date);
      const prev = new Date(now.getFullYear(), now.getMonth() - 1);
      return d.getMonth() === prev.getMonth() && d.getFullYear() === prev.getFullYear() && t.type === "expense";
    }).reduce((s, t) => s + t.amount, 0);

    const change = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return { highestCategory, thisMonth, lastMonth, change, savingsRate };
  }, [transactions]);

  const cards = [
    {
      icon: Award,
      title: "Top Spending",
      value: insights.highestCategory ? `${insights.highestCategory[0]} — $${insights.highestCategory[1].toLocaleString()}` : "No data",
      color: "text-accent",
    },
    {
      icon: insights.change > 0 ? TrendingUp : TrendingDown,
      title: "Monthly Trend",
      value: insights.lastMonth > 0
        ? `${insights.change > 0 ? "↑" : "↓"} ${Math.abs(insights.change).toFixed(1)}% vs last month`
        : "Not enough data",
      color: insights.change > 0 ? "text-chart-expense" : "text-chart-income",
    },
    {
      icon: AlertCircle,
      title: "Savings Rate",
      value: `${insights.savingsRate.toFixed(1)}% of income saved`,
      color: insights.savingsRate > 20 ? "text-chart-income" : "text-chart-expense",
    },
    {
      icon: insights.change > 0 ? AlertCircle : TrendingDown,
      title: "Observation",
      value: insights.change > 0
        ? "Spending increased this month. Consider reviewing your budget."
        : "Great job! Spending is under control this month.",
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{card.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
