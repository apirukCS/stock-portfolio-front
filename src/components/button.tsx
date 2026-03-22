import React, { useState } from "react";
import { CircleLoader } from "./circle-loading";

interface AppButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  bgColor?: string;
  color?: string;
  className?: string;
  hoverBackground?: string;
  border?: string;
  prefixIcon?: React.ReactNode;
  isLoading?: boolean;
}

export default function AppButton(props: AppButtonProps) {
  const [hover, setHover] = useState(false);
  const isLoading = props.isLoading || false;
  const effectiveDisabled = props.disabled || isLoading;

  const darken = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);

    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;

    return (
      "#" +
      (
        0x1000000 +
        (Math.min(255, Math.max(0, R)) << 16) +
        (Math.min(255, Math.max(0, G)) << 8) +
        Math.min(255, Math.max(0, B))
      )
        .toString(16)
        .slice(1)
    );
  };

  const bgColor = props.bgColor ?? "#7949FF";

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={effectiveDisabled} // 🔥 รวม disabled + loading
      onMouseEnter={!effectiveDisabled ? () => setHover(true) : undefined}
      onMouseLeave={!effectiveDisabled ? () => setHover(false) : undefined}
      className={props.className}
      style={{
        width: "100%",
        height: "40px",
        border: props.border ?? "none",
        borderRadius: "20px",
        background:
          hover && !effectiveDisabled
            ? props.hoverBackground ?? darken(bgColor!, 10)
            : bgColor ?? "transparent",
        color: props.color ?? "white",
        cursor: effectiveDisabled ? "not-allowed" : "pointer",
        // color: props.color,
        // cursor: props.disabled ? "not-allowed" : "pointer",
        transition: "background .2s",
        gap: "8px",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        fontWeight: "500",
      }}
    >
      <div className="flex justify-center items-center gap-2">
        {isLoading && <CircleLoader />}
        {!isLoading && props.prefixIcon && props.prefixIcon}
        {props.children}
      </div>
    </button>
  );
}
