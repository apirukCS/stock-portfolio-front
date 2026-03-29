import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api as axios } from "../axios";
import { toast } from "react-hot-toast";
import type {
  CreateStockTransactionRequest,
  StockTransactionDataTable,
  StockTransactionSummary,
} from "./stock-transaction.model";
import { EXCHANGE_RATE } from "../../utils/const/local-storage-const";

const path = "/stock-transactions";

export const useGetStockTransactions = (
  page: number,
  size: number,
  stockId: number | null,
  startDate: string | null,
  endDate: string | null,
  transactionTypes: string[],
) => {
  return useQuery({
    placeholderData: (previousData) => previousData,
    queryKey: [
      path,
      page,
      size,
      stockId,
      startDate,
      endDate,
      transactionTypes.join(","),
    ],
    queryFn: async () => {
      let params = `?page=${page}&size=${size}`;
      if (stockId) {
        params = params + `&stockId=${stockId}`;
      }
      if (startDate) {
        params = params + `&startDate=${startDate}`;
      }
      if (endDate) {
        params = params + `&endDate=${endDate}`;
      }
      if (transactionTypes.length) {
        params = params + `&transactionTypes=${transactionTypes}`;
      }
      const res = await axios.get(path + params);
      return res.data as StockTransactionDataTable;
    },
  });
};

export const useGetSummaryStockTransactions = () => {
  return useQuery({
    queryKey: [path, "summary"],
    queryFn: async () => {
      const res = await axios.get(`${path}/summary`);
      return res.data as StockTransactionSummary;
    },
  });
};

export const useCreateStockTransaction = (resetPagination?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateStockTransactionRequest) => {
      const res = await axios.post(path, payload);
      localStorage.setItem(EXCHANGE_RATE, payload.exchange_rate ?? "");
      return res.data;
    },
    onSuccess: () => {
      resetPagination?.();
      toast.success("เพิ่มรายการหุ้นสำเร็จ", {
        duration: 3000,
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: [path] });
    },
    onError: (err: any) => {
      toast.error(err || "เกิดข้อผิดพลาดบางอย่าง");
    },
  });
};

export const useEditStockTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      payload: CreateStockTransactionRequest;
      id: number | null;
    }) => {
      const res = await axios.put(`${path}/${data.id}`, data.payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("แก้ไขรายการหุ้นสำเร็จ", {
        duration: 3000,
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: [path] });
    },
    onError: (err: any) => {
      toast.error(err || "เกิดข้อผิดพลาดบางอย่าง");
    },
  });
};

export const useDeleteStockTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${path}/${id}`);
    },
    onSuccess: () => {
      toast.success("ลบรายการหุ้นสำเร็จ", {
        duration: 3000,
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: [path] });
    },
    onError: (err: any) => {
      toast.error(err || "เกิดข้อผิดพลาดบางอย่าง");
    },
  });
};

//------------------  mock --------------//
// export const mockTransaction = (): CreateStockTransactionRequest => {
//   return {
//     stock_id: Math.random() < 0.3 ? 36 : Math.random() < 0.8 ? 37 : 38,
//     price: `${Math.random() * 1000}`,
//     price_unit: Math.random() > 0.5 ? "บาท" : "USD",
//     vat: `${Math.random() * 10}`,
//     vat_unit: Math.random() > 0.5 ? "บาท" : "USD",
//     commission: `${Math.random() * 5}`,
//     commission_unit: Math.random() > 0.5 ? "บาท" : "USD",
//     exchange_rate: `${32 + Math.random()}`,
//     transaction_type: Math.random() > 0.5 ? "BUY" : "SELL",
//   };
// };
