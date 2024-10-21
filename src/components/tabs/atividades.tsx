import { task } from "../../pages/opportunity"
import { FaCircleInfo } from "react-icons/fa6";
import { Atividade } from "../atividade";
import { BtnRapidas } from "../BtnRapidas";
import { IoIosChatbubbles } from "react-icons/io";
import { GiMoneyStack } from "react-icons/gi";
import { MdConnectWithoutContact } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import { GrnBtn } from "../greenBtn";
import { IoMdAddCircle } from "react-icons/io";
import { Input } from "../input";
import { CiSearch } from "react-icons/ci";
import { useEffect, useState } from "react";
import { ajax } from "../../ajax/ajax";
import toast from 'react-hot-toast';
import { ModalNovoTicket } from "../modalNovoTicket";
import { RxValueNone } from "react-icons/rx";
import { IoIosRemoveCircle } from "react-icons/io";
import { Tooltip } from 'react-tooltip'
import { LoadingModal } from "../modalLoading";
import { ModalConteudo } from "../modalConteudo";
import { EndTicket } from "../modalEndTicket"; 
interface atividadeFields {
    ClgCode: string;
    lastName: string;
    firstName: string;
    Details: string;
    Notes: string;
    CreateDate: string;
    CntctDate: string;
    dept: string;
    NomeAssunto: string;
    Closed: string;
    AssignedBy: string;
    AttendUser: string;
    NomeAtribuidor: string;
    UltimoNomeAtribuidor: string;
    idAtribuidor: string;
}


export function Atividades({task}: {task?: task}) {
    const [atividades, setAtividades] = useState<atividadeFields[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [showNewTicket, setShowNewTicket] = useState<boolean>(false) 
    const [loadingTickets, setLoadingTickets] = useState<boolean>(false);
    const [showModalConteudo, setShowModalConteudo] = useState<boolean>(false);
    const [modalConteudo, setModalConteudo] = useState<string>("");
    const [tituloAtual, setTituloAtual] = useState<string>("Enviar Ticket");
    const [modalData, setModalData] = useState<string>("");
    const [tipoAtual, setTipoAtual] = useState<string>("conteudo");
    const [dataQuickAction, setDataQuickAction] = useState<any>({});
    const [showEndTicket, setShowEndTicket] = useState<boolean>(false);
    const [closingTicketData, setClosingTicketData] = useState<any>(null);
    const handlePedirAcao = async (atividade: string, tipo: string, numeroResultado: string) => {
        if (tipo !== "nada") {
            setShowModalConteudo(true);
            setTipoAtual(tipo);
            setTituloAtual(atividade);
        }

        const dataObj: any = {
            atividade: atividade,
            cardcode: task?.CardCode,
            canal: "4",
            resultado: numeroResultado
        }

        if (tipo == "conteudo") {
            dataObj.conteudo = modalConteudo
        }
        if (tipo == "data") {
            dataObj.data = modalData;
        }
        if (tipo == "nada") {
            dataObj.desativado = 'sim';
        }
        setDataQuickAction(dataObj);
        if (tipo == "nada") {
            enviaTicket();
        }
    }   


    const enviaTicket = async () => {
        toast.dismiss();
        toast.loading("Enviando Ticket");
        const response = await ajax({method: "POST", endpoint: "/atividades/atividadesRapidas", data: dataQuickAction})
        toast.dismiss();
        if (!response) {
            toast.error("Erro ao enviar ticket")
            return;
        }
        if (response.status == "error") {
            toast.error("Erro ao enviar ticket")
            return;
        }
        if (response.status == "success") {
            toast.success("Ticket enviado!");
            return;
        }

        toast.error("Erro ao enviar ticket")
        setShowModalConteudo(false);
    }

    const adicionarNovoTicket = () => {
        setShowNewTicket(true);
    }
    const finalizarTicket = (ticketData: any) => {
        setClosingTicketData(ticketData);
        setShowEndTicket(true);
    }

    const handleModalConteudoChange = (e: string) => {
        setModalConteudo(e);
        const newObject = dataQuickAction;
        newObject.conteudo = e;
        newObject.data = undefined;
        setDataQuickAction(newObject);
        
    }
    const handleDataModalChange = (e: string) => {
        setModalData(e);
        const newObject = dataQuickAction;
        newObject.data = e;
        newObject.conteudo = undefined;
        setDataQuickAction(newObject);

    }


    const alterShow = () => {
        setShowModalConteudo(!showModalConteudo);
    }


    const carregaAtividades = async (filter: string) => {
        setLoadingTickets(true);
        toast.dismiss();
        if (filter.length == 0) {
            toast.loading("Carregando atividades...");
        }
        const response = await ajax({method: "POST", endpoint: "/atividades", data: {filter: filter, cardcode: task?.CardCode}});
        if (!response) {
            toast.dismiss();
            toast.error("erro ao carregar atividades");
            setLoadingTickets(false);
            return;
        }
        if (response.status == 'error') {
            toast.dismiss();
            toast.error("erro ao carregar atividades");
            setLoadingTickets(false);
            return;
        }
        if (response.status == 'success') {
            toast.dismiss();
            if (response.data.length === 1 && JSON.stringify(response.data[0]) === '{}') {
                if (filter.length == 0) {
                toast.success("Atividades carregadas com sucesso!");
                }
                setLoadingTickets(false);
                return;    
            }
            setAtividades(response.data);
            if (filter.length == 0) {
            toast.success("Atividades carregadas com sucesso!");
            }
            setLoadingTickets(false);
            return;
        }
        toast.dismiss();
        toast.error("Erro inesperado!");
        setLoadingTickets(false);
        return;
    }

    const handleCloseNewTicketModal = () => {
        setShowNewTicket(!showNewTicket);
        carregaAtividades("");
    }
    const handleCloseEndTicketModal = () => {
        setShowEndTicket(!showEndTicket)
        carregaAtividades("");
    }
    useEffect(() => {
        carregaAtividades("");
    }, [])

    useEffect(() => {
        if (filter.length >= 2  || filter.length == 0) {
            carregaAtividades(filter);
        } 
    }, [filter])





    return (
        <>
        <ModalConteudo show={showModalConteudo} fechaModal={alterShow} atualizaModal={handleModalConteudoChange} atualizaDataModal={handleDataModalChange} titulo={tituloAtual} tipo={tipoAtual} enviaTicket={enviaTicket}/>
        { showNewTicket ?  <ModalNovoTicket CardCode={task?.CardCode} onClose={() => handleCloseNewTicketModal()} /> : "" }
        { showEndTicket ? <EndTicket  onClose={() => handleCloseEndTicketModal()} ticketData={closingTicketData} /> : "" }
        <div>
            <div className=" hidden flex flex-col customBorder shadow-md p-2 rounded-md   " >
                <div className="flex items-center gap-4" >
                    <h1 className="m-0 ml-2">
                        Ações Rápidas
                    </h1>
                   <FaCircleInfo data-tooltip-id="tooltip-6" data-tooltip-content="As ações rápidas são requisições/informações repassados para internos através da agenda!" />
                </div>
                <div className=" flex justify-between w-2/3  mt-4 px-12 py-4 self-center   ">
                    <div data-tooltip-id="tooltip-6" data-tooltip-content="Solicitar ao cac que agende uma visita para o cliente" ><BtnRapidas nome="Solicitar Visita com o cliente" icon={<IoIosChatbubbles size={25} />} onClick={() => handlePedirAcao("Agendar Visita", "data", "77")} /></div>
                    <div className="hidden" >
                        <BtnRapidas bgColor="red-500" nome="Solicitar reunião com o cliente" icon={<GiMoneyStack size={30} />} onClick={() =>handlePedirAcao("Agendar reunião", "data", "77")} />
                        <BtnRapidas bgColor="amber-500" nome="Realizei Visita" icon={<MdConnectWithoutContact  size={30} />} onClick={() => handlePedirAcao("Realizei Visita", "conteudo", "72")} />
                        <BtnRapidas bgColor="blue-500" nome="Realizei Reunião" icon={<FaHandshake  size={30} />} onClick={() => handlePedirAcao("Realizei Reunião", "conteudo", "73")} />
                        <BtnRapidas bgColor="slate-500" nome="Tirar cliente da agenda" icon={<IoIosRemoveCircle   size={30} />} onClick={() => handlePedirAcao("Retirar Cliente", "nada", "0")} />
                    </div>
                </div>
            </div>
            <div className="  box-border" >
                <div className=" flex justify-between mb-2 items-end" >
                    <GrnBtn nomeBtn="Novo Atendimento" onClick={() => adicionarNovoTicket()} icon={<IoMdAddCircle />} customCss="h-10" />
                    <div className="w-4/12" >
                        <Input valueHandler={(e) => setFilter(e.target.value)} placeholder="Pesquise por atividades / tickets" name="filter" icon={<CiSearch size={20} />} insidePlaceholder="Fulano de tal" />
                    </div>
                </div>
                <div key={0} style={{ maxHeight: "80vh" }} className=" w-full flex  flex-col gap-0.5 bg-custom-gray rounded-md customBorder shadow-sm p-2 box-border overflow-y-scroll overflow-x-hidden" >
                    <div className="flex gap-2  w-full px-2 mb-2 " >
                        <h2 className="m-0 w-1/6 ">Atividade</h2>
                        <h2 className="m-0 w-1/6">Data</h2>
                        <h2 className="m-0 w-1/6">Usuário/Vendedor</h2>
                        <h2 className="m-0 w-2/6">Resultado/Conteúdo</h2>
                        <h2 className="m-0 w-1/6">Assunto</h2>
                    </div>
                    {loadingTickets ? <LoadingModal/> : (
                    atividades.length === 0 ? (
                        <div style={{ height: "80vh" }} className="w-full flex flex-col items-center justify-center">
                            <RxValueNone size={120} />
                            <p className="font-semibold text-xl">Esse cliente não possui tickets</p>
                        </div>
                    ) : (
                        atividades.map((ativ, index) => {
                            const nomeAtribuidor = ativ.firstName + " " + ativ.lastName;
                            return (
                                <Atividade 
                                finalizarTicket={() => finalizarTicket({id_ticket: ativ.ClgCode, mensagem: ativ.Notes})}
                                keyNum={index + 1} 
                                bg={index % 2 !== 0 ? "custom-gray" : "white"} 
                                numeroAtiv={ativ.ClgCode}
                                dataContact={ativ.CntctDate} 
                                dataCreate={ativ.CreateDate} 
                                mensagem={ativ.Notes} 
                                vendedor={`${ativ.firstName} ${ativ.lastName}`} 
                                assunto={ativ.NomeAssunto}
                                fechada={ativ.Closed}
                                atribuidor={ativ.idAtribuidor}
                                atribuido={ativ.AttendUser}
                                nomeAtribuidor={nomeAtribuidor}
                                />
                            )
                            
                        })
                    )
                )}
                </div>
            </div>
            <Tooltip id="tooltip-6" />
        </div>
        </>
    )
}