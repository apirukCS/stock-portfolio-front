import { createContext, useContext, useState, type ReactNode } from "react";
import type { StockTransaction } from "../services/stock-transaction/stock-transaction.model";

interface StockTransactionListContextType {
  stockTransactions: StockTransaction[];
  updateStockTransactions: (stockTransactions: StockTransaction[]) => void;
}

const StockTransactionListContext =
  createContext<StockTransactionListContextType | null>(null);

interface StockTransactionListProviderProps {
  children: ReactNode;
}

export const StockTransactionListProvider = ({
  children,
}: StockTransactionListProviderProps) => {
  const [stockTransactions, setStockTransactions] = useState<
    StockTransaction[]
  >([]);

  const updateStockTransactions = (stockTransactions: StockTransaction[]) => {
    setStockTransactions(stockTransactions);
  };
  return (
    <StockTransactionListContext.Provider
      value={{
        stockTransactions,
        updateStockTransactions,
      }}
    >
      {children}
    </StockTransactionListContext.Provider>
  );
};

export const useStockTransactionList = () => {
  const context = useContext(StockTransactionListContext);
  if (!context) {
    throw new Error(
      "useStockTransactionList must be used within StockTransactionListProvider",
    );
  }
  return context;
};
