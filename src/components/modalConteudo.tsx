import { useState } from "react";
import { WhiteBtn } from "./whiteBtn";
import { IoIosCloseCircle } from "react-icons/io";
import { GrnBtn } from "./greenBtn";
import { IoIosSend } from "react-icons/io";
interface ModalConteudoProps {
  show: boolean;
  fechaModal: () => void;
  atualizaModal: (e: string) => void;
  atualizaDataModal: (e: string) => void;
  enviaTicket: () => void;
  titulo: string;
  tipo: string;
}

export function ModalConteudo({
  show,
  fechaModal,
  atualizaModal,
  atualizaDataModal,
  titulo,
  tipo,
  enviaTicket,
}: ModalConteudoProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <div
      className={` ${
        show ? "" : "hidden"
      } modalAdd  fixed top-0 left-0 w-full h-full bg-opacity-20 bg-black overflow-auto z-50 flex items-center justify-center box-border`}
    >
      <div className="bg-white w-3/6 customBorder rounded-md shadow-md flex flex-col box-border">
        <div className="p-2 flex flex-col relative ">
          <div className=" flex justify-between  items-center ">
            <p className="m-0 text-xl font-semibold">{titulo}</p>
            <WhiteBtn
              onClick={fechaModal}
              nomeBtn="Fechar"
              icon={<IoIosCloseCircle />}
            />
          </div>
          <div className="horizontalRule mb-2"></div>
          <div>
            {tipo == "conteudo" ? (
              <div className="relative">
                <textarea
                  name="conteudo"
                  id="conteudo"
                  placeholder=" "
                  className={`font-sans outline-none p-4 w-full h-52 rounded-md customBorder box-border text-md focus:border-blue-500 ${
                    isFocused ? "pt-6" : ""
                  }`}
                  onFocus={() => setIsFocused(true)}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setIsFocused(false);
                    }
                  }}
                  onChange={(e) => atualizaModal(e.target.value)}
                ></textarea>
                <label
                  htmlFor="conteudo"
                  className={`absolute pl-4 left-2 transition-all duration-300 ${
                    isFocused ? "top-1 text-gray-600 text-sm" : "top-4 text-md"
                  }`}
                >
                  Conteúdo
                </label>
              </div>
            ) : null}
            {tipo == "data" ? (
              <div className="box-border mt-2 mb-2  ">
                <p className="m-0 text-black">Data</p>
                <input
                  onChange={(e) => atualizaDataModal(e.target.value)}
                  type={"date"}
                  placeholder={"data"}
                  className={`w-11/12 px-2 corPlaceholder customBorderInput transition-all duration-500  text-black fontePadrao font-semibold h-10 rounded-md text-lg focus:outline-none focus:border-2`}
                />
              </div>
            ) : null}
          </div>
          <div className="horizontalRule mb-1"></div>
          <div className="flex justify-between">
            <GrnBtn
              nomeBtn="Enviar"
              icon={<IoIosSend size={20} />}
              customCss="w-32 mt-2"
              onClick={enviaTicket}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
