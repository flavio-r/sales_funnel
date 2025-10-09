import { useState, useEffect } from "react";
import { WhiteBtn } from "./whiteBtn";
import { IoIosCloseCircle } from "react-icons/io";
import { useForm } from "react-hook-form";
import { GrnBtn } from "./greenBtn";
import { FaWindowClose } from "react-icons/fa";
import { ajax } from "../ajax/ajax";
import toast from "react-hot-toast";
interface novoTicketProps {
  onClose: () => void;
  ticketData: any;
}

export function EndTicket({ onClose, ticketData }: novoTicketProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { register, handleSubmit } = useForm({});
  const [isFocused, setIsFocused] = useState(true);

  const onSubmit = async (data: any) => {
    toast.dismiss();
    toast.loading("Enviando Ticket");
    data.id_ticket = ticketData.id_ticket;

    const response = await ajax({
      method: "POST",
      endpoint: "/atividades/desativar",
      data: data,
    });
    if (!response) {
      toast.dismiss();
      toast.error("Erro ao enviar Ticket");
      return;
    }
    if (response.status == "error") {
      toast.dismiss();
      toast.error("Erro ao enviar Ticket");
      return;
    }
    if (response.status == "success") {
      toast.dismiss();
      toast.success("Ticket enviado!");
      setIsOpen(!isOpen);
      return;
    }

    toast.dismiss();
    toast.error("Erro ao enviar ticket");
  };

  //configs do funcionamento do modal
  if (isOpen) {
    document.body.style.overflow = "hidden";
  }
  if (!isOpen) {
    document.body.style.overflow = "unset";
  }

  useEffect(() => {
    if (!isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  return (
    <form
      id="formNovoTicket"
      action=""
      onSubmit={handleSubmit(onSubmit)}
      className=" gap-12 modalAdd fixed top-0 left-0 w-full h-full bg-opacity-50 bg-black overflow-auto z-50 flex items-center justify-center box-border"
    >
      <div
        className={`bg-white w-5/12 h-4/6 rounded-md flex flex-col box-border shadow-lg p-2`}
      >
        <div className="flex justify-between px-4 items-center mt-2">
          <p className="m-0  text-xl font-semibold ">
            Resultado do Atendimento
          </p>
          <WhiteBtn
            type="button"
            nomeBtn="Fechar"
            onClick={() => setIsOpen(false)}
            icon={<IoIosCloseCircle />}
          />
        </div>
        <div className="horizontalRule"></div>

        <div className=" w-full px-4  mt-4 h-full box-border relative mb-4 ">
          <textarea
            required={true}
            {...register("conteudo", { value: ticketData.mensagem })}
            name="conteudo"
            id="conteudo"
            placeholder=" "
            className={`font-sans outline-none p-4 w-full h-full  rounded-md customBorder box-border text-md focus:border-blue-500 ${
              isFocused ? "pt-6" : ""
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              if (e.target.value === "") {
                setIsFocused(false);
              }
            }}
          ></textarea>
          <label
            htmlFor="conteudo"
            className={`absolute  pl-4 left-4 transition-all duration-300 ${
              isFocused ? "top-1 text-gray-600 text-sm" : "top-4 text-md"
            }`}
          >
            Conteúdo
          </label>
        </div>
        <div className="horizontalRule"></div>
        <div className="w-full px-4 mt-4 box-border flex justify-between mb-2">
          <div className="flex items-center gap-2"></div>
          <GrnBtn
            form="formNovoTicket"
            icon={<FaWindowClose size={20} />}
            nomeBtn="Finalizar Ticket"
            type="submit"
          />
        </div>
      </div>
    </form>
  );
}
