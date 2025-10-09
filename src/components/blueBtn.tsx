import { ReactNode } from "react";

interface nome {
  nomeBtn: string;
  icon: ReactNode;
  onClick?: () => void;
}

export function BlueBtn({ nomeBtn, icon, onClick }: nome) {
  return (
    <button
      style={{ fontSize: "32px" }}
      onClick={onClick}
      className="bg-blue-500 px-8 h-20 flex gap-2 items-center font-semibold justify-center shadow-md hover:bg-blue-600 text-white py-2 rounded-md border-none cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-500   "
    >
      {icon} {nomeBtn}
    </button>
  );
}
