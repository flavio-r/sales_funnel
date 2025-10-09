import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { gerenciado } from "./headerGestoria";
interface input {
  placeholder: string;
  name: string;
  gerenciados: gerenciado[];
  icon?: any;
  error?: string;
  rules?: RegisterOptions;
  insidePlaceholder?: string;
  preValue?: string;
  tipo?: string;
  register: UseFormRegister<any>;
  requiredDefault?: boolean;
  funcaoAoMudar?: (e: any) => void;
  preOwner: string;
}
export function SelectDadosGestoria({
  tipo,
  funcaoAoMudar,
  requiredDefault,
  register,
  placeholder,
  name,
  icon,
  error,
  rules,
  gerenciados,
  preOwner,
}: input) {
  return (
    <div className=" w-full relative mt-4 ">
      <p className="m-0 font-semibold text-sm">{placeholder}</p>
      <div className="absolute ml-2 mt-3 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex items-center w-full ">
        <select
          {...(requiredDefault ? { required: true } : {})}
          {...(funcaoAoMudar
            ? { ...register(name, { onChange: (e) => funcaoAoMudar(e) }) }
            : { ...register(name, rules) })}
          className={` corPlaceholder text-black fontePadrao font-semibold colocarBorda w-full h-10 rounded-md border-none text-lg  ${
            icon ? "pl-9" : "pr-6 pl-2"
          } focus:outline-none focus:border-2`}
        >
          {tipo == "owner" ? (
            <>
              {gerenciados.map((gerenciado: gerenciado) => {
                const cleanName = gerenciado.VendedorExterno.replace(".", " ");
                return (
                  <option
                    selected={cleanName == preOwner ? true : false}
                    value={gerenciado.CodigoVendedor}
                  >
                    {cleanName}
                  </option>
                );
              })}
            </>
          ) : (
            ""
          )}
          {tipo == "leadOwner" ? (
            <>
              {gerenciados.map((gerenciado: gerenciado) => {
                const cleanName = gerenciado.VendedorExterno.replace(".", " ");
                return <option value={gerenciado.SlpName}>{cleanName}</option>;
              })}
            </>
          ) : (
            ""
          )}
        </select>
      </div>
      <p className="text-red-600 m-0 font-semibold text-sm">
        {error ? error : ""}
      </p>
    </div>
  );
}
