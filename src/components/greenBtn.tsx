import { useState } from "react";
import { ReactNode } from "react";

interface BtnProps {
  nomeBtn: string;
  icon: ReactNode;
  type?: "button" | "submit" | "reset";
  big?: boolean;
  median?: boolean;
  onClick?: () => void;
  form?: string;
  customCss?: string;
  disabled?: boolean;
  hardDisabled?: boolean;
}

export function GrnBtn({
  hardDisabled,
  disabled = false,
  big = false,
  customCss,
  median,
  nomeBtn,
  icon,
  onClick,
  type,
  form,
}: BtnProps) {
  const [isWaiting, setIsWaiting] = useState(false);

  const handleDebouncedClick = (e: any) => {
    if (isWaiting) {
      e.preventDefault();
      return;
    }
    setIsWaiting(true);
    if (onClick) {
      onClick();
    }
    setTimeout(() => {
      setIsWaiting(false);
    }, 500);
  };

  return (
    <button
      form={form ? form : ""}
      style={big ? { fontSize: "32px" } : { fontSize: "18px" }}
      disabled={hardDisabled}
      type={type}
      onClick={handleDebouncedClick}
      className={` bg-custom-green ${customCss}  ${big ? "h-20 px-8" : ""} ${
        median ? "px-6" : ""
      } flex gap-2 px-4 items-center font-semibold justify-center shadow-md hover:${
        disabled ? "bg-slate-500" : "bg-custom-green"
      } text-white py-2 rounded-md border-none hover:bg-green-600 cursor-pointer hover:shadow-lg transition-all duration-500 hover:scale-105 `}
    >
      {icon} {nomeBtn}
    </button>
  );
}
