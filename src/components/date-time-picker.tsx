import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import calendarIcon from "../assets/svg/calendar-icon.svg";
import Dropdown from "./dropdown";

dayjs.locale("th");

interface DateTimePickerProps {
  value: string | null | undefined;
  onChange?: (datetime: string | null) => void;
}

export default function DateTimePicker({
  value,
  onChange,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const defaultDate = value ? dayjs(value) : null;

  const [selected, setSelected] = useState<dayjs.Dayjs | null>(defaultDate);

  const [time, setTime] = useState(
    defaultDate ? defaultDate.format("HH:mm") : dayjs().format("HH:mm"),
  );

  const [viewMonth, setViewMonth] = useState(defaultDate || dayjs());

  const daysInMonth = viewMonth.daysInMonth();
  const startOfMonth = viewMonth.startOf("month").day();

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const currentYear = dayjs().year();

  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (date: dayjs.Dayjs, timeSelected: string) => {
    setSelected(date);

    const [hour, minute] = timeSelected.split(":");

    const finalDateTime = date
      .hour(Number(hour))
      .minute(Number(minute))
      .second(0)
      .format("YYYY-MM-DDTHH:mm:ss");

    onChange?.(finalDateTime);
  };

  const handleTimeSelect = (value: string) => {
    setTime(value);

    if (selected) {
      handleSelect(selected, value);
    }
  };

  const handleMonthChange = (monthIndex: number) => {
    setViewMonth(viewMonth.month(monthIndex));
  };

  const handleYearChange = (year: number) => {
    setViewMonth(viewMonth.year(year));
  };

  const confirm = () => {
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <label className="text-[#9B9BAF]">วันที่และเวลา</label>

      <button
        onClick={() => {
          if (!open) {
            setViewMonth(selected || dayjs());
          }
          setOpen(!open);
        }}
        className={`w-full px-4 py-2 rounded-[8px] border border-[#1E1E24] flex justify-between items-center ${
          selected ? "text-white" : "text-gray-700"
        }`}
      >
        {selected
          ? `${selected.format("DD MMM")} ${selected.year() + 543} ${time}`
          : "เลือกวันที่และเวลา"}

        <img src={calendarIcon} alt="calendar" />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute mt-2 w-full bg-neutral-900 border border-neutral-700 shadow-xl rounded-lg p-4 z-50"
        >
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Dropdown
              selectedId={viewMonth.month()}
              options={thaiMonths.map((month, index) => ({
                id: index,
                name: month,
              }))}
              placeholder="เลือกเดือน"
              py="py-2"
              canCancelOption={false}
              onChange={(e) => {
                if (!e) return;
                handleMonthChange(e.id);
              }}
            />

            <Dropdown
              selectedId={viewMonth.year()}
              options={years.map((year) => ({
                id: year,
                name: String(year + 543),
              }))}
              placeholder="เลือกปี"
              py="py-2"
              canCancelOption={false}
              onChange={(e) => {
                if (!e) return;
                handleYearChange(e.id);
              }}
            />
          </div>

          {/* Week */}
          <div className="grid grid-cols-7 text-center text-gray-400 text-sm mb-2">
            <div>อา</div>
            <div>จ</div>
            <div>อ</div>
            <div>พ</div>
            <div>พฤ</div>
            <div>ศ</div>
            <div>ส</div>
          </div>

          {/* Calendar */}
          <div className="grid grid-cols-7 justify-items-center gap-1">
            {Array(startOfMonth)
              .fill(null)
              .map((_, i) => (
                <div key={i}></div>
              ))}

            {Array(daysInMonth)
              .fill(null)
              .map((_, i) => {
                const date = viewMonth.date(i + 1);
                const isSelected = selected?.isSame(date, "day");

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(date, time)}
                    className={`py-1 w-8 rounded-lg text-sm ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-neutral-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
          </div>

          {/* เวลา */}
          <div className="mt-4">
            <label className="text-sm text-gray-400">เวลา</label>
            <input
              type="time"
              value={time}
              onChange={(e) => handleTimeSelect(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700"
            />
          </div>

          {/* Footer */}
          <div className="mt-4">
            <button
              onClick={confirm}
              className="w-full px-4 py-2 bg-[#7949FF] text-white rounded-lg"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
