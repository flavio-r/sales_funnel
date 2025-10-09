import { useState } from "react";
import { Input } from "./input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WhiteBtn } from "./whiteBtn";
import { MdCancel } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { useEffect } from "react";
import toast from "react-hot-toast";
import "react-quill/dist/quill.snow.css"; // Importe o estilo do editor
import { IoPersonAdd } from "react-icons/io5";
import { MdConnectWithoutContact } from "react-icons/md";
import { ajax } from "../ajax/ajax";

const schema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  valorEstimado: z.string().min(1, "Valor estimado é obrigatório"),
  pessoaContato: z.string(),
  meioContato: z.string(),
  dataContato: z.string().min(1, "Data prevista de contato é obrigatória!"),
});
type FormData = z.infer<typeof schema>;

export function AddPotential({
  atualizarEstadoModal,
  mostrarModal,
}: {
  atualizarEstadoModal: () => void;
  mostrarModal: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [quillValue, setquillValue] = useState<string>("");
  const [isWaiting, setIsWaiting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  async function onSubmit(data: FormData) {
    setAddLoading(true);
    const toastId = toast.loading("Salvando");

    if (data.dataContato && data.dataContato !== "") {
      const datePrevista = new Date(data.dataContato);
      if (datePrevista < new Date()) {
        setAddLoading(false);
        toast.dismiss(toastId);
        toast.error("Data prevista de contato deve ser hoje ou depois de hoje");
        return;
      }
    }

    const dataObj = {
      titulo: data.titulo,
      valorEstimado: data.valorEstimado,
      pessoaContato: data.pessoaContato,
      meioContato: data.meioContato,
      dataPrevista: data.dataContato,
      notas: quillValue,
    };

    const valueFormattedBrazilianStyle = dataObj.valorEstimado
      .replace(".", "")
      .replace(",", ".");
    dataObj.valorEstimado = valueFormattedBrazilianStyle;

    const response = await ajax({
      method: "POST",
      endpoint: "/leads/adicionar",
      data: dataObj,
    });

    if (response.status == "error") {
      setAddLoading(false);
      toast.dismiss(toastId);
      if (Array.isArray(response.message)) {
        const errorMsgs = response.message;
        errorMsgs.forEach((msg: any) => {
          toast.error(msg.msg);
        });
        return;
      }
      if (typeof response.message == "string") {
        toast.error(response.message);
        return;
      }
      toast.error("Erro Inesperado");
      return;
    }

    if (response.status == "success") {
      setAddLoading(false);
      toast.dismiss(toastId);
      if (typeof response.message == "string") {
        toast.success(response.message);
      }
      setTimeout(() => {}, 100);
      setIsOpen(false);
      window.location.reload();
      return;
    }

    setAddLoading(false);
    toast.dismiss(toastId);
    toast.error("Erro inesperado");
  }

  const handleClose = () => {
    setIsOpen(false);
    atualizarEstadoModal();
  };

  useEffect(() => {
    setIsOpen(mostrarModal);
  }, [mostrarModal]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleDebouncedClick = (e: any) => {
    if (isWaiting) {
      e.preventDefault();
      return;
    }
    setIsWaiting(true);
    setTimeout(() => {
      setIsWaiting(false);
    }, 1000);
  };

  return (
    <div
      className={` ${
        isOpen ? "" : "hidden"
      } modalAdd fixed top-0 left-0 w-full h-full bg-opacity-50 bg-black overflow-auto z-50 flex items-center justify-center box-border`}
    >
      <div
        className={` ${
          isOpen ? "slide-up" : "slide-down"
        }  bg-white w-3/6 rounded-md shadow-md flex flex-col`}
      >
        <div className="w-full flex items-center justify-between  bg-white rounded-sm">
          <p className="font-bold text-xl ml-6">Adicionar Potencial</p>
          <div className="mr-6" onClick={() => handleClose()}>
            <WhiteBtn nomeBtn="Fechar" icon={<MdCancel />} />
          </div>
        </div>
        <hr className="m-0" />
        <form
          id="addPo"
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className=" h-full flex customFormHeight w-full px-8 py-4 box-border mb-4  justify-between gap-4"
        >
          <div className="flex flex-col h-full  w-1/2">
            <Input
              insidePlaceholder="Título da oportunidade"
              placeholder="Título"
              name="titulo"
              error={errors.titulo?.message}
              register={register}
            ></Input>
            <Input
              type="number"
              insidePlaceholder="20000"
              placeholder="Valor Estimado"
              icon={<FaMoneyBillWave />}
              name="valorEstimado"
              error={errors.valorEstimado?.message}
              register={register}
            ></Input>
            <Input
              insidePlaceholder="Pedro da silva"
              placeholder="Pessoa de Contato"
              icon={<IoPersonAdd />}
              name="pessoaContato"
              error={errors.pessoaContato?.message}
              register={register}
            ></Input>
            <Input
              insidePlaceholder="cliente@vendas.com.br OU (47) 99141-1100"
              placeholder="Meio de contato"
              icon={<MdConnectWithoutContact />}
              name="meioContato"
              error={errors.meioContato?.message}
              register={register}
            ></Input>
            <Input
              insidePlaceholder="dd/mm/aaaa"
              placeholder="Data Prevista de conclusão da etapa"
              icon={<MdConnectWithoutContact />}
              type="date"
              name="dataContato"
              error={errors.dataContato?.message}
              register={register}
            ></Input>
          </div>
          <div className=" flex flex-col w-1/2">
            <div className="mt-6 h-full w-full box-border mb-4">
              <p className="m-0 font-semibold"> Anotações </p>
              <textarea
                onChange={(e) => setquillValue(e.target.value)}
                value={quillValue}
                className={`myQuill2 w-full h-full customBorder rounded-md border-none shadow-md p-2 focus:outline-none`}
              />
            </div>
          </div>
        </form>
        <hr className="m-0" />
        <div className=" flex items-center justify-between h-20 w-full ">
          <button className=" ml-12 h-10 w-28 customRedBorder bg-white rounded-md font-semibold text-red-500 cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300 ">
            Cancelar
          </button>
          <button
            onClick={handleDebouncedClick}
            form="addPo"
            type="submit"
            className=" mr-12 h-10 w-28 rounded-md border-none bg-green-500 text-white font-semibold text-lg  cursor-pointer hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg flex gap-4 items-center justify-center"
          >
            {addLoading ? "Salvando" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
