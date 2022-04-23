export interface Transaction {
  id?: string;
  type: "Income" | "Expense";
  category: string;
  amount: number;
  date: string;
}
