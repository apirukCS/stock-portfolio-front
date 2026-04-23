import styled from "@emotion/styled";
import NumberFormat from "../../../components/nummeric-format";
import summaryBuyIcon from "../../../assets/svg/summary-buy-icon.svg";
import summarySaleIcon from "../../../assets/svg/summary-sale-icon.svg";
import vatIcon from "../../../assets/svg/vat-icon.svg";
import commissionIcon from "../../../assets/svg/commission-icon.svg";
import { useGetSummaryStockTransactions } from "../../../services/stock-transaction/stock-transaction-service";
import { useStockFilters } from "../../../contexts/stock-filter-context";
import { useEffect, useState } from "react";
import type {
  StockTransaction,
  StockTransactionSummary,
} from "../../../services/stock-transaction/stock-transaction.model";
import { useStockTransactionList } from "../../../contexts/stock-transaction-list-of-table";

export const SummaryCard = () => {
  let [stockTransactionSummary, setStockTransactionSummary] = useState<
    StockTransactionSummary | undefined
  >();

  const { filters } = useStockFilters();
  const { stockTransactions } = useStockTransactionList();
  const { data: stockSummaryTransaction } = useGetSummaryStockTransactions();

  useEffect(() => {
    const summary = filters.isDisplaySummaryAll || filters.isDisplaySummaryAll == null
      ? stockSummaryTransaction
      : calSummary(stockTransactions);
    setStockTransactionSummary(summary);
  }, [filters, stockTransactions, stockSummaryTransaction, filters.isDisplaySummaryAll]);

  const cards: {
    key: "total_buy" | "total_sell" | "total_vat" | "total_commission";
    name: string;
    bgIcon: string;
    path: string;
  }[] = [
    {
      key: "total_buy",
      name: "จำนวนการซื้อรวม",
      bgIcon: "#8676FF",
      path: summaryBuyIcon,
    },
    {
      key: "total_sell",
      name: "จำนวนการขายรวม",
      bgIcon: "#22963E",
      path: summarySaleIcon,
    },
    {
      key: "total_vat",
      name: "ภาษีรวม",
      bgIcon: "#FD4438",
      path: vatIcon,
    },
    {
      key: "total_commission",
      name: "คอมมิชชันรวม",
      bgIcon: "#FF7A2F",
      path: commissionIcon,
    },
  ];

  const Icon = styled.div(({ bgColor }: { bgColor: string }) => ({
    width: "40px",
    height: "40px",
    display: "flex",
    padding: "6px",
    borderRadius: "8px",
    backgroundColor: bgColor,
  }));

  const NumberOfSummary = ({ value }: { value: number }) => {
    return (
      <label className="flex text-white text-2xl font-bold gap-2">
        <NumberFormat value={value} decimalScale={2} fixedDecimalScale={true} />
        บาท
      </label>
    );
  };
  return (
    <div className="h-[96px] flex flex-none overflow-x-auto justify-between gap-10">
      {cards.map((card, i) => {
        const summary = stockTransactionSummary
          ? stockTransactionSummary[`${card.key}`]
          : 0;
        return (
          <div
            key={i}
            className="flex flex-1 bg-[#0F0F13] items-center justify-center rounded-[12px] gap-4 px-6"
          >
            <Icon bgColor={card.bgIcon}>
              <img src={card.path} alt="React Logo" />
            </Icon>
            <div className="flex flex-col">
              <label className="text-color-[#9B9BAF] text-sm whitespace-nowrap">
                {card.name}
              </label>
              <NumberOfSummary value={summary} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const calSummary = (
  transactions: StockTransaction[],
): StockTransactionSummary => {
  return transactions.reduce(
    (acc, tx) => {
      const EXCHANGE_RATE = Number(tx.exchange_rate ?? 1);

      const amountThb =
        tx.price_unit === "USD" ? Number(tx.price) * EXCHANGE_RATE : tx.price;

      const vatThb =
        tx.vat != null
          ? tx.vat_unit === "USD"
            ? Number(tx.vat) * EXCHANGE_RATE
            : tx.vat
          : 0;

      const commissionThb =
        tx.commission != null
          ? tx.commission_unit === "USD"
            ? Number(tx.commission) * EXCHANGE_RATE
            : tx.commission
          : 0;

      // BUY / SELL
      if (tx.transaction_type === "BUY") {
        acc.total_buy += Number(amountThb);
      } else if (tx.transaction_type === "SELL") {
        acc.total_sell += Number(amountThb);
      }

      // VAT
      acc.total_vat += Number(vatThb);

      // Commission
      acc.total_commission += Number(commissionThb);

      return acc;
    },
    {
      total_buy: 0,
      total_sell: 0,
      total_vat: 0,
      total_commission: 0,
    },
  );
};
