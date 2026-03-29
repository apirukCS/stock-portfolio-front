import React from "react";

interface Option {
  id: number;
  value: string;
}

interface RadioGroupProps {
  selectedId: number | null;
  label: string;
  options: Option[];
  onChange?: (id: number) => void;
}

export function RadioGroup({ label, options, onChange, selectedId }: RadioGroupProps) {
  const [selected, setSelected] = React.useState<number | null>(selectedId);

  const handleChange = (value: number) => {
    setSelected(value);
    onChange && onChange(value);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-color-[#9B9BAF] text-sm">{label}</label>

      <div className="flex flex-col gap-2 pl-3">
        {options.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              value={opt.id}
              checked={selected === opt.id}
              onChange={() => handleChange(opt.id)}
              className="w-4 h-4 accent-blue-500"
            />
            <span className="text-white text-sm">{opt.value}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
