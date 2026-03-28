import { useState } from "react";
import { ListStock } from "./list-stock/ui";
import RightPanelFilter from "./right-panel-filter/ui";
import { SummaryCard } from "./summary-card/ui";
import filterIcon from "../../assets/svg/filter-icon.svg";
import { FilterProvider } from "../../contexts/stock-filter-context";
import { StockTransactionListProvider } from "../../contexts/stock-transaction-list-of-table";

const ListStockPage = () => {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <FilterProvider>
      <div className="flex h-full gap-5">
        <div className="flex-1 flex flex-col overflow-hidden gap-3 min-h-0">
          <StockTransactionListProvider>
            <SummaryCard />
            <ListStock />
          </StockTransactionListProvider>
        </div>
        <div className="hidden md:block w-[300px] flex-none bg-[#0F0F13] rounded-[12px]">
          {/* ฉันต้องการปุ่มหุบ panel filter */}
          <RightPanelFilter />
        </div>
      </div>

      <button
        onClick={() => setOpenFilter(!openFilter)}
        className="md:hidden fixed bottom-20 z-50 right-6 w-[50px] h-[50px] rounded-full bg-[#7949FF] text-white shadow-lg flex items-center justify-center text-xl"
      >
        <img src={filterIcon} alt="filter-icon.svg" />
      </button>

      {openFilter && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenFilter(false)}
          />
          <div className="ml-auto w-[300px] h-full bg-[#0F0F13] p-4 relative">
            <RightPanelFilter />
          </div>
        </div>
      )}
    </FilterProvider>
  );
};

export default ListStockPage;
