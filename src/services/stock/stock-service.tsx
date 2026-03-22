import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api as axios } from "../axios";
import { toast } from "react-hot-toast";
import type { Stock } from "./stock.model";
import { useStockContext } from "../../contexts/stock-context";
import { useEffect } from "react";

export const useGetStocks = () => {
  const stockContext = useStockContext();
  const query = useQuery({
    queryKey: ["stocks"],
    queryFn: async () => {
      const res = await axios.get("/stocks");
      return res.data as Stock[];
    },
  });

  useEffect(() => {
    stockContext.updateStocks(query.data || []);
  }, [query.data, stockContext]);

  return query;
};

export const useCreateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await axios.post("/stocks", { name });
      return res.data;
    },
    onSuccess: () => {
      toast.success("เพิ่มชื่อหุ้นสำเร็จ", {
        duration: 3000,
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
    onError: (err: any) => {
      toast.error(err || "เกิดข้อผิดพลาดบางอย่าง");
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: number; name: string }) => {
      const res = await axios.put(`/stocks/${data.id}`, { name: data.name });
      return res.data;
    },
    onSuccess: () => {
      toast.success("แก้ไขชื่อหุ้นสำเร็จ", {
        duration: 3000,
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      //มันไม่เคลียร์ stock-transactions
      queryClient.invalidateQueries({ queryKey: ["stock-transactions"] });
      queryClient.refetchQueries({ queryKey: ["/stock-transactions"] });
    },
    onError: (err: any) => {
      toast.error(err || "เกิดข้อผิดพลาดบางอย่าง");
    },
  });
};
