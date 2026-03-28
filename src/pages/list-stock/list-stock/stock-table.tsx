import './ui.scss';
import NumberFormat from "../../../components/nummeric-format";
import { useConfirmAlertDialog } from "../../../dialogs/confirm-alert-dialog";
import type {
  StockTransaction,
  StockTransactionDataTable,
} from "../../../services/stock-transaction/stock-transaction.model";
import { formatThaiDate } from "../../../utils/format";
import { CircleLoader } from "../../../components/circle-loading";
import { useStockFilters } from "../../../contexts/stock-filter-context";

const PencilIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

interface StockTableProps {
  onEdit: (stockTransaction: StockTransaction) => void;
  onDelete: (stockTransactionId: number) => void;
  source: StockTransactionDataTable | undefined;
  isLoadingSource?: boolean;
}

export default function StockTable(props: StockTableProps) {
  const { confirm, ConfirmAlertDialog } = useConfirmAlertDialog();
  const { filters } = useStockFilters();
  const handleDelete = async (id: number) => {
    const isConfirm = await confirm("ต้องการลบรายการนี้ ?");
    if (isConfirm) props.onDelete(id);
  };

  const columns = [
    "ลำดับ",
    "วันที่",
    "ชื่อหุ้น",
    "ประเภทรายการ",
    "จำนวนเงิน",
    "ภาษี",
    "คอมมิสชัน",
    "อัตราแลกเปลี่ยน",
    "เหตุผล",
    "Action",
  ];

  return (
    <div className="overflow-x-auto">
      <ConfirmAlertDialog />
      <div className="relative">
        <table className="w-full border-separate border-spacing-y-[8px] text-sm">
          <thead>
            <tr>
              <th colSpan={10}>
                <div className="bg-[#1E1E24] text-[#9B9BAF] text-center rounded-[3px] overflow-hidden px-2">
                  <div className="grid grid-cols-[50px_repeat(9,minmax(80px,1fr))] py-[8px] min-w-[1000px]">
                    {columns.map((h, i) => (
                      <div key={i} className="font-normal whitespace-nowrap">
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {(props.source?.items ?? []).map((row, i) => (
              <tr key={row.id}>
                <td colSpan={10}>
                  <div className="grid grid-cols-[50px_repeat(9,minmax(80px,1fr))] min-w-[1000px] text-center items-center bg-[#1E1E24] hover:bg-[#222] rounded-[7px] overflow-hidden px-2">
                    {/* ลำดับ */}
                    <div className="td-py text-[#aaa] text-center">
                      {filters.itemPerPage * (filters.page - 1) + (i + 1)}
                    </div>

                    {/* วันที่ */}
                    <div className="td-py text-[#aaa] text-center whitespace-nowrap">
                      {formatThaiDate(row.transaction_date)}
                    </div>

                    {/* ชื่อหุ้น */}
                    <div className="td-py px-4 text-white font-semibold text-center break-words whitespace-normal line-clamp-1">
                      {row.stock_name}
                    </div>

                    {/* ประเภทรายการ */}
                    <div className="td-py px-4 text-center">
                      <span
                        className={`inline-block px-5 py-1.5 rounded-full text-white font-medium text-sm
                    ${row.transaction_type === "SELL" ? "bg-[#22963E]" : "bg-[#8676FF]"}`}
                      >
                        {row.transaction_type === "SELL" ? "ขาย" : "ซื้อ"}
                      </span>
                    </div>

                    {/* จำนวนเงิน */}
                    <div className="td-py px-4 text-white font-semibold text-center">
                      <label className="pr-1">
                        {row.price_unit == "USD" ? "$" : "฿"}
                      </label>
                      <NumberFormat
                        value={Number(row.price)}
                        decimalScale={2}
                      />
                    </div>

                    {/* ภาษี */}
                    <div className="td-py px-4 text-[#aaa] text-center">
                      <label className="pr-1">
                        {row.vat_unit == "USD" ? "$" : "฿"}
                      </label>
                      <NumberFormat value={Number(row.vat)} />
                    </div>

                    {/* คอมมิสชัน */}
                    <div className="td-py px-4 text-[#aaa] text-center">
                      <label className="pr-1">
                        {row.commission_unit == "USD" ? "$" : "฿"}
                      </label>
                      <NumberFormat value={Number(row.commission)} />
                    </div>

                    {/* อัตราแลกเปลี่ยน */}
                    <div className="td-py px-4 text-[#ccc] text-center">
                      {row.exchange_rate ? (
                        <NumberFormat
                          value={Number(row.exchange_rate)}
                          decimalScale={2}
                        />
                      ) : (
                        ""
                      )}
                    </div>

                    {/* เหตุผล */}
                    <div className="px-4 text-[#aaa] text-center break-words line-clamp-1">
                      {row.reason}
                    </div>

                    {/* Action */}
                    <div className="td-py px-4 flex justify-center items-center gap-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-[#2a2a2a] text-blue-400 hover:bg-[#333] hover:text-blue-300 transition-colors"
                        onClick={() => props.onEdit(row)}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-[#2a2a2a] text-red-400 hover:bg-[#333] hover:text-red-300 transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {props.isLoadingSource &&(
          <div className="absolute top-9 inset-0 flex justify-center">
            <CircleLoader />
          </div>
        )}
      </div>

      {!(props.source?.items ?? []).length && !props.isLoadingSource && (
        <div className="text-center py-16 text-[#555]">ไม่มีข้อมูล</div>
      )}
    </div>
  );
}
