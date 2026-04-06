import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Transaction, UserRole, Filters, Category, TransactionType } from "@/types/finance";
import { mockTransactions } from "@/data/mockData";

interface FinanceContextType {
  transactions: Transaction[];
  role: UserRole;
  filters: Filters;
  darkMode: boolean;
  setRole: (role: UserRole) => void;
  setFilters: (filters: Partial<Filters>) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  toggleDarkMode: () => void;
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  filteredTransactions: Transaction[];
}

const FinanceContext = createContext<FinanceContextType | null>(null);

const STORAGE_KEY = "finance_dashboard_data";

function loadFromStorage(): Transaction[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadFromStorage() || mockTransactions);
  const [role, setRole] = useState<UserRole>("admin");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("finance_dark") === "true");
  const [filters, setFiltersState] = useState<Filters>({
    search: "", type: "all", sortField: "date", sortOrder: "desc",
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => {
    localStorage.setItem("finance_dark", String(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const setFilters = useCallback((partial: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
  }, []);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    setTransactions(prev => [{ ...t, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);

  const totalIncome = useMemo(() => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalBalance = totalIncome - totalExpenses;

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filters.type !== "all") result = result.filter(t => t.type === filters.type);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => t.category.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const mul = filters.sortOrder === "asc" ? 1 : -1;
      if (filters.sortField === "date") return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [transactions, filters]);

  return (
    <FinanceContext.Provider value={{
      transactions, role, filters, darkMode, setRole, setFilters,
      addTransaction, deleteTransaction, toggleDarkMode,
      totalIncome, totalExpenses, totalBalance, filteredTransactions,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
