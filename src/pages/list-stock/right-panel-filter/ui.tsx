import { CheckboxGroup } from "../../../components/check-box-group";
import DateRangePicker from "../../../components/date-range-picker";
import Dropdown, { type Option } from "../../../components/dropdown";
import { RadioGroup } from "../../../components/radio-group";
import filterIcon from "../../../assets/svg/filter-icon.svg";
import emailIcon from "../../../assets/svg/email-icon.svg";
import {
  useGetStocks,
  useUpdateStock,
} from "../../../services/stock/stock-service";
import { useState } from "react";
import { useStockFilters } from "../../../contexts/stock-filter-context";

const RightPanelFilter = () => {
  const { updateFilter } = useStockFilters();
  const updateStock = useUpdateStock();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: stockOptions = [] } = useGetStocks();

  const Header = () => {
    return (
      <div className="flex justify-between p-5">
        <img src={filterIcon} alt="filter-icon.svg" />
        <label className="font-semibold text-sm text-color-[#9B9BAF]">
          ตัวกรองรายการหุ้น
        </label>
      </div>
    );
  };

  const onChangeStock = (option: Option | null) => {
    setSelectedId(option?.id ?? null);
    updateFilter({ stockId: option?.id, page: 1, itemPerPage: 25 });
  };

  const onChangeDateRange = (start: string | null, end: string | null) => {
    updateFilter({ startDate: start, endDate: end, page: 1, itemPerPage: 25 });
  };

  const onChangeTransactionTypes = (ids: number[]) => {
    let transactionTypes: string[] = [];
    ids.forEach((id) => transactionTypes.push(id === 1 ? "BUY" : "SELL"));
    updateFilter({
      transactionTypes: transactionTypes,
      page: 1,
      itemPerPage: 25,
    });
  };

  const onChangeSummaryDisplay = (isDisplaySummaryAll: boolean) => {
    updateFilter({ isDisplaySummaryAll: isDisplaySummaryAll });
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col">
        <Header />
        <hr className="border-[#22262B]" />
        <div className="flex flex-col p-4 gap-5">
          <Dropdown
            label="ชื่อหุ้น"
            placeholder="ทั้งหมด"
            selectedId={selectedId}
            options={stockOptions}
            allowUpdateOption={true}
            onChange={(option) => onChangeStock(option)}
            onEditOptionConfirm={(option) =>
              updateStock.mutate({ id: option.id, name: option.name })
            }
          />
          <DateRangePicker
            onChange={({ start, end }) => onChangeDateRange(start, end)}
          />
          <CheckboxGroup
            label="ประเภทรายการ"
            options={[
              { id: 1, value: "ซื้อ" },
              { id: 2, value: "ขาย" },
            ]}
            onChange={(ids) => onChangeTransactionTypes(ids)}
            selectedIds={[1, 2]}
          />

          <RadioGroup
            label="การแสดงผลรวม"
            options={[
              { id: 1, value: "แสดงตามข้อมูลทั้งหมด" },
              { id: 2, value: "แสดงตามรายการในตาราง" },
            ]}
            onChange={(e) => onChangeSummaryDisplay(e === 1 ? true : false)}
          />
        </div>
      </div>
      <div className="py-4">
        <div className="flex items-center">
          {/* เส้นซ้าย */}
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

          {/* ข้อความตรงกลาง */}
          <span className="px-6 text-sm font-medium text-gray-400 mx-4 flex-shrink-0">
            หากพบปัญหาการใช้งาน
          </span>

          {/* เส้นขวา */}
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>

        {/* Email Support */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">ติดต่อทีมสนับสนุน</p>
          <a
            href="mailto:apirukcs@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2 hover:bg-blue-700 text-white text-sm rounded-lg transition-all duration-200 border border-gray-800 hover:border-blue-400"
          >
            <span className="mt-[2px]">
              <img src={emailIcon} alt="email" width={20} />
            </span>{" "}
            apirukcs@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default RightPanelFilter;
