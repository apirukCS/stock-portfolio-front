interface TextareaProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  indent?: boolean;
  rows?: number;
  required?: boolean;
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  indent = false,
  rows = 4,
  required,
}: TextareaProps) {
  return (
    <div className={`flex flex-col gap-2 ${indent ? "pl-3" : ""}`}>
      {label && (
        <label className="text-sm text-color-[#9B9BAF] font-medium">
          {label}{" "}
          {required && <span className="text-white ml-[1px] text-lg">*</span>}
        </label>
      )}

      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-transparent rounded-[8px] border border-[#1E1E24] text-gray-200 placeholder-gray-500 focus:outline-none resize-none ${className}`}
      />
    </div>
  );
}
