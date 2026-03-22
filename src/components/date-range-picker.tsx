import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import calendarIcon from "../assets/svg/calendar-icon.svg";

dayjs.locale("th");

interface DateRangePickerProps {
  onChange?: (range: { start: string | null; end: string | null }) => void;
}

export default function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Local state (Dayjs)
  const [start, setStart] = useState<dayjs.Dayjs | null>(null);
  const [end, setEnd] = useState<dayjs.Dayjs | null>(null);
  const [viewMonth, setViewMonth] = useState(dayjs());

  dayjs.locale("th");

  const daysInMonth = viewMonth.daysInMonth();
  const startOfMonth = viewMonth.startOf("month").day();

  // 🔥 Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // 🟦 Select date range
  const handleSelect = (date: dayjs.Dayjs) => {
    if (!start) {
      setStart(date);
      return;
    }
    if (start && !end) {
      if (date.isBefore(start)) {
        setStart(date);
      } else {
        setEnd(date);
      }
      return;
    }
    setStart(date);
    setEnd(null);
  };

  const setDefaultEndDate = () => {
    if (start && !end) {
      setEnd(start);
    }
  };

  const isInRange = (date: dayjs.Dayjs) => {
    if (!start || !end) return false;
    return date.isAfter(start) && date.isBefore(end);
  };

  // 🟢 Confirm — send result back to parent
  const confirm = () => {
    const finalStart = start ? start.format("YYYY-MM-DD") : null;
    const finalEnd = end ? end.format("YYYY-MM-DD") : finalStart;
    setDefaultEndDate();

    onChange?.({ start: finalStart, end: finalEnd });

    setOpen(false);
  };

  const cancel = () => {
    setOpen(false);
  };

  const clear = () => {
    setStart(null);
    setEnd(null);
    setOpen(false);
    onChange?.({ start: null, end: null });
  };

  return (
    <div className="relative w-full max-w-xs">
      <label className="text-[#9B9BAF] text-sm">วันที่</label>

      <button
        onClick={() => setOpen(!open)}
        className={`w-full px-4 text-sm py-2 rounded-[8px] border border-[#1E1E24] flex justify-between items-center ${
          start || end ? "text-white" : "text-gray-700"
        }`}
      >
        {start
          ? `${start.format("DD MMM YYYY")} - ${
              end ? end.format("DD MMM YYYY") : "เลือกวันสิ้นสุด"
            }`
          : "ทั้งหมด"}

        <div className="flex gap-1">
          {(start || end) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
              className="cursor-pointer p-1 hover:bg-neutral-800 rounded"
              title="ลบวันที่"
            >
              <svg
                className="w-4 h-4 text-gray-400 hover:text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

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

          {/* Week header */}
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
                const isStart = start?.isSame(date, "day");
                const isEnd = end?.isSame(date, "day");

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(date)}
                    className={`
                      py-1 w-8 rounded-lg text-sm
                      ${
                        isStart || isEnd
                          ? "bg-blue-600 text-white"
                          : isInRange(date)
                            ? "bg-blue-500/30 text-white"
                            : "text-gray-300 hover:bg-neutral-700"
                      }
                    `}
                  >
                    {i + 1}
                  </button>
                );
              })}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={cancel}
              className="w-full px-4 py-2 text-gray-300 hover:bg-neutral-700 rounded-lg"
            >
              ยกเลิก
            </button>

            <button
              onClick={confirm}
              className="w-full px-4 py-2 bg-[#7949FF] hover:bg-blue-700 text-white rounded-lg"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
