import { useEffect, useState } from "react";
import Button from "../../../components/button";
import Pagination from "../../../components/pagination";
import StockTable from "./stock-table";
import StockFormModal from "../../../modals/stock-form-modal";
import {
  useDeleteStockTransaction,
  useGetStockTransactions,
} from "../../../services/stock-transaction/stock-transaction-service";
import type { StockTransaction } from "../../../services/stock-transaction/stock-transaction.model";
import { useStockFilters } from "../../../contexts/stock-filter-context";
import { useStockTransactionList } from "../../../contexts/stock-transaction-list-of-table";

export const ListStock = () => {
  //state in page
  const [open, setOpen] = useState(false);
  const [stockTransactionEditing, setStockTransactionEditing] =
    useState<StockTransaction | null>(null);

  const [mode, setMode] = useState<"edit" | "create">("create");
  // const [page, setPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(25);
  const { filters, updateFilter, resetPagination } = useStockFilters();
  const { updateStockTransactions } = useStockTransactionList();

  //query
  const { data: stockTransaction, isFetching } = useGetStockTransactions(
    filters.page,
    filters.itemPerPage,
    filters.stockId ?? null,
    filters.startDate ?? null,
    filters.endDate ?? null,
    filters.transactionTypes ?? [],
  );
  const deleteStockTransaction = useDeleteStockTransaction();

  useEffect(() => {
    updateStockTransactions(stockTransaction?.items ?? []);
  }, [stockTransaction]);

  const AddButton = () => {
    return (
      <div>
        <Button
          onClick={() => {
            (setMode("create"), setOpen(true));
          }}
        >
          <label className="text-white hover:cursor-pointer">เพิ่มรายการหุ้น</label>
        </Button>
      </div>
    );
  };
  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-none flex justify-between items-center mb-1 mt-2">
        <label className="text-xl font-semibold text-white">รายการหุ้น</label>
        <AddButton />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <StockTable
          source={stockTransaction}
          isLoadingSource={isFetching}
          onEdit={(stockTransaction) => {
            (setMode("edit"),
              setOpen(true),
              setStockTransactionEditing(stockTransaction));
          }}
          onDelete={(stockTransactionId) =>
            deleteStockTransaction.mutate(stockTransactionId)
          }
        />
      </div>
      <div className="flex h-[50px] pt-1">
        <Pagination
          page={stockTransaction?.page}
          totalPage={stockTransaction?.total_page}
          onChange={({ page, itemsPerPage }) =>
            updateFilter({ page: page, itemPerPage: itemsPerPage })
          }
        />
      </div>
      <StockFormModal
        mode={mode}
        open={open}
        onClose={() => setOpen(false)}
        stockTransaction={mode == "edit" ? stockTransactionEditing : null}
      />
    </div>
  );
};
