import { useEffect, useRef, useState } from "react";
import { Input } from "./input";
import cancelIcon from "../assets/images/cancel-icon.png";
import doneIcon from "../assets/images/done-icon.png";

const ChevronDown = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="#9CA3AF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface Option {
  id: number;
  name: string;
}

const Dropdown = ({
  options,
  placeholder,
  className,
  label,
  onChange,
  onCreateConfirm,
  selectedId,
  required,
  py = "py-3",
  allowCreate,
  isLoadingCreating,
  allowUpdateOption,
  isError,
  canCancelOption = true,
  onEditOptionConfirm,
}: {
  selectedId: number | null | undefined;
  options: Option[];
  placeholder?: string;
  className?: string;
  label?: string;
  onChange: (value: Option | null) => void;
  required?: boolean;
  py?: string;
  allowCreate?: boolean;
  allowUpdateOption?: boolean;
  isLoadingCreating?: boolean;
  isError?: boolean;
  onCreateConfirm?: (value: string) => void;
  canCancelOption?: boolean;
  onEditOptionConfirm?: (value: Option) => void;
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<Option | null>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropUp, setDropUp] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const toggleDropdown = () => {
    if (!isVisible) {
      const rect = dropdownRef.current?.getBoundingClientRect();
      const spaceBelow = window.innerHeight - (rect?.bottom ?? 0);

      setDropUp(spaceBelow < 200);
    }
    setIsVisible(!isVisible);
  };

  const handleCreate = () => {
    if (!newValue.trim()) return;
    onCreateConfirm && onCreateConfirm(newValue);

    setNewValue("");
    setIsCreating(false);
  };

  useEffect(() => {
    const found = options.find((e) => e.id === selectedId);
    setSelectedOption(found);
  }, [selectedId, options]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener("click", handleOutsideClick, true);
    } else {
      document.removeEventListener("click", handleOutsideClick, true);
    }

    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, [isVisible]);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onChange(option);
    setIsVisible(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();

    setSelectedOption(null);
    onChange(null);
  };

  const optionHeight = 48; // px (ปรับได้ตาม design)
  const panelHeight = options.length * optionHeight;

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-color-[#9B9BAF] text-sm">
          {label}{" "}
          {required && <span className="text-white ml-[1px] text-lg">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`inline-flex w-full items-center justify-between rounded-[8px] border border-[#1E1E24] px-3 text-sm text-gray-700 outline-none ${
          !options.length ? "text-gray-400" : ""
        } ${py} ${isError ? "animate-shake-invalid" : ""}`}
        aria-expanded={isVisible}
        aria-controls="dropdown-menu"
      >
        <label
          className={`truncate flex-1 min-w-0 text-left hover:cursor-pointer ${selectedOption ? "text-white text-sm" : ""}`}
        >
          {selectedOption?.name || placeholder || label}
        </label>
        <div className="flex items-center gap-2">
          {/* ❌ ปุ่มล้างค่า */}
          {canCancelOption && selectedOption && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear(e);
              }}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}

          {/* ⬇️ ลูกศร dropdown */}
          <span
            className={`transform transition-transform duration-200 ${
              isVisible ? "rotate-180" : ""
            }`}
          >
            <ChevronDown size={20} />
          </span>
        </div>
        {/* </span> */}
      </button>
      {isVisible && (
        <ul
          id="dropdown-menu"
          role="menu"
          className={`
            absolute z-10 w-full rounded-[8px] bg-[#1E1E24]/95 backdrop-blur-sm
            shadow-[0_0_15px_rgba(0,0,0,0.7)]
            ${dropUp ? "bottom-full mb-2" : "top-full mt-2"}
            ${isVisible ? "border border-white/10 shadow-lg" : ""}
            max-h-[50vh] overflow-y-auto
          `}
          style={{
            height: isLoadingCreating ? `${panelHeight}px` : "auto",
          }}
        >
          {isLoadingCreating && (
            <li className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>กำลังโหลด...</span>
              </div>
            </li>
          )}
          {!isLoadingCreating && (
            <>
              {allowCreate && !isCreating && (
                <li>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="w-full px-4 py-3 text-left text-sm text-blue-400 hover:bg-white hover:text-black hover:cursor"
                  >
                    + เพิ่มตัวเลือก
                  </button>
                </li>
              )}
              {allowCreate && isCreating && (
                <li className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={newValue}
                      className="text-sm"
                      type="text"
                      placeholder="ชื่อย่อหุ้น เช่น NVDA, AAPL"
                      borderColor="#FFFFFF"
                      onChange={(e) => setNewValue(e)}
                    />

                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setNewValue("");
                      }}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      <img src={cancelIcon} width={35} />
                    </button>

                    <button
                      onClick={handleCreate}
                      className="text-xs text-green-400 hover:text-green-300"
                    >
                      <img src={doneIcon} width={35} />
                    </button>
                  </div>
                </li>
              )}
              {options.length > 0 ? (
                <>
                  {options.map((option) => (
                    <li key={option.id}>
                      {editingId === option.id ? (
                        // ✅ EDIT MODE
                        <div className="flex items-center gap-2 px-3 py-2">
                          <Input
                            value={editingValue}
                            type="text"
                            placeholder="แก้ไขชื่อ"
                            borderColor="#FFFFFF"
                            onChange={(e) => setEditingValue(e)}
                          />

                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingValue("");
                            }}
                          >
                            <img src={cancelIcon} width={35} />
                          </button>

                          <button
                            onClick={() => {
                              onEditOptionConfirm?.({
                                id: editingId,
                                name: editingValue,
                              });

                              setEditingId(null);
                              setEditingValue("");
                            }}
                          >
                            <img src={doneIcon} width={35} />
                          </button>
                        </div>
                      ) : (
                        // ✅ NORMAL MODE
                        <div
                          onClick={() => handleOptionClick(option)}
                          className="group flex items-center justify-between px-4 py-2 cursor-pointer text-white hover:bg-white hover:text-black"
                        >
                          <span className="truncate">{option.name}</span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(option.id);
                              setEditingValue(option.name);
                            }}
                            className="transition-opacity text-xs text-blue-400"
                          >
                            {allowUpdateOption && <PencilIcon />}
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;

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
