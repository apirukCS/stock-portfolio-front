import { useState } from "react";

export function useConfirmAlertDialog() {
  const [message, setMessage] = useState<string | null>(null);
  const [resolver, setResolver] = useState<(v: boolean) => void>();

  const confirm = (msg: string) =>
    new Promise<boolean>((resolve) => {
      setMessage(msg);
      setResolver(() => resolve);
    });

  const close = (value: boolean) => {
    resolver?.(value);
    setMessage(null);
  };

  const ConfirmAlertDialog = () =>
    message ? (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-full max-w-sm bg-[#0F0F13] border border-[#1E1E24] rounded-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(255,255,255,0.05)]">

          {/* header */}
          <div className="flex flex-col items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500/10">
              
              {/* question icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.09 9a3 3 0 115.82 1c0 2-3 2-3 4m.09 4h.01"
                />
              </svg>

            </div>

            <div className="text-gray-200 font-semibold text-lg">
              ยืนยันการทำรายการ
            </div>
          </div>

          {/* message */}
          <p className="text-center text-gray-400 text-sm mb-6 leading-relaxed">
            {message}
          </p>

          {/* buttons */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => close(false)}
              className="w-full px-4 py-2 text-sm rounded-md border border-[#2A2A33] text-gray-300 hover:bg-[#1A1A22] transition"
            >
              ยกเลิก
            </button>

            <button
              onClick={() => close(true)}
              className="w-full px-4 py-2 text-sm rounded-md bg-white text-black font-medium hover:bg-gray-200 transition"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return { confirm, ConfirmAlertDialog };
}