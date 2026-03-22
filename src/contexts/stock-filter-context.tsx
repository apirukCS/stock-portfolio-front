// src/contexts/StockFilterContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

interface Filters {
  stockId?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  transactionTypes?: string[];
  isDisplaySummaryAll?: boolean;
  itemPerPage: number;
  page: number;
}

interface FilterContextType {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  updateFilter: (updates: Partial<Filters>) => void;
  resetFilters: () => void;
  resetPagination: () => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Filters>({
    stockId: null,
    startDate: null,
    endDate: null,
    transactionTypes: [],
    isDisplaySummaryAll: true,
    itemPerPage: 25,
    page: 1,
  });

  const updateFilter = (updates: Partial<Filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const resetFilters = () => {
    setFilters({
      stockId: null,
      startDate: null,
      endDate: null,
      transactionTypes: [],
      isDisplaySummaryAll: true,
      itemPerPage: 25,
      page: 1,
    });
  };

  const resetPagination = () => {
    setFilters({
      itemPerPage: 25,
      page: 1,
    });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        resetPagination,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useStockFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useStockFilters must be used within FilterProvider");
  }
  return context;
};
