import { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFinance } from "@/context/FinanceContext";
import { Category, TransactionType } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories: Category[] = ["Salary", "Freelance", "Investment", "Food", "Shopping", "Bills", "Travel", "Entertainment", "Health", "Other"];

export function AddTransactionModal() {
  const { addTransaction, role } = useFinance();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: "", amount: "", category: "" as Category, type: "expense" as TransactionType, description: "" });
  const [error, setError] = useState("");

  if (role !== "admin") return null;

  const handleSubmit = () => {
    if (!form.date || !form.amount || !form.category || !form.description) {
      setError("All fields are required");
      return;
    }
    if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    addTransaction({ ...form, amount: Number(form.amount) });
    setForm({ date: "", amount: "", category: "" as Category, type: "expense", description: "" });
    setError("");
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gradient-primary text-primary-foreground border-0">
        <Plus className="h-4 w-4 mr-2" /> Add Transaction
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-display font-semibold text-lg text-foreground">New Transaction</h3>
                <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="space-y-3">
                <div>
                  <Label className="text-foreground">Description</Label>
                  <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="bg-muted/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-foreground">Amount ($)</Label>
                    <Input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} className="bg-muted/50" />
                  </div>
                  <div>
                    <Label className="text-foreground">Date</Label>
                    <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="bg-muted/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-foreground">Type</Label>
                    <Select value={form.type} onValueChange={(v: TransactionType) => setForm(p => ({ ...p, type: v }))}>
                      <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-foreground">Category</Label>
                    <Select value={form.category} onValueChange={(v: Category) => setForm(p => ({ ...p, category: v }))}>
                      <SelectTrigger className="bg-muted/50"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full gradient-primary text-primary-foreground border-0">
                Add Transaction
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
