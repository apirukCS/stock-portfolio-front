import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import calendarIcon from "../assets/svg/calendar-icon.svg";

dayjs.locale("th");

interface DatePickerProps {
  value: string | null | undefined;
  onChange?: (date: string | null) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const defaultDate = value ? dayjs(value) : null;

  const [selected, setSelected] = useState<dayjs.Dayjs | null>(defaultDate);
  const [viewMonth, setViewMonth] = useState(dayjs());

  const daysInMonth = viewMonth.daysInMonth();
  const startOfMonth = viewMonth.startOf("month").day();

  // ปิดเมื่อคลิกนอก
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // ✅ เลือกวันเดียว
  const handleSelect = (date: dayjs.Dayjs) => {
    setSelected(date);

    const finalDate = date.format("YYYY-MM-DD");
    onChange?.(finalDate);

    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-xs">
      <label className="text-[#9B9BAF] text-sm">วันที่</label>

      <button
        onClick={() => setOpen(!open)}
        className={`w-full px-4 text-sm py-2 rounded-[8px] border border-[#1E1E24] flex justify-between items-center ${
          selected ? "text-white" : "text-gray-700"
        }`}
      >
        {selected ? selected.format("DD MMM YYYY") : "ทั้งหมด"}

        <div className="flex gap-1">
          {/* {selected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
              className="cursor-pointer p-1 hover:bg-neutral-800 rounded"
            >
              ✕
            </button>
          )} */}

          <img src={calendarIcon} alt="calendar" />
        </div>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute mt-2 w-full bg-neutral-900 border border-neutral-700 shadow-xl rounded-lg p-4 z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3 text-white">
            <button
              onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
            >
              ◀
            </button>

            <div className="font-semibold">{viewMonth.format("MMMM YYYY")}</div>

            <button onClick={() => setViewMonth(viewMonth.add(1, "month"))}>
              ▶
            </button>
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
          <div className="grid grid-cols-7 text-center gap-1">
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
                    onClick={() => handleSelect(date)}
                    className={`
                    py-1 w-8 rounded-lg text-sm
                    ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-neutral-700"
                    }
                  `}
                  >
                    {i + 1}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
