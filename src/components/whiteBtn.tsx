
import { ReactNode } from "react";

interface nome {
    nomeBtn: string;
    icon: ReactNode; // Update the type of the icon property
    onClick?: () => void;
    customCss?: string;
    type?:  "button" | "submit" | "reset" | undefined;
}

export function WhiteBtn({nomeBtn, icon, onClick, customCss, type}: nome) {
    return (
        <button style={{ fontSize: "16px" }} type={type} onClick={onClick} className={` ${customCss} customBorder bg-white outline-none flex gap-2 h-9 items-center font-semibold justify-center shadow-md hover:bg-black hover:text-white  text-black py-2 hover:scale-105 rounded-md cursor-pointer hover:shadow-lg transition-all duration-500 w-30`}>
            {icon}  {nomeBtn}
        </button>
    )
}