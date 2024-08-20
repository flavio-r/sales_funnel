import { InputDados } from "./inputDados"  
import {useForm} from 'react-hook-form';
import { GrnBtn } from "./greenBtn";
import { IoFilterSharp } from "react-icons/io5";
import { WhiteBtn } from "./whiteBtn";
import { IoIosCloseCircle } from "react-icons/io";
import { useState } from "react";

interface Filters {
    handleFilters: (filters: any) => void
    fecharFiltro: () => void
}

export function Filter({ handleFilters, fecharFiltro }: Filters) {
    const { register, handleSubmit } = useForm<any>({});
    const [switchHandler, setSwitchHandler] = useState<boolean>(false);

    const onSubmit = (data: any) => {
        data.apenasDestacados = switchHandler;
        console.log(data);
        handleFilters(data);
    }

    const handleClearFilters = () => {
        handleFilters({});
    }

    const dataAtual = new Date().toLocaleDateString();
    const data1mesAtras = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString();
    return (        
        <form action="" id="filterOp" onSubmit={handleSubmit(onSubmit)} className="absolute flex p-4 bg-white rounded-md shadow-lg z-50 top-full right-40 flex-col w-auto transition-all duration-500 " >
            <div className="flex justify-between items-center" >
                <div>
                   <p className="m-0 font-semibold text-lg" >Filtros</p>
                </div>
                <div>
                    <WhiteBtn nomeBtn="Fechar" onClick={fecharFiltro} icon={<IoIosCloseCircle />} />
                </div>
            </div>
            <div className="horizontalRuleFilter"></div>
            <div className="flex flex-col items-center mb-8 mt-4">
                <p className="m-0 self-start text-xl font-semibold mb-1" >Data prevista de avanço de etapa</p>
                <div className="flex justify-between gap-4 w-full  h-full" >
                    <div className="w-52" >
                        <InputDados tirarTopo={true} editable={true} preValue={data1mesAtras} placeholder="Data Início" name="dataInicio" type="date" register={register} />
                    </div>
                    <p className="mt-7" >Até</p>
                    <div className="w-52" >
                        <InputDados tirarTopo={true} editable={true} preValue={dataAtual} placeholder="Data Final" name="dataFim" type="date" register={register} />
                    </div>
                </div>
            </div>
            
            <div className=" flex flex-col  items-center mb-8">
                <p className="m-0 self-start text-xl font-semibold mb-1" >Valor Estimado </p>
                <div className="flex justify-between h-full w-full gap-4" >
                    <div className=" w-52 " >
                        <InputDados tirarTopo={true}  editable={true} preValue={"0"} placeholder="Valor Mínimo" name="valorMinimo" type="number" register={register} />
                    </div>
                    <p className="mt-7" >Até</p>
                    <div className="w-52" >
                        <InputDados tirarTopo={true} editable={true} preValue={"5000"} placeholder="Valor Máximo" name="valorMaximo" type="number" register={register} />
                    </div>
                </div>
            </div>

            <div className=" flex flex-col  items-center mb-8">
                <p className="m-0 self-start text-xl font-semibold mb-1" >Etapa da Oportunidade</p>
                <div className="flex justify-between h-full w-full gap-4" >
                    <div className=" flex flex-col gap-1 " >
                        <div className="flex items-center mt-4"><input type="checkbox" { ...register("potencial") }  id="potencial" className="hover:scale-105 transition-all duration-300" ></input> <label htmlFor="potencial" className="m-0">Potencial</label> </div>
                        <div className="flex items-center"><input type="checkbox" { ...register("leads") } id="leads"></input> <label htmlFor="leads" className="m-0" >Qualificação</label> </div>
                        <div className="flex items-center"><input type="checkbox" { ...register("agendamento") } id="agendamento"></input> <label htmlFor="agendamento" className="m-0" >Agendamento / Reunião</label> </div>
                        <div className="flex items-center"><input type="checkbox" { ...register("diagnostico") } id="diagnostico"></input> <label htmlFor="diagnostico" className="m-0" >Diagnóstico</label> </div>
                        <div className="flex items-center"><input type="checkbox" { ...register("teste") } id="teste"></input> <label htmlFor="teste" className="m-0" >Teste</label> </div>
                        <div className="flex items-center"><input type="checkbox" { ...register("propostaValor") } id="propostaValor"></input> <label htmlFor="propostaValor" className="m-0" >Proposta de Valor</label> </div>
                    </div>  
                </div>
            </div>
            <div className=" flex flex-col  items-center mb-8">
                <div className="self-start" >
                    <p className=" m-0 mb-2 bg-white font-semibold text-xl " >Apenas Destacados</p>
                    <label className="toggle-switch">
                        <input type="checkbox" onClick={() => setSwitchHandler(!switchHandler)} />
                        <div className="toggle-switch-background">
                            <div className="toggle-switch-handle"></div>
                        </div>
                    </label>
                </div>
            </div>
            <div className="horizontalRuleFilter" ></div>
            <div className="flex items-center justify-between" >
                <button type="button" onClick={() => handleClearFilters()} className=" hover:scale-105 h-10 w-28 customRedBorder outline-none bg-white rounded-md font-semibold text-red-500 cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300 mt-4 ">Limpar Filtros</button>
                <GrnBtn form="filterOp" nomeBtn="Aplicar Filtros" type="submit" icon={<IoFilterSharp />} customCss="w-48 self-end mt-4" />
            </div>
        </form>
    )
}