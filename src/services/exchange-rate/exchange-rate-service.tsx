import { useQuery } from "@tanstack/react-query";
import type { BotExchangeRateResponse } from "./exchange-rate.model";
import { api as axios } from "../axios";

export const useGetExChangeRate = () => {
  const query = useQuery({
    queryKey: ["exchange-rate"],
    queryFn: async () => {
      const now = new Date();
      const pad = (num: number) => String(num).padStart(2, "0");
      const startStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate() - 3)}`;
      const endStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

      const res = await axios.get(
        `/exchange-rate?startPeriod=${startStr}&endPeriod=${endStr}`,
      );
      const data: BotExchangeRateResponse = res.data;
      const usdRates = data.result.data.data_detail.filter(
        (d) => d.currency_id === "USD",
      );
      usdRates.sort((a, b) => (b.period || "").localeCompare(a.period || ""));
      const latestUSD = usdRates.find((rate) => rate.mid_rate !== "");
      return latestUSD;
    },
  });
  return query;
};
