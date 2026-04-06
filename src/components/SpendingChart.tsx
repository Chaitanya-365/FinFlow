import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useFinance } from "@/context/FinanceContext";

const COLORS = [
  "hsl(155,70%,40%)", "hsl(210,80%,55%)", "hsl(260,60%,55%)",
  "hsl(30,85%,55%)", "hsl(340,65%,50%)", "hsl(180,60%,40%)",
  "hsl(45,80%,50%)", "hsl(0,72%,55%)",
];

export function SpendingChart() {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (!data.length) return null;

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-base font-display font-semibold text-foreground mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 13,
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
