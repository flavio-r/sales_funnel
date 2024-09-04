import { InputDados } from "./inputDados"  
import {useForm} from 'react-hook-form';
import { GrnBtn } from "./greenBtn";
import { IoFilterSharp } from "react-icons/io5";
import { WhiteBtn } from "./whiteBtn";
import { IoIosCloseCircle } from "react-icons/io";
import { useState, useEffect } from "react";
import { SelectDados } from "./selectDados";
import { ajax } from "../ajax/ajax";
import toast from "react-hot-toast";
import { municipio } from "../pages/leads";
interface Filters {
    showFilters: boolean;
    handleFilters: (filters: any) => void
    fecharFiltro: () => void
}

export interface regiao {
    Code: string;
}



export function Filter({ handleFilters, fecharFiltro, showFilters }: Filters) {
    const { register, handleSubmit, reset } = useForm<any>({});
    const [switchHandler, setSwitchHandler] = useState<boolean>(false);
    const [municipios, setMunicipios] = useState<municipio[]>([]);
    const [regioes, setRegioes] = useState<regiao[]>([]);

    const onSubmit = (data: any) => {
        data.apenasDestacados = switchHandler;
        console.log(data);
        handleFilters(data);
    }

    const handleClearFilters = () => {
        handleFilters({});
        reset();
    }

    const loadMunicipiosForFilter = async () => {
        const response = await ajax({method: "GET", endpoint: "/municipios", data: null});
        if (response.status == "success") {
            const municipios = response.data;
            if (municipios) {
                setMunicipios([{}, ...municipios]);
            }
            return;
        }
        toast.error("Erro ao carregar municípios do filtro.");
    }

    const loadRegioesForFilter = async () => {
        const response = await ajax({method: "GET", endpoint: "/regioesUsuario", data: null});
        if (response.status == "success") {
            const regioes = response.data;
            if (regioes) {
                setRegioes([{}, ...regioes]);
            }
            return;
        }
        toast.error("Erro ao carregar regiões do filtro.");
    }
    useEffect(() => {
        loadRegioesForFilter();
        loadMunicipiosForFilter();
    }, [])

    //const dataAtual = new Date().toLocaleDateString();
    //const data1mesAtras = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString();
    return (        
        <form action="" id="filterOp" onSubmit={handleSubmit(onSubmit)} className={` ${ showFilters ? "absolute" : "hidden" }  flex p-4 bg-white rounded-md shadow-lg z-50 top-full right-40 flex-col w-auto transition-all duration-500 `} >
            <div className="flex justify-between items-center" >
                <div>
                   <p className="m-0 font-semibold text-lg" >Filtros</p>
                </div>
                <div>
                    <WhiteBtn type="button" nomeBtn="Fechar" onClick={fecharFiltro} icon={<IoIosCloseCircle />} />
                </div>
            </div>
            <div className="horizontalRuleFilter"></div>
            <div className="flex flex-col items-center mb-6 mt-4">
                <p className="m-0 self-start text-xl font-semibold mb-1" >Data prevista de avanço de etapa</p>
                <div className="flex justify-between gap-4 w-full  h-full" >
                    <div className="w-52" >
                        <InputDados tirarTopo={true} editable={true} placeholder="Data Início" name="dataInicio" type="date" register={register} />
                    </div>
                    <p className="mt-7" >Até</p>
                    <div className="w-52" >
                        <InputDados tirarTopo={true} editable={true} placeholder="Data Final" name="dataFim" type="date" register={register} />
                    </div>
                </div>
            </div>
            
            <div className=" flex flex-col  items-center mb-6">
                <p className="m-0 self-start text-xl font-semibold mb-1" >Valor Estimado </p>
                <div className="flex justify-between h-full w-full gap-4" >
                    <div className=" w-52 " >
                        <InputDados tirarTopo={true}  editable={true} placeholder="Valor Mínimo" name="valorMinimo" type="number" register={register} />
                    </div>
                    <p className="mt-7" >Até</p>
                    <div className="w-52" >
                        <InputDados tirarTopo={true} editable={true}  placeholder="Valor Máximo" name="valorMaximo" type="number" register={register} />
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col  items-center mb-4">
                <SelectDados customCss="w-full" tipo="regioes" regioes={regioes} placeholder="Região" name="regiao" register={register}  />
            </div>
            <div className="w-full flex flex-col  items-center mb-4">
                <SelectDados customCss="w-full" tipo="municipios" municipios={municipios} placeholder="Município" name="municipio" register={register}  />
            </div>
            <div className="w-full flex flex-col  items-center mb-4">
                <SelectDados customCss="w-full" tipo="heatLevels" municipios={municipios} placeholder="Interesse" name="interesse" register={register}  />
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