export type TransactionType = "income" | "expense";
export type UserRole = "admin" | "viewer";

export type Category =
  | "Salary" | "Freelance" | "Investment"
  | "Food" | "Shopping" | "Bills" | "Travel" | "Entertainment" | "Health" | "Other" | "UPI Payment";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: Category;
  type: TransactionType;
  description: string;
}

export type SortField = "date" | "amount";
export type SortOrder = "asc" | "desc";

export interface Filters {
  search: string;
  type: TransactionType | "all";
  sortField: SortField;
  sortOrder: SortOrder;
}

export interface Contact {
  id: string;
  name: string;
  upiId: string;
  avatar?: string;
  color: string;
}
