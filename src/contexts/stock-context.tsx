import { createContext, useContext, useState, type ReactNode } from "react";
import type { Stock } from "../services/stock/stock.model";

interface StockContextType {
  stocks: Stock[];
  updateStocks: (stocks: Stock[]) => void;
}

const StockContext = createContext<StockContextType | null>(null);

interface StockProviderProps {
  children: ReactNode;
}

export const StockProvider = ({ children }: StockProviderProps) => {
  const [stocks, setStocks] = useState<Stock[]>([]);

  const updateStocks = (stocks: Stock[]) => {
    setStocks(stocks);
  };
  return (
    <StockContext.Provider
      value={{
        stocks,
        updateStocks,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStockContext = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStock must be used within StockProvider");
  }
  return context;
};
