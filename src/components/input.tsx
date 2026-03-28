import { NumericFormat } from "react-number-format";
import Tooltip from "./tooltip";

interface AppInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  className?: string;
  indent?: boolean;
  required?: boolean;
  tooltipText?: string;
  borderColor?: string;
  isError?: boolean;
  maxLength?: number;
  pattern?: string;
}

export function Input({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  type = "currency",
  className = "",
  indent = false,
  required,
  tooltipText,
  borderColor = "#1E1E24",
  isError,
  maxLength,
  pattern,
}: AppInputProps) {
  return (
    <div className={`flex w-full flex-col gap-2 ${indent ? "pl-3" : ""}`}>
      {label && (
        <label className="flex items-center gap-2 text-sm text-[#9B9BAF] font-medium">
          <div>
            {label}
            {required && <span className="text-white ml-[1px] text-lg">*</span>}
          </div>
          {tooltipText && <Tooltip text={tooltipText} />}
        </label>
      )}

      {type === "currency" ? (
        <NumericFormat
          value={value}
          inputMode="decimal"
          thousandSeparator
          placeholder={placeholder}
          decimalScale={2}
          pattern={pattern}
          maxLength={maxLength ?? 16}
          onValueChange={(values) => {
            onChange && onChange(values.value);
          }}
          className={`w-full px-3 py-2 bg-transparent rounded-[8px] border border-[#1E1E24] text-gray-200 placeholder-gray-500 focus:outline-none ${className} ${
            isError ? "animate-shake-invalid" : ""
          }`}
        />
      ) : (
        <input
          type={type}
          pattern={pattern}
          value={value}
          onChange={(e) => {
            const onlyEng = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "").toUpperCase();
            onChange && onChange(onlyEng);
          }}
          onFocus={() => onFocus && onFocus()}
          onBlur={() => onBlur && onBlur()}
          placeholder={placeholder}
          className={`w-full px-3 py-2 bg-transparent rounded-[8px] border border-[${borderColor}] text-gray-200 placeholder-gray-500 focus:outline-none ${className} ${
            isError ? "animate-shake-invalid" : ""
          }`}
        />
      )}
    </div>
  );
}
