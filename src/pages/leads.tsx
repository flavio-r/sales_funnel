import { useState } from "react";
import { GeralLead } from "../components/leadTabs/geral";
import { NotesLead } from "../components/leadTabs/notas";
import { useParams } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FaRegNoteSticky } from "react-icons/fa6";
import { useEffect } from "react";
import { ajax } from "../ajax/ajax";
import { DadosCliente } from "../components/leadTabs/dadosCliente";
import toast, { Toaster } from 'react-hot-toast';
import { BsPersonBoundingBox } from "react-icons/bs";
import { Tooltip } from 'react-tooltip'
import { MdUpload } from "react-icons/md";
import { GrnBtn } from "../components/greenBtn";
import { useNavigate } from "react-router-dom";
import { RiProhibitedLine } from "react-icons/ri";
import { LoadingModal } from "../components/modalLoading";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export interface task {
    card: {
        id_card: string;
        titulo: string;
        valor_estimado: string;
        pessoa_contato: string;
        anotacoes: string;
        ativo: string;
        data_criacao: string;
        email_contato: string;
        empresa: string;
        telefone_contato: string;
        vendedor: string;
        data_prevista: string;
    }[];
    informacoes: {
        id_card: number;
        cidade: string | null;
        bairro: string | null;
        pais: string | null;
        estado: string | null;
        cep: string | null;
        segmento: string | null;
        cnpj: string | null;
        cpf: string | null;
        email: string | null;
        forma_pgto: string | null;
        razao_fantasia: string | null;
        razao_social: string | null;
        regiao: string | null;
        telefone: string | null;
        rua: string | null;
        tipoCliente?: string;
        numero: string;
        municipio: string | null;
        CardCode: string | null;
    }[];
}




export interface estado {
    Code: string;
    Country: string;
    Name: string;
}
export interface municipio {
    AbsId: number;
    Code: string;
    Country: string;
    State: string;
    Name: string;
}


export function Leads() {
    const [activeTab, setActiveTab] = useState(1);
    const [task, setTask] = useState<task>();
    const [loadingLead, setLoadingLead] = useState<boolean>(true);
    const [errors, setErrors] = useState<any>({});
    const [validationAllFields, setValidationAllFields] = useState<boolean>(false);
    const [validatedFields, setValidatedFields] = useState<any>();
    const [isValidated, setIsValidated] = useState<boolean>(false);
    const [estados, /*setEstados*/] = useState<estado[]>([])
    const [municipios, setMunicipios] = useState<municipio[]>([])

    //Só pra ele não apitar not used
    console.log(errors)
    console.log(validationAllFields)

    var currentDate: Date = new Date();
    var startDate: Date | undefined | null = task?.card[0].data_criacao ? new Date(task?.card[0].data_criacao) : null;
    var daysInStep = startDate ? Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    if (daysInStep == 0) {
        daysInStep = 1;
    }




    const navigate = useNavigate();
    const { id } = useParams<string>();

    const alertNotAllFields = () => {
        console.log(validatedFields);
        //toast.error("Há campos a serem preenchidos!");
        toast.error("Código do cliente não encontrado!");
        if (validatedFields.data_prevista || validatedFields.titulo || validatedFields.valor_estimado) {
            setActiveTab(1);
            return;
        }
        setActiveTab(2)

    }


    const onSubmitRegisterLead = async () => {
        setErrors({});
        toast.dismiss();
        toast.loading("Cadastrando Cliente SAP");

        const response = await ajax({ method: "POST", endpoint: "/leads/registerLead", data: { id_card: id } });



        if (response.status == "error") {
            toast.dismiss();
            if (Array.isArray(response.message)) {
                const errorMsgs = response.message;
                errorMsgs.forEach((msg: any) => {
                    setErrors((prevErrors: any) => ({ ...prevErrors, [msg.path]: msg.msg }));
                });
                return;
            }
            toast.error(response.message);
            return;
        }

        if (response.status == 'success') {
            navigate("/")
        }


    };

    const carregaMunicipios = async (CodEstado?: string) => {
        let endpointMunicipios = "/leads/municipios";
        if (CodEstado) {
            endpointMunicipios = `/leads/municipios?estado=${CodEstado}`
        }

        const municipios = await ajax({ method: "GET", endpoint: endpointMunicipios, data: null });

        if (municipios.status == "success") {
            setMunicipios(municipios.data)
            return;
        }
        if (municipios.status == 'error') {
            toast.error(municipios.message)
            return;
        }
    }
    /*
    const carregaEstados = async () => {
        const estados = await ajax({ method: "GET", endpoint: "/leads/estados", data: null });

        if (estados.status == "success") {
            setEstados(estados.data)
            return;
        }
        if (estados.status == 'error') {
            toast.error(estados.message)
            return;
        }
    }
        */
    const checkFields = async () => {
        setValidationAllFields(true);
        setValidatedFields({})
        var response;
        try {
            response = await ajax({ method: "POST", endpoint: "/leads/checkCardCode", data: { id_card: id } });
        }
        catch (err) {
            setValidationAllFields(false);
        }

        if (!response) {
            setValidationAllFields(false);
            return;
        }
        if (response.status == 'error') {
            setValidatedFields(response.message);
            setValidationAllFields(false);
            return; 
        }
        if (response.status == 'success') {
            setValidationAllFields(false);
            setIsValidated(true);
            return;
        }
        setValidationAllFields(false);
    }


    const carregaTask = async () => {
        const toastId = toast.loading("Carregando dados do lead");
        const task = await ajax({ method: "POST", endpoint: "/lead", data: { id: id } });
        if (task.status == "success") {
            toast.dismiss(toastId)
            toast.success("Potencial carregado!");
            setTask(task.data);
            setLoadingLead(false);
            return;
        }
        if (task.status == 'error') {
            toast.dismiss(toastId)
            toast.error(task.message)
            setLoadingLead(false);
            return;
        }
        setLoadingLead(false);
    }

    useEffect(() => {
        carregaTask();
        checkFields();
        //carregaEstados();
        //carregaMunicipios()
    }, []);





    return (
        <>
            { //loadingLead ? <LoadingModal/> :  
                <div>
                    <div className=" w-full flex  flex-col pb-4 bg-white shadow-md ">
                        {loadingLead ? <Skeleton /> :
                            <div className="w-11/12 flex self-center justify-between " >
                                <h2 className="">{task?.card[0].titulo || <Skeleton />}</h2>
                                <div className="flex items-center h-20" data-tooltip-id="tooltip-4" data-tooltip-content="Ao selecionar esse botão, será criado uma oportunidade para esse cliente e o potencial será alterado para uma oportunidade em Qualificação!" ><GrnBtn disabled={isValidated ? false : true} customCss={isValidated ? "" : "bg-slate-500 hover:scale-100 hover:bg-slate-500"} form="addLead" type="submit" median={true} big={false} nomeBtn="Transformar em oportunidade!" icon={isValidated ? <MdUpload size={30} /> : <RiProhibitedLine size={30} />} onClick={isValidated ? onSubmitRegisterLead : alertNotAllFields} /></div>
                            </div>
                        }
                        {
                            loadingLead ? <Skeleton /> :
                                <div className="flex w-11/12 self-center justify-self-center gap-2 ">
                                    <div data-tooltip-id="tooltip-4" data-tooltip-content="Qualificação" className="flex h-8 cursor-pointer w-full"><div className="triangle-right-title-white absolute" ></div><div className="w-full h-full bg-green-500 flex items-center justify-center text-white font-semibold"> {daysInStep} Dias </div><div className="triangle-right-title-green " ></div></div>
                                    <div data-tooltip-id="tooltip-4" data-tooltip-content="Agendamento / Reunião" className="flex h-8 cursor-pointer w-full"> <div className="triangle-right-title-white absolute" ></div> <div className={`w-full bg-custom-gray flex items-center justify-center text-white font-semibold`}></div><div className="triangle-right-title-grey" ></div></div>
                                    <div data-tooltip-id="tooltip-4" data-tooltip-content="Diagnóstico" className="flex h-8 cursor-pointer w-full"> <div className="triangle-right-title-white absolute" ></div> <div className={`w-full bg-custom-gray flex items-center justify-center text-white font-semibold`}></div><div className="triangle-right-title-grey" ></div></div>
                                    <div data-tooltip-id="tooltip-4" data-tooltip-content="Teste" className="flex h-8 cursor-pointer w-full"> <div className="triangle-right-title-white absolute" ></div> <div className={`w-full bg-custom-gray`}> </div><div className="triangle-right-title-grey" ></div></div>
                                    <div data-tooltip-id="tooltip-4" data-tooltip-content="Proposta de Valor" className="flex h-8 cursor-pointer w-full"> <div className="triangle-right-title-white absolute" ></div> <div className={`w-full bg-custom-gray`}> </div><div className="triangle-right-title-grey" ></div></div>
                                </div>
                        }
                    </div>
                    <hr className="m-0 p-0" />
                    <div className="p-2 max-w-full bg-gray-100">
                        {loadingLead ? <Skeleton /> :
                            <div className=" max-w-full rounded-md h-auto bg-white shadow-lg mb-6 flex gap-4 items-center border">
                                <div onClick={() => setActiveTab(1)} className={`${activeTab == 1 ? "bg-custom-dark-green customTopBorder" : ""} flex items-center gap-4 cursor-pointer px-6`}>
                                    <ImProfile size={30} />
                                    <p className="text-xl ">Geral</p>
                                </div>
                                <div onClick={() => setActiveTab(2)} className={`${activeTab == 2 ? "bg-custom-dark-green customTopBorder" : ""} flex items-center gap-4 cursor-pointer px-6`}>
                                    <BsPersonBoundingBox size={30} />
                                    <p className="text-xl">Dados Cliente</p>
                                </div>
                                <div onClick={() => setActiveTab(3)} className={`${activeTab == 3 ? "bg-custom-dark-green customTopBorder" : ""} flex items-center gap-4 cursor-pointer px-6`}>
                                    <FaRegNoteSticky size={30} />
                                    <p className="text-xl">Notas</p>
                                </div>
                            </div>
                        }

                        <div className=" p-4 max-w-full h-full bg-white shadow-lg rounded-md ">
                            {
                                loadingLead ?
                                    <LoadingModal />
                                    :

                                    activeTab == 1 ? <GeralLead task={task} errors={validatedFields} /> :

                                        activeTab == 2 ? <DadosCliente errorsRegister={validatedFields} task={task} estados={estados} municipios={municipios} selecionaEstado={carregaMunicipios} /> :
                                            activeTab == 3 ? <NotesLead task={task} /> :
                                                <h1>Erro</h1>
                            }
                        </div>
                    </div>
                    <Tooltip id="tooltip-4" />
                    <Toaster />
                </div>
            }
        </>
    )
}