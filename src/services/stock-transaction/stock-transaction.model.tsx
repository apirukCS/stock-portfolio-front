export interface CreateStockTransactionRequest {
  transaction_date: string | null;
  stock_id: number;
  transaction_type: "BUY" | "SELL";
  price: string;
  price_unit: string;
  vat?: string;
  vat_unit?: string;
  commission?: string;
  commission_unit?: string;
  exchange_rate?: string | null;
  reason?: string;
}

export interface StockTransactionDataTable {
  items: StockTransaction[];
  page: number;
  total_item: number;
  total_page: number;
}

export interface StockTransaction {
  id: number;
  stock_id: number;
  stock_name: string;
  transaction_date: string;
  transaction_type: "BUY" | "SELL";
  price: string;
  price_unit: string;
  vat: string;
  vat_unit: string;
  commission: string;
  commission_unit: string;
  exchange_rate?: string;
  reason?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StockTransactionSummary {
  total_buy: number;
  total_sell: number;
  total_vat: number;
  total_commission: number;
}
