import { useState } from "react";
import Dropdown from "./dropdown";
import { useStockFilters } from "../contexts/stock-filter-context";

const itemsPerPageOptions = [
  { id: 10, name: "10" },
  { id: 25, name: "25" },
  { id: 50, name: "50" },
  { id: 100, name: "100" },
];

interface PaginationProps {
  page: number | undefined;
  totalPage: number | undefined;
  onChange: (data: { page: number; itemsPerPage: number }) => void;
}

export default function Pagination(props: PaginationProps) {
  const { updateFilter } = useStockFilters();
  const currentPage = props.page ?? 1;
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const totalPages = props.totalPage ?? 1;
  const maxVisible = 3; // ปรับได้ เช่น 5,7

  const handlePrev = () => {
    if (currentPage > 1) {
      props.onChange({ page: currentPage - 1, itemsPerPage });
      updateFilter({ page: currentPage - 1 });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      props.onChange({ page: currentPage + 1, itemsPerPage });
      updateFilter({ page: currentPage + 1 });
    }
  };

  const handlePageClick = (page: number) => {
    props.onChange({ page, itemsPerPage });
    updateFilter({ page: page });
  };

  const handleItemsPerPageChange = (newSize: number | null) => {
    setItemsPerPage(newSize ?? 1);
    updateFilter({ itemPerPage: newSize ?? 25 });
    props.onChange({ page: 1, itemsPerPage: newSize ?? 25 });
  };

  const generatePageButtons = () => {
    const pages: (number | "ellipsis")[] = [];

    // Page 1 เสมอ
    pages.push(1);
    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    // กลุ่มกลาง: currentPage ± (maxVisible-3)/2
    const half = Math.floor((maxVisible - 3) / 2);
    const start = Math.max(2, currentPage - half);
    const end = Math.min(totalPages - 1, currentPage + half);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Ellipsis หลัง ถ้าจำเป็น
    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    // Page สุดท้าย ถ้า != page 1
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages.filter(
      (page, idx, self) =>
        page !== "ellipsis" ||
        (idx > 0 && self[idx - 1] !== "ellipsis") ||
        (idx < self.length - 1 && self[idx + 1] !== "ellipsis"),
    );
  };

  return (
    <div className="flex w-full items-center justify-between border-[#2a2a2a] text-white">
      {/* Items per page */}
      <div className="flex items-center gap-3">
        <span className="hidden md:inline text-white text-sm whitespace-nowrap">
          จำนวนรายการ
        </span>
        <div className="relative flex items-center">
          <Dropdown
            py="py-2"
            canCancelOption={false}
            selectedId={itemsPerPage}
            options={itemsPerPageOptions}
            onChange={(option) => handleItemsPerPageChange(option?.id ?? null)}
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-1">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="border rounded-[8px] border-[#1E1E24] text-[#ccc] text-sm px-4 py-2 whitespace-nowrap bg-transparent hover:bg-[#222] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ก่อนหน้า
        </button>

        {generatePageButtons().map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="hidden md:inline-flex border rounded-[8px] border-[#1E1E24] px-4 py-2 text-sm text-[#ccc] min-w-[34px] text-center"
              >
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => handlePageClick(Number(page))}
              className={`
        border rounded-[8px] border-[#1E1E24] px-4 py-2 text-sm min-w-[34px] text-center transition-colors
        ${
          isCurrent
            ? "border-white font-bold"
            : "bg-transparent text-white border-[#1E1E24] hover:bg-[#222]"
        }
        ${!isCurrent ? "hidden md:inline-flex" : ""}
      `}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className="border rounded-[8px] border-[#1E1E24] text-white px-4 py-2 text-sm whitespace-nowrap bg-transparent hover:bg-[#222] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}
