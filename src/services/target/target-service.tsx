import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api as axios } from "../axios";
import { toast } from "react-hot-toast";

const path = "targets";
export const useGetTarget = () => {
  return useQuery({
    queryKey: [path],
    queryFn: async () => {
      const res = await axios.get(path);
      return res?.data?.target;
    },
  });
};

export const useUpdateTarget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (target: string) => {
      const res = await axios.put(path, { target: target });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [path] });
    },
    onError: (err: any) => {
      toast.error(err || "เกิดข้อผิดพลาดบางอย่าง");
    },
  });
};
