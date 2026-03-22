import tooltipIcon from "../assets/images/tooltip-icon.png";

interface TooltipProps {
  text: string;
}

export default function Tooltip({ text }: TooltipProps) {
  return (
    <div className="relative group w-fit">
      <span className="cursor-help">
        <img src={tooltipIcon} alt="tooltip-icon.png" width={12} />
      </span>
      <div
        className="
        pointer-events-none
        absolute left-1/2 -translate-x-1/2
        bottom-full mb-2
        hidden group-hover:block
        whitespace-nowrap
        bg-black text-white text-xs
        px-2 py-1 rounded
        shadow-lg
        z-10
      "
      >
        {text}
      </div>
    </div>
  );
}
