import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useFinance } from "@/context/FinanceContext";

export function BalanceChart() {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let balance = 0;
    return sorted.map(t => {
      balance += t.type === "income" ? t.amount : -t.amount;
      return {
        date: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        balance,
      };
    });
  }, [transactions]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-base font-display font-semibold text-foreground mb-4">Balance Over Time</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `$${v}`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 13,
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Balance"]}
          />
          <Line type="monotone" dataKey="balance" stroke="hsl(var(--chart-savings))" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
