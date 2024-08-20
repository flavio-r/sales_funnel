import { useState, useRef  } from "react";
import { Input } from "./input";
import { z } from 'zod';
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WhiteBtn } from "./whiteBtn";
import { MdCancel } from "react-icons/md";
import { BsPersonBoundingBox } from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa";
import { Tooltip } from 'react-tooltip'
import { useEffect } from "react";
import { ImSpinner8 } from "react-icons/im";
import toast, { Toaster } from 'react-hot-toast';
import { ajax } from "../ajax/ajax";
import { LoadingModal } from "./modalLoading";
import 'react-quill/dist/quill.snow.css'; // Importe o estilo do editor
import { SelectDados } from "./selectDados";
import { useContext } from "react";
import { AuthContext } from "../context/authProvider";
const isAfterToday = (value: any) => {
    const today = new Date();
    const selectedDate = new Date(value);
    return selectedDate >= today;
};

const schema = z.object({
    titulo: z.string().min(1, "Título é obrigatório"),
    codCliente: z.string().min(1, "Código do cliente é obrigatório"),
    valorEstimado: z.string().min(1, "Valor estimado é obrigatório"),
    dataPrevista: z.string().min(1, "Data de Prevista é obrigatória").refine(isAfterToday, {
      message: "A data prevista deve ser posterior à data atual",
    }),
    atribuido: z.string().optional(),
});

type FormData = z.infer<typeof schema>

interface cliente {
    nome: string;
    codigo: string;
}

export interface colaborador {
    NomeColaborador: string;
    CodigoVendedorColaborador: string;
}


export function AddOportunity({atualizaEstadoModal, mostrarModal, isGestor = false} : {atualizaEstadoModal: () => void, mostrarModal: boolean, isGestor?: boolean}) {
    const [isOpen, setIsOpen] = useState(mostrarModal);
    const [addLoading, setAddLoading] = useState<boolean>(false);
    const [etapa, setEtapa] = useState<number>(1);
    const [quillValue, setquillValue] = useState<string>(''); 
    const [renderToaster, setRenderToaster] = useState<boolean>(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [clientes, setClientes] = useState<Array<cliente>>([]);
    const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
    const [colaboradoresData,  setColaboradoresData] = useState<colaborador[]>([]);

    const abortControllerRef = useRef<AbortController | null>(null);

    const { user } = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors }} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onSubmit"
    })


    function acertaEtapaSap(etapa: number) {
        switch(etapa) {
            case 1:
                return 6;
            case 2:
                return 3;
            case 3:
                return 8;
            case 4:
                return 7;
            case 5:
                return 5;
        }
    }


    async function onSubmit(data: FormData) {
        setRenderToaster(true)
        setAddLoading(true);
        toast.dismiss();
        toast.loading('Salvando...');
        const etapaSap = acertaEtapaSap(etapa);
        
        const codigoCliente: any = document.getElementById("codigoCliente");
        var dataObj
        if (codigoCliente) {
            dataObj = {
                titulo: data.titulo,
                codCliente: codigoCliente.value,
                valorEstimado: data.valorEstimado,
                dataPrevista: data.dataPrevista,
                notas: quillValue,
                etapa: etapaSap,
                atribuido: data.atribuido
            }
        }
        if (!codigoCliente) {
            toast.error("Erro ao adicionar oportunidade!");
            return;
        }
        
        var response: any;

        const valueFormattedBrazilianStyle = data.valorEstimado.replace(".", "").replace(",", ".");
        if (!dataObj) {
            return;
        }
        dataObj.valorEstimado = valueFormattedBrazilianStyle;

        response = await ajax({method: "POST", endpoint: "/task/add", data: dataObj});
        
        
        if (response.status == 'error') {
            setAddLoading(false);
            toast.dismiss();
            if (Array.isArray(response.message)) {
                const errorMsgs = response.message;
                errorMsgs.forEach((msg: any) => {
                    if (typeof msg.msg == "string") {
                        toast.error(msg.msg);
                    }
                });
                return
            }
            if (typeof response.message == "string") {
                toast.error(response.message);  
                return;
            }
            toast.error("Erro inesperado");
            return;
        }
        
        if (response.status == 'success') {
            setAddLoading(false);
            toast.dismiss();
            if (typeof response.message == "string") {
                toast.success(response.message);
            }
            setRenderToaster(false)
            atualizaEstadoModal();
            setTimeout(() => {}, 100)
            setIsOpen(false);
            window.location.reload();
            return;
        }

        setAddLoading(false);
        toast.dismiss();
        toast.error("Erro inesperado");
    }

    const getColaboradores = async () => {
        const response = await ajax({method: "GET", endpoint: "/colaboradores/todos", data: null});
        if (!response.status) {
            toast.error("Erro inesperado");
            return;
        }
        if (response.status == "error") {
            if (typeof response.message == "string") {
                toast.error(response.message);
                return;
            }
            toast.error("Erro ao buscar colaboradores")
            return;
        }
        if (response.status == "success") {
            setColaboradoresData(response.data);
        }
    }


    const handleCodigoCliente = async (e: any) => {
        const value = e.target.value;
        if (value.length < 3) {
            setClientes([]);
            return;
        }
    
        setLoadingSearch(true);
        
        // Cancel the previous request if there's one
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    
        // Create a new AbortController for the current request
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
    
        try {
            const response = await ajax({
                method: "POST", 
                endpoint: "/clientes/todos", 
                data: { CardCode: value },
                signal: abortController.signal // Pass the signal to ajax
            });
            setLoadingSearch(false);
            
            setClientes([]);
    
            if (!response) {
                //toast.error("Erro inesperado");
                return;
            }
    
            if (response.status == "Error") {
                if (typeof response.message == "string") {
                    toast.error(response.message);
                    return    
                }
                return;
            }
    
            if (response.status == "success") {
                const data = response.data;
                if (Array.isArray(data) && data.length === 1 && Object.keys(data[0]).length === 0) {
                    toast.error("Nenhum cliente encontrado com esse código!");
                    return;
                }
                const newArray = data.map((e: {CardName: string, CardCode: string}) => ({
                    nome: e.CardName,
                    codigo: e.CardCode
                }));
                setClientes(newArray);
                return;
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Request was aborted');
            } else {
                toast.error("Erro inesperado");
            }
            setLoadingSearch(false);
        }
    };
    
    

    const handleClose = () => {
        setIsOpen(false);
        atualizaEstadoModal();
    }
    
    
    useEffect(() => {
        setIsOpen(mostrarModal);
    }, [mostrarModal])
    

    useEffect(() => {
        if (isOpen) {
            if (isGestor) {
                getColaboradores();
            }
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);


    const handleDebouncedClick = (e: any) => {
        if (isWaiting) {
            e.preventDefault();
            return;
        }
        setIsWaiting(true);
        setTimeout(() => {
            setIsWaiting(false);
        }, 1000);
    }


    const handleClickFoundClient = (CardCode: string) => {
        //This is is kinda "Cheating" but the fastest / easiest way to do it"
        const inputCodigoCliente = document.getElementById("codigoCliente") as HTMLInputElement;
        if (inputCodigoCliente) {
            inputCodigoCliente.value = CardCode
            inputCodigoCliente.innerHTML = CardCode;
        }
        setClientes([]);
    }

    

    

    return (
        <div className={` ${isOpen ? "" : "hidden"} modalAdd w-screen h-screen bg-opacity-50 bg-black overflow-hidden  absolute flex items-center justify-center z-50 ${isOpen ? "show" : "enter"} `} >
            <div className={`bg-white ${isOpen ? "slide-up" : "slide-down"}   w-3/6 rounded-md shadow-md flex flex-col`} >
                <div className="w-full h-20 flex items-center justify-between  bg-white rounded-md">
                    <p className="font-bold text-xl ml-6">Adicionar Oportunidade</p>
                    <div className="mr-6" onClick={() => handleClose()}   ><WhiteBtn nomeBtn="Fechar" icon={<MdCancel />}/></div>
                </div>
                <hr className="m-0 bg-custom-gray border-custom-gray " />
                <form id="addOp" action="" onSubmit={handleSubmit(onSubmit)} className="flex h-9/12 w-full px-8 py-4 box-border mb-4  justify-between gap-4">
                    <div className="flex flex-col w-1/2 h-full box-border">
                        <Input customCss="h-1/2" insidePlaceholder="Título da oportunidade" placeholder="Título" name="titulo" error={ errors.titulo?.message } register={register} ></Input>
                        <div>

                        <Input id="codigoCliente" valueHandler={(e) => handleCodigoCliente(e)} insidePlaceholder="C000000 ou Nome do cliente" placeholder="Código do cliente" icon={<BsPersonBoundingBox />} name="codCliente" error={ errors.codCliente?.message } register={register}></Input>
                        <div className="relative z-40 " >
                            <div className={` box-border absolute z-50 w-80 flex flex-col bg-white shadow-md ${ clientes.length > 0 ? "customBorder" : "" } mt-1 rounded-md`} >
                            {
                                loadingSearch ? 

                                <div >
                                    <LoadingModal/>
                                </div>

                                :

                                clientes.map((e)  => {
                                    console.log(clientes);
                                    return (
                                        <div onClick={() => handleClickFoundClient(e.codigo)} key={e.codigo} className={` cursor-pointer hover:bg-slate-100 bg-white py-1 px-2  flex items-center justify-center font-semibold transition-all duration-300 hover:bg-shadow-md `} >
                                            <p>{e.codigo} - {e.nome}</p>
                                	     </div>
                                    )
                                })
                            }
                            
                            </div>
                        </div>
                        </div>
                        <Input insidePlaceholder="20000" type="number" placeholder="Valor Estimado" icon={<FaMoneyBillWave />} name="valorEstimado" error={ errors.valorEstimado?.message } register={register}></Input>
                        <div className="flex flex-col pb-6" >
                            <p className="m-0 mb-1 font-semibold mt-2">Etapa</p>
                            <div className="flex">
                            <Tooltip id="tooltip-1" />
                            <div data-tooltip-id="tooltip-1" data-tooltip-content="Qualificação" className="flex" onClick={() => setEtapa(1)} ><button type="button" className={`w-6 h-6 border-none rounded-sm ${ etapa >= 1 ? "bg-green-500" : "" }`}  ></button><div className={ etapa >= 1 ? `triangle-right` : `triangle-right-grey`}></div></div>
                            <div data-tooltip-id="tooltip-1" data-tooltip-content="Agendamento / Reunião" className="flex" onClick={() => setEtapa(2)}> <div className="triangle-right-white absolute"></div><button type="button" className={`w-10 h-6 border-none rounded-sm ${ etapa >= 2 ? "bg-green-500" : "" }`} ></button><div className={etapa >= 2 ? `triangle-right` : `triangle-right-grey`}></div></div>
                            <div data-tooltip-id="tooltip-1" data-tooltip-content="Diagnóstico" className="flex" onClick={() => setEtapa(3)}> <div className="triangle-right-white absolute"></div><button type="button" className={`w-10 h-6 border-none rounded-sm ${ etapa >= 3 ? "bg-green-500" : "" }`} ></button><div className={etapa >= 3 ? `triangle-right` : `triangle-right-grey`}></div></div>
                            <div data-tooltip-id="tooltip-1" data-tooltip-content="Teste" className="flex" onClick={() => setEtapa(4)}> <div className="triangle-right-white absolute"></div><button type="button" className={`w-10 h-6 border-none ${ etapa >= 4 ? "bg-green-500" : "" }`} ></button><div className={etapa >= 4 ? `triangle-right` : `triangle-right-grey`}></div></div>
                            <div data-tooltip-id="tooltip-1" data-tooltip-content="Proposta de Valor" className="flex" onClick={() => setEtapa(5)}> <div className="triangle-right-white absolute"></div> <button type="button" className={`w-10 h-6 border-none ${ etapa >= 5 ? "bg-green-500" : "" }`} ></button><div className={etapa >= 5 ? `triangle-right` : `triangle-right-grey`}></div></div>
                            </div>
                        </div>
                        <Input type="date" placeholder="Data prevista de conclusão da etapa" customCss="mt-2" insidePlaceholder="DD/MM/YYYY" name="dataPrevista" error={ errors.dataPrevista?.message } register={register}></Input>                   
                        { isGestor ? 
                        <SelectDados preValue={user.id} placeholder="Atribuição" name="atribuido"  register={register} tipo="colaboradores" colaboradores={colaboradoresData} />
                        :
                        null
                        }
                        </div>
                        <div className=" flex flex-col w-1/2">
                            <div className="mt-6 h-full box-border w-full mb-4">
                                <p className="m-0 font-semibold" >Anotações</p>
                                <textarea  onChange={(e) => setquillValue(e.target.value)} value={quillValue}  className={` p-2 box-border w-full h-full rounded-md customBorder shadow-md focus:outline-none `}  />
                            </div>
                    </div>  
                </form>
                <hr className="m-0 border-custom-gray" />
                <div className=" flex items-center justify-between h-20 w-full " >
                    <button onClick={() => handleClose()} className=" hover:scale-105 ml-12 h-10 w-28 customRedBorder outline-none bg-white rounded-md font-semibold text-red-500 cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300 ">Cancelar</button>
                    <button form="addOp" onClick={handleDebouncedClick} type="submit" className=" hover:scale-105 mr-12 h-10 w-28 rounded-md border-none bg-green-500 text-white font-semibold text-lg  cursor-pointer hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg flex gap-4 items-center justify-center">{addLoading ? "Salvando" : "Salvar"}{addLoading ? <ImSpinner8 className='animate-spin' size={20} /> : ""}</button>
                </div>
            </div>
            {renderToaster ? <Toaster/> : ""}
        </div>
    )
}