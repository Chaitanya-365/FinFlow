import { TransactionTable } from "@/components/TransactionTable";
import { AddTransactionModal } from "@/components/AddTransactionModal";

export default function Transactions() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Transactions</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your income and expenses</p>
        </div>
        <AddTransactionModal />
      </div>
      <TransactionTable />
    </div>
  );
}
