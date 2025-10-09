import { task } from "../../pages/leads";
import { IoBusiness } from "react-icons/io5";
import { InputDados } from "../inputDados";
import { MdAttachMoney } from "react-icons/md";
import { IoIosPerson } from "react-icons/io";
import { BsFillTelephoneFill } from "react-icons/bs";
import { CgMail } from "react-icons/cg";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GrnBtn } from "../greenBtn";
import { IoIosSave } from "react-icons/io";
import { ajax } from "../../ajax/ajax";
import toast, { Toaster } from "react-hot-toast";

export function GeralLead({ task, errors }: { task?: task; errors: any }) {
  const { register, handleSubmit } = useForm();
  const [daysInStep, setDaysInStep] = useState(0);
  const [predictedDateFormatted, setPredictedDateFormatted] =
    useState<string>("");
  const [formattingData, setFormattingData] = useState<boolean>(true);
  const [changedFields, setChangedFields] = useState<any>([]);

  const formatData = () => {
    var startDate: Date | undefined | null = task?.card[0].data_criacao
      ? new Date(task?.card[0].data_criacao)
      : null;
    var currentDate: Date = new Date();
    var predictedDate: Date | undefined | null = task?.card[0].data_prevista
      ? new Date(task?.card[0].data_prevista)
      : null;
    var predictedDateFormatted = predictedDate
      ? `${predictedDate.getDate().toString().padStart(2, "0")}/${(
          predictedDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${predictedDate.getFullYear()}`
      : "";

    var daysInStep = startDate
      ? Math.floor(
          (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;
    setDaysInStep(daysInStep);
    setPredictedDateFormatted(predictedDateFormatted);
    if (daysInStep == 0) {
      setDaysInStep(1);
    }
    setFormattingData(false);
  };
  useEffect(() => {
    formatData();
  }, []);

  const onSubmit = async (data: any) => {
    toast.dismiss();
    toast.loading("Atualizando Potencial");
    const objAtt: any = {};
    objAtt.id = task?.card[0].id_card;

    for (const chave in changedFields) {
      objAtt[chave] = data[chave];
    }

    var response: any;
    try {
      response = await ajax({
        method: "PATCH",
        endpoint: "/leads/atualizarCard",
        data: objAtt,
      });
    } catch (err) {
      toast.dismiss();
      toast.error("Erro inesperado");
    }

    if (!response) {
      toast.dismiss();
      toast.error("Erro ao atualizar lead");
      return;
    }

    if (response.status == "error") {
      toast.dismiss();
      toast.error("Erro ao atualizar Lead");
      return;
    }
    if (response.status == "success") {
      toast.dismiss();
      toast.success("Potencial atualizado");
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return;
    }

    toast.dismiss();
    toast.error("Erro inesperado");
    return;
  };

  const handleFieldChanged = (nome: string) => {
    const newArray = changedFields;
    newArray[nome] = "sim";
    setChangedFields(newArray);
  };

  if (formattingData) {
    return <></>;
  }
  return (
    <form id="formLeadAll" action="" onSubmit={handleSubmit(onSubmit)}>
      <div className=" flex w-full h-full">
        <div className="w-1/2 flex flex-col ">
          <div className="w-10/12 self-center ml-4 gap-6 shadow-lg flex items-center justify-center rounded-md customBorder">
            <IoBusiness className="px-5" size={60} />
            <InputDados
              register={register}
              editable={true}
              wasChanged={handleFieldChanged}
              name="empresa"
              preValue={
                task?.card[0].empresa ? task?.card[0].empresa : "Sem informação"
              }
              customCss="widthCustom mb-4"
            />
          </div>
          <div className="flex flex-col w-10/12 mt-6 self-center  gap-4">
            <InputDados
              error={errors?.titulo}
              wasChanged={handleFieldChanged}
              register={register}
              editable={true}
              preValue={`${
                task?.card[0].titulo != null ? task?.card[0].titulo : ""
              }`}
              placeholder="Título"
              name="titulo"
            />
            <InputDados
              error={errors?.valor_estimado}
              wasChanged={handleFieldChanged}
              register={register}
              type="numero"
              editable={true}
              icon={<MdAttachMoney size={20} />}
              preValue={`${
                task?.card[0].valor_estimado != null
                  ? task?.card[0].valor_estimado
                  : ""
              }`}
              placeholder="Valor Estimado"
              name="valorEstimado"
            />
            <InputDados
              error={errors?.data_prevista}
              wasChanged={handleFieldChanged}
              register={register}
              type="date"
              editable={true}
              preValue={`${
                predictedDateFormatted != null ? predictedDateFormatted : ""
              }`}
              placeholder="Data prevista de conclusão da etapa"
              name="dataPrevista"
            />
            <InputDados
              wasChanged={handleFieldChanged}
              register={register}
              editable={false}
              preValue={`${daysInStep ? daysInStep : ""}`}
              placeholder="Dias na etapa atual"
              name="diasEtapaAtual"
            />
          </div>
        </div>
        <div className="verticalRule"></div>

        <div className="w-1/2 flex flex-col">
          <div className=" ml-4 w-10/12 gap-6 self-center  shadow-lg flex items-center justify-center rounded-md customBorder">
            <IoIosPerson className="px-5" size={40} />
            <InputDados
              register={register}
              editable={true}
              wasChanged={handleFieldChanged}
              name="pessoaContato"
              preValue={
                task?.card[0].pessoa_contato
                  ? task?.card[0].pessoa_contato
                  : "Sem informação"
              }
              customCss="widthCustom mb-4"
            />
          </div>
          <div className=" ml-4 self-center w-10/12 mt-6 flex flex-col">
            <div className="flex flex-col gap-3">
              <InputDados
                wasChanged={handleFieldChanged}
                register={register}
                icon={<BsFillTelephoneFill size={20} />}
                editable={true}
                preValue={`${
                  task?.card[0].telefone_contato != null
                    ? task?.card[0].telefone_contato
                    : ""
                }`}
                placeholder="Telefone de contato"
                name="telefone"
              />
              <InputDados
                wasChanged={handleFieldChanged}
                register={register}
                icon={<CgMail size={20} />}
                editable={true}
                preValue={`${
                  task?.card[0].email_contato != null
                    ? task?.card[0].email_contato
                    : ""
                }`}
                placeholder="Email de contato"
                name="email"
              />
            </div>
            <div className="flex flex-col gap-3 mt-28">
              <InputDados
                wasChanged={handleFieldChanged}
                editable={false}
                register={register}
                preValue={
                  task?.informacoes[0].bairro != null
                    ? task?.informacoes[0].bairro
                    : ""
                }
                placeholder="Bairro"
                name="bairro"
              />
              <InputDados
                wasChanged={handleFieldChanged}
                editable={false}
                register={register}
                preValue={
                  task?.informacoes[0].cidade != null
                    ? task?.informacoes[0].cidade
                    : ""
                }
                placeholder="Cidade"
                name="cidade"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex w-full justify-end">
        <GrnBtn
          form="formLeadAll"
          type="submit"
          nomeBtn="Atualizar Lead"
          icon={<IoIosSave size={30} />}
        />
      </div>
      <Toaster />
    </form>
  );
}
