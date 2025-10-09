import { useState, useRef, useEffect } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importe os ícones do olho aberto e fechado

interface InputProps {
  id?: string;
  placeholder: string;
  name: string;
  icon?: any;
  error?: string;
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
  valueHandler?: (e: any) => void;
  insidePlaceholder?: string;
  type?: string;
  customCss?: string;
}

export function Input({
  customCss,
  type,
  placeholder,
  name,
  icon,
  error,
  register,
  rules,
  insidePlaceholder,
  valueHandler,
  id,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const inputHeight = inputRef.current?.clientHeight;
    if (inputHeight) {
      const buttonTop = inputHeight / 2 - 10; // Adjust button top position
      inputRef.current?.style.setProperty("--button-top", `${buttonTop}px`);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={` ${customCss} w-full relative mt-4 box-border`}>
      <p className="m-0 font-semibold text-sm">{placeholder}</p>
      <div className="absolute ml-2 mt-2 box-border">{icon}</div>
      <input
        id={id || undefined}
        ref={inputRef}
        type={showPassword ? "text" : type ? type : "text"}
        placeholder={insidePlaceholder ? insidePlaceholder : ""}
        className={` box-border py-4 customBorderInput transition-all duration-500 inputCinza fontePadrao font-semibold colocarBorda w-full h-8 rounded-md border-none ${
          icon ? "pl-8" : "pr-6 pl-2"
        } focus:outline-none focus:border-2`}
        {...(valueHandler
          ? register
            ? register(name, { onChange: (e) => valueHandler(e) })
            : ""
          : register
          ? register(name, rules)
          : "")}
      />
      {type === "password" && ( // Exibir o botão de alternância apenas se o tipo for senha
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute flex border-transparent outline-transparent cursor-pointer bg-transparent right-2 top-2 focus:outline-none"
          style={{ top: "var(--button-top, 50%)" }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
      <p className="text-red-600 m-0 font-semibold text-sm">
        {error ? error : ""}
      </p>
    </div>
  );
}
