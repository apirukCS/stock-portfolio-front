import { useState, type CSSProperties } from "react";
import Dropdown from "../components/dropdown";
import { Input } from "../components/input";
import { Textarea } from "../components/text-area";
import AppButton from "../components/button";
import {
  useCreateStock,
  useGetStocks,
  useUpdateStock,
} from "../services/stock/stock-service";
import {
  useCreateStockTransaction,
  useEditStockTransaction,
} from "../services/stock-transaction/stock-transaction-service";
import type {
  CreateStockTransactionRequest,
  StockTransaction,
} from "../services/stock-transaction/stock-transaction.model";
import { useStockFilters } from "../contexts/stock-filter-context";
import DateTimePicker from "../components/date-time-picker";
import dayjs from "dayjs";
import { EXCHANGE_RATE } from "../utils/const/local-storage-const";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  mode: "edit" | "create";
  stockTransaction: StockTransaction | null;
};

export default function StockFormModal({
  open,
  onClose,
  mode,
  stockTransaction,
}: ModalProps) {
  if (!open) return null;

  const isCreate = mode == "create";

  const [errors, setErrors] = useState({
    stockId: false,
    typeId: false,
    price: false,
    vat: false,
    commission: false,
    exchangeRate: false,
  });

  //api
  const { data: stockOptions = [] } = useGetStocks();
  const { resetPagination } = useStockFilters();
  const createStockTransaction = useCreateStockTransaction(resetPagination);
  const editStockTransaction = useEditStockTransaction();
  const createStock = useCreateStock();
  const updateStock = useUpdateStock();

  //state in page
  const now = dayjs().format("YYYY-MM-DDTHH:mm:ss");
  const [date, setDate] = useState<string | null>(
    isCreate ? now : (stockTransaction?.transaction_date ?? now),
  );
  const [stockId, setStockId] = useState<number | null | undefined>(
    stockTransaction?.stock_id,
  );
  const [typeId, setTypeId] = useState<number | null>(
    stockTransaction?.transaction_type
      ? stockTransaction?.transaction_type == "BUY"
        ? 1
        : 2
      : null,
  );

  const [price, setPrice] = useState(stockTransaction?.price ?? "");
  const [currencyPrice, setCurrencyPrice] = useState<"บาท" | "USD">(
    (stockTransaction?.price_unit as "บาท" | "USD") ?? "บาท",
  );
  const [currencyVat, setCurrencyVat] = useState<"บาท" | "USD">(
    (stockTransaction?.vat_unit as "บาท" | "USD") ?? "USD",
  );
  const [currencyCommission, setCurrencyCommission] = useState<"บาท" | "USD">(
    (stockTransaction?.commission_unit as "บาท" | "USD") ?? "USD",
  );
  const [exchangeRate, setExchangeRate] = useState(
    isCreate
      ? localStorage.getItem(EXCHANGE_RATE)
      : stockTransaction?.exchange_rate,
  );
  const [vat, setVat] = useState(stockTransaction?.vat);
  const [commission, setCommission] = useState(stockTransaction?.commission);
  const [reason, setReason] = useState(stockTransaction?.reason);

  const transactionTypeOptions = [
    { id: 1, name: "ซื้อ" },
    { id: 2, name: "ขาย" },
  ];

  //fn
  const handleSubmit = () => {
    const newErrors = {
      stockId: !stockId,
      typeId: !typeId,
      price: !price && price != "0",
      vat: !vat && vat != "0",
      commission: !commission && commission != "0",
      exchangeRate:
        [currencyPrice, currencyVat, currencyCommission].includes("USD") &&
        !exchangeRate,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      setTimeout(() => setErrors({} as typeof newErrors), 2000);
      return;
    }

    const exchange = [currencyPrice, currencyVat, currencyCommission].includes(
      "USD",
    )
      ? exchangeRate
      : null;
    const payload: CreateStockTransactionRequest = {
      stock_id: stockId!,
      transaction_type: typeId === 1 ? "BUY" : "SELL",
      price: price,
      price_unit: currencyPrice,
      vat: vat,
      vat_unit: currencyVat,
      commission: commission,
      commission_unit: currencyCommission,
      exchange_rate: exchange,
      reason: reason,
      transaction_date: date,
    };

    if (isCreate) {
      createStockTransaction.mutate(payload, { onSuccess: onCloseModal });
    } else {
      editStockTransaction.mutate(
        { payload, id: stockTransaction?.id ?? null },
        { onSuccess: onCloseModal },
      );
    }
  };

  const handleCreateStock = (name: string) => {
    createStock.mutate(name);
  };

  const onCloseModal = () => {
    setDate("");
    setStockId(null);
    setTypeId(null);
    setPrice("");
    setExchangeRate("");
    setVat("");
    setCommission("");
    setReason("");
    setErrors({} as typeof errors);

    onClose();
  };

  return (
    <div style={overlayStyle} onClick={onCloseModal}>
      <div
        className="
    flex flex-col gap-2 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl
    max-h-[calc(100vh-80px)] overflow-y-auto
  "
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1E1E24] pb-3">
          <h2 className="text-gray-200 text-lg font-semibold">
            {isCreate ? "เพิ่มรายการหุ้น" : "แก้ไขรายการหุ้น"}
          </h2>

          <button
            onClick={onCloseModal}
            className="text-gray-400 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <DateTimePicker value={date} onChange={(e) => setDate(e)} />

        <Dropdown
          required
          label="ชื่อหุ้น"
          options={stockOptions}
          selectedId={stockId}
          allowCreate={true}
          allowUpdateOption={true}
          onChange={(option) => setStockId(option?.id)}
          onCreateConfirm={(e) => handleCreateStock(e)}
          isError={errors.stockId}
          isLoadingCreating={updateStock.isPending || createStock.isPending}
          onEditOptionConfirm={(option) =>
            updateStock.mutate({ id: option.id, name: option.name })
          }
        />

        <Dropdown
          required
          label="ประเภทรายการ"
          options={transactionTypeOptions}
          selectedId={typeId}
          onChange={(option) => setTypeId(option?.id ?? null)}
          isError={errors.typeId}
        />

        <div className="flex gap-2">
          <Input
            required
            label={`จำนวนเงิน (${currencyPrice})`}
            placeholder="จำนวนเงิน"
            value={price}
            onChange={(e) => setPrice(e)}
            isError={errors.price}
          />

          <div className="flex">
            <CurrencySwitch value={currencyPrice} onChange={setCurrencyPrice} />
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            required
            label={`ภาษี (${currencyVat})`}
            placeholder="ภาษี"
            value={vat ?? ""}
            onChange={(e) => setVat(e)}
            isError={errors.vat}
          />

          <div className="flex">
            <CurrencySwitch value={currencyVat} onChange={setCurrencyVat} />
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            required
            label={`ค่าคอมมิสชัน (${currencyCommission})`}
            placeholder="ค่าคอมมิสชัน"
            value={commission ?? ""}
            onChange={(e) => setCommission(e)}
            isError={errors.commission}
          />
          <div className="flex">
            <CurrencySwitch
              value={currencyCommission}
              onChange={setCurrencyCommission}
            />
          </div>
        </div>

        {[currencyPrice, currencyVat, currencyCommission].includes("USD") && (
          <Input
            required
            label="อัตราแลกเปลี่ยนบาทต่อ 1 USD"
            tooltipText="อัตราแลกเปลี่ยนที่ใช้แปลงมูลค่าจาก USD เป็นบาท (THB)"
            placeholder="อัตราแลกเปลี่ยน"
            value={exchangeRate ?? ""}
            onChange={(e) => setExchangeRate(e)}
            isError={errors.exchangeRate}
          />
        )}

        <Textarea
          label="เหตุผล"
          value={reason}
          onChange={(e) => setReason(e)}
          placeholder="เหตุผล"
        />

        <div className="h-[40px]">
          <AppButton
            className="mt-4"
            onClick={handleSubmit}
            isLoading={
              createStockTransaction.isPending || editStockTransaction.isPending
            }
          >
            <div className="fw-semibold text-white">บันทึก</div>
          </AppButton>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center", // ✅ กลางจอเหมือนเดิม
  justifyContent: "center",
  zIndex: "999",
  padding: "20px",
  // overflowY: 'auto',
};
const modalStyle: CSSProperties = {
  padding: "30px",
  borderRadius: "10px",
  borderColor: "#1E1E24",
  borderWidth: "1.3px",
  backgroundColor: "#0F0F13",
  boxShadow: "0 10px 40px rgba(0,0,0,0.6), 30px rgba(255,255,255,0.06)",

  // ทำให้ modal ตัวนี้ scroll ได้เองเมื่อเนื้อหาล้น
  maxHeight: "calc(100vh - 80px)", // หัก top / bottom ด้านนอก
  overflowY: "auto",
};

type CurrencySwitchProps = {
  value: "บาท" | "USD";
  onChange: (v: "บาท" | "USD") => void;
};

const CurrencySwitch = ({ value, onChange }: CurrencySwitchProps) => {
  return (
    <div className="flex self-end mb-1 overflow-hidden rounded-lg border border-[#1E1E24] text-sm">
      <button
        onClick={() => onChange("บาท")}
        className={`px-3 py-2 transition ${
          value === "บาท" ? "bg-white text-black" : "text-gray-300"
        }`}
      >
        บาท
      </button>

      <div className="w-px bg-gray-300"></div>

      <button
        onClick={() => onChange("USD")}
        className={`px-3 py-2 transition ${
          value === "USD" ? "bg-white text-black" : "text-gray-300"
        }`}
      >
        USD
      </button>
    </div>
  );
};
