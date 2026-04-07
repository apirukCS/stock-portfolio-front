// types/exchangeRate.ts
export interface BotExchangeRateResponse {
  result: {
    timestamp: string;
    api: string;
    data: {
      data_header: {
        report_name_eng: string;
        report_name_th: string;
        report_uoq_name_eng: string;
        report_uoq_name_th: string;
        report_source_of_data: SourceOfData[];
        report_remark: Remark[];
        last_updated: string; // "2026-04-03"
      };
      data_detail: CurrencyRate[];
    };
  };
}

export interface SourceOfData {
  source_of_data_eng: string;
  source_of_data_th: string;
}

export interface Remark {
  report_remark_eng: string;
  report_remark_th: string;
}

export interface CurrencyRate {
  period: string;
  currency_id: string; // "USD", "GBP", "EUR"...
  currency_name_th: string; // "สหรัฐอเมริกา : ดอลลาร์ (USD)"
  currency_name_eng: string; // "USA : DOLLAR (USD)"
  buying_sight: string; // ""
  buying_transfer: string; // ""
  selling: string; // ""
  mid_rate: string; // ""
}

// สำหรับใช้งานง่าย ๆ ใน component
export interface ExchangeRateSummary {
  currency: string;
  thbPerUnit: string;
  lastUpdated: string;
  isUSD: boolean;
}
