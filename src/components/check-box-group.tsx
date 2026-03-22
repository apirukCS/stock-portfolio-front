import React from "react";

interface Option {
  id: number;
  value: string;
}

interface CheckboxGroupProps {
  label: string;
  options: Option[];
  onChange?: (selected: number[]) => void;
  selectedIds: number[];
}

export function CheckboxGroup({
  label,
  options,
  onChange,
  selectedIds,
}: CheckboxGroupProps) {
  const [selected, setSelected] = React.useState<number[]>(selectedIds ?? []);

  const toggle = (id: number) => {
    const updated = selected.includes(id)
      ? selected.filter((v) => v !== id)
      : [...selected, id];

    setSelected(updated);
    onChange && onChange(updated);
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
              type="checkbox"
              checked={selected.includes(opt.id)}
              onChange={() => toggle(opt.id)}
              className="w-4 h-4 accent-blue-500"
            />
            <span className="text-white text-sm">{opt.value}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
