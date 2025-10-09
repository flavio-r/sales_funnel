import { useState } from "react";
import { Geral } from "../components/tabs/geral";
import { Atividades } from "../components/tabs/atividades";
import { useParams } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { MdLocalActivity } from "react-icons/md";
import { GrSteps } from "react-icons/gr";
import { FaRegNoteSticky } from "react-icons/fa6";
import { useEffect } from "react";
import { ajax } from "../ajax/ajax";
import { Etapas } from "../components/tabs/etapas";
import toast, { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import { Notes } from "../components/tabs/notas.tsx";
import { LoadingModal } from "../components/modalLoading.tsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaMoneyBillWave } from "react-icons/fa";
import { Cotacoes } from "../components/tabs/cotacoes.tsx";
export interface task {
  SequentialNo: number;
  CardCode: string;
  CustomerName: string;
  StartDate: string;
  OpportunityName: string;
  MaxLocalTotal: number;
  StageId: number;
  PredictedClosingDate: string;
  Remarks: string;
  SalesOpportunitiesLines: any;
  ContactPerson: string;
  EmailAddress: string;
  Criador: Criador;
  Phone1: string;
  BPAddress: any;
}

interface Criador {
  nomeCriador: string;
}

export function Opportunity() {
  const [loadingOp, setLoadingOp] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState(1);
  const [task, setTask] = useState<task>();
  const [daysInSteps, setDaysInStep] = useState<any>();
  const [formattingDays, setFormattingDays] = useState<boolean>(true);
  const { id } = useParams<string>();

  const calculateDaysInEachStep = (taskData: any) => {
    const etapas = taskData?.SalesOpportunitiesLines;
    const objDays: any = {};
    etapas.forEach((e: any) => {
      if (e.StageKey == "6") {
        const startDate: Date = new Date(e.StartDate);
        const closingDate: Date = new Date(e.ClosingDate);
        var daysInStep =
          Math.abs(startDate.getTime() - closingDate.getTime()) /
          (1000 * 60 * 60 * 24);
        daysInStep == 0 ? (daysInStep = 1) : null;
        setDaysInStep(
          objDays.lead == undefined
            ? (objDays.lead = 0 + daysInStep)
            : (objDays.lead += daysInStep)
        );
      }
      if (e.StageKey == "3") {
        //contato
        const startDate: Date = new Date(e.StartDate);
        const closingDate: Date = new Date(e.ClosingDate);
        var daysInStep =
          Math.abs(startDate.getTime() - closingDate.getTime()) /
          (1000 * 60 * 60 * 24);
        daysInStep == 0 ? (daysInStep = 1) : null;
        setDaysInStep(
          objDays.contato == undefined
            ? (objDays.contato = 0 + daysInStep)
            : (objDays.contato += daysInStep)
        );
      }
      if (e.StageKey == "8") {
        //diagnostico
        const startDate: Date = new Date(e.StartDate);
        const closingDate: Date = new Date(e.ClosingDate);
        var daysInStep =
          Math.abs(startDate.getTime() - closingDate.getTime()) /
          (1000 * 60 * 60 * 24);
        daysInStep == 0 ? (daysInStep = 1) : null;
        setDaysInStep(
          objDays.diagnostico == undefined
            ? (objDays.diagnostico = 0 + daysInStep)
            : (objDays.diagnostico += daysInStep)
        );
      }
      if (e.StageKey == "7") {
        //teste
        const startDate: Date = new Date(e.StartDate);
        const closingDate: Date = new Date(e.ClosingDate);
        var daysInStep =
          Math.abs(startDate.getTime() - closingDate.getTime()) /
          (1000 * 60 * 60 * 24);
        daysInStep == 0 ? (daysInStep = 1) : null;
        setDaysInStep(
          objDays.teste == undefined
            ? (objDays.teste = 0 + daysInStep)
            : (objDays.teste += daysInStep)
        );
      }
      if (e.StageKey == "5") {
        //negociacao
        const startDate: Date = new Date(e.StartDate);
        const closingDate: Date = new Date(e.ClosingDate);
        var daysInStep =
          Math.abs(startDate.getTime() - closingDate.getTime()) /
          (1000 * 60 * 60 * 24);
        daysInStep == 0 ? (daysInStep = 1) : null;
        setDaysInStep(
          objDays.negociacao == undefined
            ? (objDays.negociacao = 0 + daysInStep)
            : (objDays.negociacao += daysInStep)
        );
      }
    });
    setDaysInStep(objDays);
    setFormattingDays(false);
  };

  useEffect(() => {
    const carregaTask = async () => {
      //const toastId = toast.loading("Carregando dados da Oportunidade");
      const task = await ajax({
        method: "POST",
        endpoint: "/task",
        data: { id: id },
      });
      if (task.status == "success") {
        //                toast.dismiss(toastId)
        setLoadingOp(false);
        toast.success("Oportunidade carregada");
        setTask(task.data);
        calculateDaysInEachStep(task.data);
        return;
      }
      if (task.status == "error") {
        setLoadingOp(false);
        //                toast.dismiss(toastId);
        toast.error(task.message);
        return;
      }
      setLoadingOp(false);
      //            toast.dismiss(toastId);
      toast.error("erro inesperado");
    };
    carregaTask();
  }, []);

  return (
    <>
      {
        //loadingOp ? <LoadingModal/> :
        <div className="bg-slate-100">
          <Tooltip id="tooltip-2" />
          <div className=" w-full flex  flex-col pb-4 bg-white shadow-md ">
            <h2 className="w-11/12 self-center flex justify-between">
              {loadingOp == false ? (
                task?.OpportunityName
              ) : (
                <Skeleton className="ml-6 mr-6" />
              )}{" "}
              <span className=" ">
                {" "}
                <span className="font-medium"> Número Oportunidade: </span>{" "}
                <span className="font-bold "> {task?.SequentialNo} </span>
              </span>
            </h2>
            {formattingDays ? (
              <Skeleton count={2} className="ml-6 mr-6" />
            ) : (
              <div className="flex w-11/12 self-center justify-self-center gap-2 ">
                <div
                  data-tooltip-id="tooltip-2"
                  data-tooltip-content="Qualificação"
                  className="flex h-8 cursor-pointer w-full"
                >
                  <div className="triangle-right-title-white absolute"></div>
                  <div className="w-full h-full bg-green-500 flex items-center justify-center text-white font-semibold">
                    {" "}
                    {daysInSteps.lead ? daysInSteps.lead + " Dias" : ""}{" "}
                  </div>
                  <div className="triangle-right-title-green "></div>
                </div>
                <div
                  data-tooltip-id="tooltip-2"
                  data-tooltip-content="Agendamento / Reunião"
                  className="flex h-8 cursor-pointer w-full"
                >
                  {" "}
                  <div className="triangle-right-title-white absolute"></div>{" "}
                  <div
                    className={`w-full ${
                      daysInSteps.contato ||
                      daysInSteps.diagnostico ||
                      daysInSteps.teste ||
                      daysInSteps.negociacao
                        ? "bg-green-500"
                        : " bg-custom-gray "
                    } flex items-center justify-center text-white font-semibold`}
                  >
                    {" "}
                    {daysInSteps.contato
                      ? daysInSteps.contato + " Dias"
                      : ""}{" "}
                  </div>
                  <div
                    className={`triangle-right-title-${
                      daysInSteps.contato ||
                      daysInSteps.diagnostico ||
                      daysInSteps.teste ||
                      daysInSteps.negociacao
                        ? "green"
                        : "grey"
                    }`}
                  ></div>
                </div>
                <div
                  data-tooltip-id="tooltip-2"
                  data-tooltip-content="Diagnóstico"
                  className="flex h-8 cursor-pointer w-full"
                >
                  {" "}
                  <div className="triangle-right-title-white absolute"></div>{" "}
                  <div
                    className={`w-full ${
                      daysInSteps.diagnostico ||
                      daysInSteps.teste ||
                      daysInSteps.negociacao
                        ? "bg-green-500"
                        : "bg-custom-gray"
                    } flex items-center justify-center text-white font-semibold`}
                  >
                    {" "}
                    {daysInSteps.diagnostico
                      ? daysInSteps.diagnostico + " Dias"
                      : ""}{" "}
                  </div>
                  <div
                    className={`triangle-right-title-${
                      daysInSteps.diagnostico ||
                      daysInSteps.teste ||
                      daysInSteps.negociacao
                        ? "green"
                        : "grey"
                    }`}
                  ></div>
                </div>
                <div
                  data-tooltip-id="tooltip-2"
                  data-tooltip-content="Teste"
                  className="flex h-8 cursor-pointer w-full"
                >
                  {" "}
                  <div className="triangle-right-title-white absolute"></div>{" "}
                  <div
                    className={`w-full  ${
                      daysInSteps.teste || daysInSteps.negociacao
                        ? "bg-green-500"
                        : "bg-custom-gray"
                    } flex items-center justify-center text-white font-semibold`}
                  >
                    {" "}
                    {daysInSteps.teste ? daysInSteps.teste + " Dias" : ""}{" "}
                  </div>
                  <div
                    className={`triangle-right-title-${
                      daysInSteps.teste || daysInSteps.negociacao
                        ? "green"
                        : "grey"
                    }`}
                  >
                    {" "}
                  </div>
                </div>
                <div
                  data-tooltip-id="tooltip-2"
                  data-tooltip-content="Proposta de Valor"
                  className="flex h-8 cursor-pointer w-full"
                >
                  {" "}
                  <div className="triangle-right-title-white absolute"></div>{" "}
                  <div
                    className={`w-full ${
                      daysInSteps.negociacao ? "bg-green-500" : "bg-custom-gray"
                    } flex items-center justify-center text-white font-semibold`}
                  >
                    {" "}
                    {daysInSteps.negociacao
                      ? daysInSteps.negociacao + " Dias"
                      : ""}{" "}
                  </div>
                  <div
                    className={`triangle-right-title-${
                      daysInSteps.negociacao ? "green" : "grey"
                    }`}
                  >
                    {" "}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className=" max-w-full h-full bg-gray-100 mt-4">
            <div
              className={` max-w-full rounded-md h-auto bg-white shadow-lg mb-6 flex gap-4 items-center border ${
                loadingOp ? "hidden" : ""
              } `}
            >
              <div
                onClick={() => setActiveTab(1)}
                className={`flex items-center gap-4 rounded-l-md  cursor-pointer px-6  ${
                  activeTab == 1 ? "bg-custom-dark-green customTopBorder" : ""
                }`}
              >
                <ImProfile size={30} />
                <p className="text-xl ">Geral</p>
              </div>

              <div
                onClick={() => setActiveTab(2)}
                className={`flex items-center gap-4 cursor-pointer px-6 ${
                  activeTab == 2 ? "bg-custom-dark-green customTopBorder" : ""
                } `}
              >
                <MdLocalActivity size={30} />
                <p className="text-xl ">Atividades</p>
              </div>
              <div
                onClick={() => setActiveTab(3)}
                className={`flex items-center gap-4 px-6 cursor-pointer ${
                  activeTab == 3 ? "bg-custom-dark-green customTopBorder" : ""
                }`}
              >
                <FaMoneyBillWave size={30} />
                <p className="text-xl">Cotações</p>
              </div>
              <div
                onClick={() => setActiveTab(4)}
                className={`flex items-center gap-4 px-6 cursor-pointer ${
                  activeTab == 4 ? "bg-custom-dark-green customTopBorder" : ""
                }`}
              >
                <GrSteps size={30} />
                <p className="text-xl">Etapas</p>
              </div>
              <div
                onClick={() => setActiveTab(5)}
                className={`flex items-center gap-4 px-6 cursor-pointer ${
                  activeTab == 5 ? "bg-custom-dark-green customTopBorder" : ""
                }`}
              >
                <FaRegNoteSticky size={30} />
                <p className="text-xl">Notas</p>
              </div>
            </div>

            <div className=" p-4 max-w-full h-full pb-12 bg-white shadow-lg rounded-md ">
              {!loadingOp ? (
                activeTab == 1 ? (
                  <Geral task={task} />
                ) : activeTab == 2 ? (
                  <Atividades task={task} />
                ) : activeTab == 3 ? (
                  <Cotacoes task={task} />
                ) : activeTab == 4 ? (
                  <Etapas task={task} />
                ) : activeTab == 5 ? (
                  <Notes task={task} />
                ) : activeTab == 6 ? (
                  <h1>Anexos</h1>
                ) : (
                  <h1>Erro</h1>
                )
              ) : (
                <LoadingModal />
              )}
            </div>
          </div>
          <Toaster />
        </div>
      }
    </>
  );
}
