import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ArrowUpDown, Search } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TransactionTable() {
  const { filteredTransactions, filters, setFilters, deleteTransaction, role } = useFinance();

  return (
    <div className="glass-card rounded-xl p-5 space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={filters.search}
            onChange={e => setFilters({ search: e.target.value })}
            className="pl-9 bg-muted/50 border-border"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "income", "expense"] as const).map(t => (
            <Button
              key={t}
              size="sm"
              variant={filters.type === t ? "default" : "outline"}
              onClick={() => setFilters({ type: t })}
              className="capitalize"
            >
              {t}
            </Button>
          ))}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setFilters({
              sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
            })}
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            {filters.sortField}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setFilters({
              sortField: filters.sortField === "date" ? "amount" : "date",
            })}
          >
            Sort by {filters.sortField === "date" ? "amount" : "date"}
          </Button>
        </div>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No transactions found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">Date</th>
                <th className="text-left py-3 px-2 font-medium">Description</th>
                <th className="text-left py-3 px-2 font-medium">Category</th>
                <th className="text-right py-3 px-2 font-medium">Amount</th>
                {role === "admin" && <th className="py-3 px-2" />}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTransactions.map(t => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-2 text-muted-foreground">
                      {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="py-3 px-2 font-medium text-foreground">{t.description}</td>
                    <td className="py-3 px-2">
                      <Badge variant="secondary" className="font-normal">{t.category}</Badge>
                    </td>
                    <td className={`py-3 px-2 text-right font-semibold ${t.type === "income" ? "text-chart-income" : "text-chart-expense"}`}>
                      {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
                    </td>
                    {role === "admin" && (
                      <td className="py-3 px-2 text-right">
                        <Button size="icon" variant="ghost" onClick={() => deleteTransaction(t.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
