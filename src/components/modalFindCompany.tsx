import { useState } from "react";
import { useEffect } from "react";
import { WhiteBtn } from "./whiteBtn";
import { MdCancel } from "react-icons/md";
import { Input } from "./input";
import { ajax } from "../ajax/ajax";
import { CiSearch } from "react-icons/ci";
import toast from "react-hot-toast";
interface findProps {
  onClose: () => void;
  onSelectedData: (empresa: any) => void;
}

export function FindCompany({ onClose, onSelectedData }: findProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [empresas, setEmpresas] = useState<any[]>([]);

  if (isOpen) {
    document.body.style.overflow = "hidden";
  }
  if (!isOpen) {
    document.body.style.overflow = "unset";
  }

  function handleSelect(empresa: any) {
    onSelectedData(empresa);
    setIsOpen(false);
  }

  const carregaEmpresas = async (filter: string = "") => {
    const response = await ajax({
      method: "POST",
      endpoint: "/empresas",
      data: { filter: filter },
    });
    if (response.status == "success") {
      setEmpresas(response.data);
    }
    if (response.status == "error") {
      toast.error("Erro ao carregar empresas!");
    }
  };

  useEffect(() => {
    if (!isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      carregaEmpresas();
    }
  }, [isOpen]);

  useEffect(() => {
    if (filter.length > 3 || filter.length == 0) {
      carregaEmpresas(filter);
    }
  }, [filter]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modalAdd fixed top-0 left-0 w-full h-full bg-opacity-50 bg-black overflow-auto z-50 flex items-center justify-center box-border">
      <div className="bg-white w-5/6 customHeight rounded-md flex flex-col box-border shadow-lg">
        <div className="w-full h-14 flex items-center justify-between">
          <p className="ml-4 text-xl font-semibold">Buscar empresa</p>
          <div className="mr-4">
            <WhiteBtn
              onClick={() => setIsOpen(false)}
              nomeBtn="Fechar"
              icon={<MdCancel />}
            />
          </div>
        </div>
        <hr className="w-full" />
        <div className="flex w-full items-center justify-between">
          <div className="self-center items-center flex gap-4 ml-10">
            <h1 className="m-0">Buscar</h1>
          </div>
          <div className="flex mr-10">
            <Input
              valueHandler={(e) => setFilter(e.target.value)}
              placeholder="Pesquisar"
              insidePlaceholder="Copapel LTDA"
              name="pesquisa"
              icon={<CiSearch size={20} />}
            />
          </div>
        </div>
        <div className="self-center mt-4 w-11/12 rounded bg-white  overflow-auto">
          <div className="flex w-full gap-12 justify-between sticky top-0 bg-white px-4">
            <p className="w-1/4 font-semibold text-lg">Razão Social</p>
            <p className="w-1/4 font-semibold text-lg">Endereço</p>
            <p className="w-1/4 font-semibold text-lg">Bairro</p>
            <p className="w-1/4 font-semibold text-lg">Capital Social</p>
          </div>
          <hr className="m-0 mb-4 sticky top-12" />
          {empresas.map((empresa, index) => (
            <div
              key={index}
              onClick={() => handleSelect(empresa)}
              className={` mt-2 customBorder rounded-md  w-full flex justify-between gap-12 bg-${
                index % 2 !== 0
                  ? "custom-gray hover:bg-gray-200"
                  : "white hover:bg-gray-100"
              } box-border px-4 py-2 hover:shadow-sm cursor-pointer transition-colors duration-300 ease-in-out`}
            >
              <p className="w-1/4 text-gray-800 font-semibold">
                {empresa["Razao social"]}
              </p>
              <p className="w-1/4 text-gray-800 font-semibold">
                {empresa["Endereco"]}
              </p>
              <p className="w-1/4 text-gray-800 font-semibold">
                {empresa["Bairro"]}
              </p>
              <p className="w-1/4 text-gray-800 font-semibold">
                {empresa["Capital social"]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
