import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant: "primary" | "income" | "expense";
  updatedAt?: string;
}

const variantStyles = {
  primary: "gradient-primary",
  income: "bg-card border border-border",
  expense: "bg-card border border-border",
};

const textStyles = {
  primary: "text-primary-foreground",
  income: "text-chart-income",
  expense: "text-chart-expense",
};

const subtitleStyles = {
  primary: "text-primary-foreground/70",
  income: "text-muted-foreground",
  expense: "text-muted-foreground",
};

export function SummaryCard({ title, value, icon: Icon, variant, updatedAt }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl p-5 ${variantStyles[variant]} glass-card`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${subtitleStyles[variant]}`}>{title}</p>
          <p className={`text-2xl font-display font-bold mt-1 ${textStyles[variant]}`}>{value}</p>
          {updatedAt && (
            <p className={`text-xs mt-1 opacity-80 ${subtitleStyles[variant]}`}>
              Updated: {updatedAt}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${variant === "primary" ? "bg-primary-foreground/20" : "bg-muted"}`}>
          <Icon className={`h-5 w-5 ${variant === "primary" ? "text-primary-foreground" : "text-muted-foreground"}`} />
        </div>
      </div>
    </motion.div>
  );
}
