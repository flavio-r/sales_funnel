import { useState, useEffect } from "react";
import { WhiteBtn } from "./whiteBtn";
import { IoIosCloseCircle } from "react-icons/io";
import { InputDados } from "./inputDados";
import { SelectDados } from "./selectDados";
import {useForm} from 'react-hook-form';
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


export function ModalNovoTicket( {onClose, CardCode}: novoTicketProps ) {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const { register, handleSubmit } = useForm({});
    const [isFocused, setIsFocused] = useState(false);
    const [isFocusedRealizado, setIsFocusedRealizado] = useState(false);
    const [renderToast, setRenderToast] = useState(false);
    const [atribuidos, setAtribuidos] = useState<any>([]);
    const [tipo, setTipo] = useState("Lembrete");
    const [criaProximo, setCriaProximo] = useState(true); 
    const { user } = useContext(AuthContext);

    const dataAtual = new Date();
    const horas = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
    const horarioAtual = `${horas}:${minutos}`;

    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se for menor que 10
    const dia = String(dataAtual.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se for menor que 10
    const dataFormatada = `${dia}/${mes}/${ano}`;


    const onSubmit = async (data: any) => {
        setRenderToast(true);
        toast.dismiss();
        toast.loading("Enviando Ticket");
        data.cardcode = CardCode;
        

        if (tipo == "Lembrete") {
            data.tipo = "10";
        } else if (tipo == "Comunicação") {
            data.tipo = "11";
        }
        data.tipoRealizado = "10";

        const assuntoRealizado = achaNumAssunto(data.assuntoRealizado, "Lembrete")
        const assunto = achaNumAssunto(data.assunto, tipo);
        data.assunto = assunto;
        data.assuntoRealizado = assuntoRealizado;
        const atribuicao: any = document.getElementById('testeAtribuicao');
        if (atribuicao) {
            data.atribuicao = atribuicao.value
        }
        data.criaProxima = criaProximo;
        


        const response = await ajax({method: "POST", endpoint: "/atividades/adicionar", data: data});
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
        if (response.status == 'success') {
            toast.dismiss();
            toast.success("Ticket enviado!");
            setIsOpen(!isOpen);
            return;
        }

        toast.dismiss();
        toast.error("Erro ao enviar ticket")
    }

 
    const carregaAtribuidos = async () => {
        const response = await ajax({method: "GET", endpoint: "/task/atribuicoes", data: null});
        if (response.status == "error") {
            toast.error("Erro ao carregar atribuições")
            return;
        }

        if (response.status == 'success') {
            const atribuidos: any = [];
            response.data.forEach((atribuido: any) => {
                atribuidos.push(atribuido);
            });
            setAtribuidos(atribuidos);
        }

    }

    const handleTipo = (e: any) => {
        const valorSelecionado = e.target.value;
        if (valorSelecionado == user.id_sap) {
            setTipo("Lembrete");
        } else {
            setTipo("Comunicação");
        }
    }

    
 



    
    
    //configs do funcionamento do modal
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } 
    if (!isOpen) {
        document.body.style.overflow = 'unset';
    }

    useEffect(() => {
        if (!isOpen) {
          onClose();
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        carregaAtribuidos();
        //replaced cons log
    }, []);

    

    

    return (
        <form id="formNovoTicket" action="" onSubmit={handleSubmit(onSubmit)} className=" gap-12 modalAdd fixed top-0 left-0 w-full h-full bg-opacity-50 bg-black overflow-auto z-50 flex items-center justify-center box-border">
            <div     className="bg-white w-5/12 h-4/6    rounded-md flex flex-col box-border shadow-lg p-2">                
                <div className="flex justify-between px-4 items-center mt-2" >
                    <p className="m-0  text-xl font-semibold " >Atendimento Realizado</p>
                    <WhiteBtn nomeBtn="Fechar" onClick={() => setIsOpen(false)} icon={ <IoIosCloseCircle /> } />
                </div>
                <div className="horizontalRule" ></div>
                <div className="flex w-full px-4 gap-4 box-border " >
                    <div className=" flex flex-col w-1/2" >
                        <SelectDados requiredDefault={true} preValue="Visita" tipo="assunto" placeholder="Assunto" name="assuntoRealizado" register={register}   />

                    </div>
                    <div className="w-1/2" >
                    
                    <div className="flex justify-between w-full gap-2 " >
                        <div className="w-full" > <SelectDados requiredDefault={true} preValue="Lembrete" disabled={true}  tipo="tipo" placeholder="Tipo" name="tipoRealizado" register={register}  /></div>
                    </div>
                    </div>
                </div>
                
                <div className=" w-full px-4  mt-4 h-full box-border relative" >
                <textarea
                        required={true}
                        {...register("conteudoRealizado")}
                        name="conteudoRealizado"
                        id="conteudoRealizado"
                        placeholder=" "
                        className={`font-sans outline-none p-4 w-full h-full rounded-md customBorder box-border text-md focus:border-blue-500 ${isFocusedRealizado ? 'pt-6' : ''}`}
                        onFocus={() => setIsFocusedRealizado(true)}
                        onBlur={(e) => {
                        if (e.target.value === '') {
                            setIsFocusedRealizado(false);
                        }
                        }}
                        
                    ></textarea>   
                <label
                    htmlFor="conteudoRealizado"
                    className={`absolute pl-4 left-4 transition-all duration-300 ${isFocusedRealizado ? 'top-1 text-gray-600 text-sm' : 'top-4 text-md'}`}
                    >Conteúdo
                </label>
                </div>
                <div className="horizontalRule" ></div> 
                <div className="w-full px-4 mt-4 box-border flex justify-between mb-2" >
                <div className="flex items-center gap-2" >
                    <label className="switch" >
                        <input type="checkbox" id="switcher" checked={criaProximo} onClick={() => setCriaProximo(!criaProximo)} />
                        <span className="slider"></span>
                    </label>
                    <label className="m-0 font-semibold text-lg" htmlFor="switcher" >Criar próximo antendimento</label>
                </div>
                    <GrnBtn form="formNovoTicket" icon={<IoIosSave size={20} />} nomeBtn="Adicionar Ticket" type="submit" />
                </div>
            </div>
            
            <div onSubmit={handleSubmit(onSubmit)} className={`bg-white w-5/12 h-4/6 ${criaProximo ? "" : "hidden"}   rounded-md flex flex-col box-border shadow-lg p-2`}>                
                <div className="flex justify-between px-4 items-center mt-2" >
                    <p className="m-0  text-xl font-semibold " >Novo Atendimento</p>
                </div>
                <div className="horizontalRule" ></div>
                <div className="flex w-full px-4 gap-4 box-border " >
                    <div className=" flex flex-col w-1/2" >
                        <SelectDados funcaoAoMudar={handleTipo} itens={atribuidos} id="testeAtribuicao" requiredDefault={true} preValue={user.id_sap} tipo="atribuidos" placeholder="Atribuição" insidePlaceholder="Atribuir" name="atribuicao" register={register}  />
                        <SelectDados requiredDefault={true} preValue="Visita" tipo="assunto" placeholder="Assunto" name="assunto" register={register}   />

                    </div>
                    <div className="w-1/2" >
                    <div className="flex justify-between w-full gap-2 " >
                        <div className="w-1/2" ><InputDados editable={true} requiredDefault={true} preValue={dataFormatada} placeholder="Data" insidePlaceholder="29/01/2005" name="data" register={register} type="date" /></div>
                        <div className="w-1/2" ><InputDados editable={true} requiredDefault={true} preValue={horarioAtual} placeholder="Horário" insidePlaceholder="13:29" name="horario" register={register} type="time" /></div>
                    </div>
                    <div className="flex justify-between w-full gap-2 " >
                        <div className="w-full" > <SelectDados requiredDefault={true} preValue={tipo} disabled={true}  tipo="tipo" placeholder="Tipo" name="tipo" register={register}  /></div>
                    </div>
                    </div>
                </div>
                
                <div className=" w-full px-4  mt-4 h-full box-border relative mb-4 " >
                <textarea
                        required={true}
                        {...register("conteudo")}
                        name="conteudo"
                        id="conteudo"
                        placeholder=" "
                        className={`font-sans outline-none p-4 w-full h-full  rounded-md customBorder box-border text-md focus:border-blue-500 ${isFocused ? 'pt-6' : ''}`}
                        onFocus={() => setIsFocused(true)}
                        onBlur={(e) => {
                        if (e.target.value === '') {
                            setIsFocused(false);
                        }
                        }}
                        
                    ></textarea>   
                <label
                    htmlFor="conteudo"
                    className={`absolute  pl-4 left-4 transition-all duration-300 ${isFocused ? 'top-1 text-gray-600 text-sm' : 'top-4 text-md'}`}
                    >Conteúdo
                </label>
                </div>
            </div>
                { renderToast ? <Toaster/> : null}
        </form>
        
    )
}