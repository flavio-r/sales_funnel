import { useState, useEffect } from "react";
import { WhiteBtn } from "./whiteBtn";
import { IoIosCloseCircle } from "react-icons/io";
import { InputDados } from "./inputDados";
import { SelectDados } from "./selectDados";
import { useForm } from "react-hook-form";
import { GrnBtn } from "./greenBtn";
import { IoIosSave } from "react-icons/io";
import { ajax } from "../ajax/ajax";
import toast, { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/authProvider";
import { achaNumAssunto } from "../utils/helpers";
interface novoTicketProps {
  onClose: () => void;
  CardCode?: string;
}

export function ModalNovoTicket({ onClose, CardCode }: novoTicketProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { register, handleSubmit } = useForm({});
  const [isFocused, setIsFocused] = useState(false);
  const [renderToast, setRenderToast] = useState(false);
  const [atribuidos, setAtribuidos] = useState<any>([]);
  const [assuntos, setAssuntos] = useState<any>([]);
  const { user } = useContext(AuthContext);

  // Função para obter o ID do usuário do localStorage
  const getUserIdFromStorage = () => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        return userData.id_sap;
      } catch (error) {
        console.error("Erro ao parsear usuário do localStorage:", error);
      }
    }
    return user?.id_sap || "";
  };

  const dataAtual = new Date();
  const ano = dataAtual.getFullYear();
  const mes = String(dataAtual.getMonth() + 1).padStart(2, "0"); // Adiciona zero à esquerda se for menor que 10
  const dia = String(dataAtual.getDate()).padStart(2, "0"); // Adiciona zero à esquerda se for menor que 10
  const dataFormatada = `${dia}/${mes}/${ano}`;

  const onSubmit = async (data: any) => {
    setRenderToast(true);
    toast.dismiss();
    toast.loading("Enviando Ticket");
    data.cardcode = CardCode;

    // Sempre usar tipo "Lembrete" (código 10)
    data.tipo = "10";
    data.tipoRealizado = "10";

    const assunto = achaNumAssunto(data.assunto);

    data.assunto = assunto;

    // Definir horário padrão se não preenchido
    if (!data.horario || data.horario === "") {
      data.horario = "00:01";
    }

    const atribuicao: any = document.getElementById("testeAtribuicao");
    if (atribuicao) {
      data.atribuicao = atribuicao.value;
    }

    const response = await ajax({
      method: "POST",
      endpoint: "/atividades/adicionar",
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

  const carregaAtribuidos = async () => {
    const response = await ajax({
      method: "GET",
      endpoint: "/task/atribuicoes",
      data: null,
    });
    if (response.status == "error") {
      toast.error("Erro ao carregar atribuições");
      return;
    }

    if (response.status == "success") {
      const atribuidos: any = [];
      response.data.forEach((atribuido: any) => {
        atribuidos.push(atribuido);
      });
      setAtribuidos(atribuidos);
    }
  };

  const carregaAssuntos = async () => {
    const response = await ajax({
      method: "GET",
      endpoint: "/atividades/assuntos",
      data: null,
    });
    if (response.status == "error") {
      toast.error("Erro ao carregar assuntos");
      return;
    }

    if (response.status == "success") {
      setAssuntos(response.data);
    }
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

  useEffect(() => {
    carregaAtribuidos();
    carregaAssuntos();
    //replaced cons log
  }, []);

  // useEffect para definir o valor selecionado após carregar os dados
  useEffect(() => {
    if (atribuidos.length > 0) {
      const userId = getUserIdFromStorage();
      const selectElement = document.getElementById(
        "testeAtribuicao"
      ) as HTMLSelectElement;
      if (selectElement && userId) {
        selectElement.value = userId.toString();
      }
    }
  }, [atribuidos]);

  return (
    <form
      id="formNovoTicket"
      action=""
      onSubmit={handleSubmit(onSubmit)}
      className=" gap-12 modalAdd fixed top-0 left-0 w-full h-full bg-opacity-50 bg-black overflow-auto z-50 flex items-center justify-center box-border"
    >
      <div
        className={`bg-white w-5/12 h-auto rounded-md flex flex-col box-border shadow-lg p-4`}
      >
        <div className="flex justify-between items-center mb-4">
          <p className="m-0 text-xl font-semibold">Novo Atendimento</p>
          <WhiteBtn
            nomeBtn="Fechar"
            type="button"
            onClick={() => setIsOpen(false)}
            icon={<IoIosCloseCircle />}
          />
        </div>

        <div className="flex w-full gap-4 mb-4">
          <div className="flex flex-col w-1/2">
            <SelectDados
              itens={atribuidos}
              id="testeAtribuicao"
              requiredDefault={true}
              preValue={getUserIdFromStorage()}
              tipo="atribuidos"
              placeholder="Atribuição"
              insidePlaceholder="Atribuir"
              name="atribuicao"
              register={register}
            />
          </div>
          <div className="w-1/2">
            <div className="flex gap-4">
              <div className="w-1/2">
                <InputDados
                  editable={true}
                  requiredDefault={true}
                  preValue={dataFormatada}
                  placeholder="Data"
                  insidePlaceholder="29/01/2005"
                  name="data"
                  register={register}
                  type="date"
                />
              </div>
              <div className="w-1/2">
                <InputDados
                  editable={true}
                  requiredDefault={false}
                  placeholder="Horário"
                  insidePlaceholder="13:29"
                  name="horario"
                  register={register}
                  type="time"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mb-4">
          <SelectDados
            requiredDefault={true}
            tipo="assunto"
            placeholder="Assunto"
            name="assunto"
            register={register}
            itens={assuntos}
          />
        </div>

        <div className="w-full mb-4 h-32 relative">
          <textarea
            required={true}
            {...register("conteudo")}
            name="conteudo"
            id="conteudo"
            placeholder=" "
            className={`font-sans outline-none p-4 w-full h-full rounded-md customBorder box-border text-md focus:border-blue-500 resize-none ${
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
            className={`absolute pl-4 left-4 transition-all duration-300 ${
              isFocused ? "top-1 text-gray-600 text-sm" : "top-4 text-md"
            }`}
          >
            Conteúdo
          </label>
        </div>

        <div className="w-full flex justify-end">
          <GrnBtn
            form="formNovoTicket"
            icon={<IoIosSave size={20} />}
            nomeBtn="Adicionar Ticket"
            type="submit"
          />
        </div>
      </div>
      {renderToast ? <Toaster /> : null}
    </form>
  );
}
