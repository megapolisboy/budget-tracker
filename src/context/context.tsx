import { Context, createContext, useReducer } from "react";
import { Transaction } from "../types.t";

interface Action {
  type: string;
  payload: any;
}

const initialState: Transaction[] =
  JSON.parse(localStorage.getItem("transactions") as string) || [];

export const ExpenseTrackerContext: Context<any> = createContext(initialState);

const reducer = (state: Transaction[], action: Action) => {
  if (action.type === "DELETE_TRANSACTION") {
    const transactions = state.filter(
      (transaction) => transaction.id !== action.payload
    );

    localStorage.setItem("transactions", JSON.stringify(transactions));

    return transactions;
  } else if (action.type === "ADD_TRANSACTION") {
    const transactions = [...state, action.payload];

    localStorage.setItem("transactions", JSON.stringify(transactions));

    return transactions;
  } else {
    return state;
  }
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, dispatch] = useReducer(reducer, initialState);

  const deleteTransaction = (id: number) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  };

  const addTransaction = (transaction: Transaction) => {
    dispatch({ type: "ADD_TRANSACTION", payload: transaction });
  };

  const balance = transactions.reduce(
    (acc: number, transaction: Transaction) => {
      return transaction.type === "Income"
        ? acc + transaction.amount
        : acc - transaction.amount;
    },
    0
  );

  return (
    <ExpenseTrackerContext.Provider
      value={{ transactions, deleteTransaction, addTransaction, balance }}
    >
      {children}
    </ExpenseTrackerContext.Provider>
  );
};
