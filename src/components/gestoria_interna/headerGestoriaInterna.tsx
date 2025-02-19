import { GrnBtn } from "../greenBtn"
import styles from './headerInterna.module.css'
import { IoMdAddCircle } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { useEffect, useState, useContext } from "react";
import { ModalProfile } from "../modalProfile";
import { useLocation } from "react-router-dom";
import { FaHouseChimney } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { AddOportunity } from "../modalAddOportunity";
import { Filter } from "../modalFilter";
import { IoClose } from "react-icons/io5";
import logo from '../../../public/assets/images/logo_funil_fundoBranco.png'
import { WhiteBtn } from "../whiteBtn";
import { FcBusinessman } from "react-icons/fc";
import { ajax } from "../../ajax/ajax";
import { IoFilterSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { ImSpinner8 } from "react-icons/im";
import SearchContextGestoria from "./layoutGestoriaInterna";
import { vendor } from "./layoutGestoriaInterna";
import { filter_fields } from "../modalFilter";
interface header {
    setSearch: (search: string) => void;
    setFilters: (filters: any) => void;
    setExternosContext: (gestores: externo[]) => void;
    setAllGerenciadosContext: (gestores: externo[]) => void;
    setAllVendorsContext: (vendors: vendor[]) => void;
    Filters: filter_fields;
    Externos: any[];
}
export interface externo {
    CodigoExterno: string;
    NomeExterno: string;
    Selecionado: boolean;
}

export function HeaderGestoriaInterna({ setSearch, setFilters, setExternosContext, setAllGerenciadosContext, setAllVendorsContext, Filters, Externos }: header) {
    const [mostrarProfile, setMostrarProfile] = useState<boolean>(false);
    const [mostrarAdicionar, setMostrarAdicionar] = useState<boolean>(false);
    const [mostrarFiltro, setMostrarFiltro] = useState<boolean>(false);
    const [localSearch, setLocalSearch] = useState<string>('');
    const [showVendors, setShowVendors] = useState<boolean>(false);
    const [externos, setExternos] = useState<externo[]>([]);
    const [indicadores, setIndicadores] = useState<any>({});


    const { indicadoresContext } = useContext(SearchContextGestoria);

    const navigate = useNavigate();

    const { pathname } = useLocation();

    const handleSearch = (e: any) => {
        setSearch(e);
        setLocalSearch(e);
    }

    const HandleSetFilters = (filters: any) => {
        setFilters(filters);
    }

    const handleGoHome = () => {
        navigate('/gestoriaInterna')
    }

    const handleMostrarModal = () => {
        setMostrarAdicionar(!mostrarAdicionar);
    }

    const handleProfile = () => {
        setMostrarProfile(!mostrarProfile);
    }

    const handleFiltro = () => {
        setMostrarFiltro(!mostrarFiltro);
    }

    const carregaGerenciados = async () => {
        //replaced cons log
        const response = await ajax({ method: "GET", endpoint: "/gestoriaInterna/externos", data: null })
        if (response.status == "error") {
            toast.error("Erro ao carregar os gerenciados")
            setTimeout(() => {
                navigate('/');
            }, 2000);
            return;
        }
        if (response.status == "success") {
            const data = response.data;
            adicionaSelecionadoGerenciados(data, Externos);
        }
    }

    const adicionaSelecionadoGerenciados = (data: externo[], Externos: any[]) => {
        var gerenciadosComSelecionado = data;
            
        if (Externos.length == 0) {
            gerenciadosComSelecionado.forEach((gerenciado) => {
                gerenciado.Selecionado = true;
            })  

        } else {
            gerenciadosComSelecionado.forEach((gerenciado) => {
                Externos.forEach((externo) => {
                    if (gerenciado.CodigoExterno == externo.CodigoExterno) {
    
                        gerenciado.Selecionado = true;
                    }
                })
            })    
        }

        setExternos(gerenciadosComSelecionado);
    }

    const handleGerenciados = (gerenciado: externo) => {
        const index = externos.findIndex((item) => item.CodigoExterno == gerenciado.CodigoExterno);
        if (externos[index].Selecionado) {
            externos[index].Selecionado = false;
            setExternos([...externos]);
            return;
        }
        if (!externos[index].Selecionado) {
            externos[index].Selecionado = true;
            setExternos([...externos]);
            return;
        }
    }


    const atualizaGerenciadosContext = () => {
        var gerenciadosFiltrados = externos.filter((externo) => externo.Selecionado == true);
        setExternosContext(gerenciadosFiltrados);
        setAllGerenciadosContext(externos);
    }


    const carregaAllVendors = async () => {
        const response = await ajax({ method: "GET", endpoint: "/vendedores/todos", data: null })
        if (response.status == "error") {
            toast.error("Erro ao carregar os vendedores")
            return;
        }
        if (response.status == "success") {
            setAllVendorsContext(response.data);
        }
    }


    useEffect(() => {
        carregaAllVendors();
    }, [])

    useEffect(() => {
        if (Externos.length === 0 && externos.length > 0) {
            atualizaGerenciadosContext();        
        }
    }, [externos])

    useEffect(() => {
        carregaGerenciados();
    }, []);

    useEffect(() => {
        if (indicadoresContext) {
            setIndicadores(indicadoresContext);
        }
    }, [indicadoresContext])

    return (
        <>
            <AddOportunity atualizaEstadoModal={() => setMostrarAdicionar(!mostrarAdicionar)} mostrarModal={mostrarAdicionar} isGestor={true} />
            <div className="headerHeight flex shadow-md w-full items-center box-border relative justify-between">
                <img src={logo} className=" w-14 h-14 ml-4 justify-self-start cursor-pointer " onClick={handleGoHome} alt="" />
                <div className="flex w-auto gap-8 items-center relative self-center">
                    <div className="absolute ml-4 mt-1"><CiSearch size={26} /></div>
                    <input disabled={pathname.includes('/opportunity') || pathname.includes('/leads') ? true : false} type="text" value={localSearch} className={pathname.includes('/opportunity') || pathname.includes('/leads') ? styles.searchDesativado : styles.search} onChange={(e) => handleSearch(e.target.value)} placeholder="Busque por Oportunidades" />
                    {localSearch == "" ? "" : <div className="absolute mr-4 right-0 mt-1" onClick={() => handleSearch("")}> <IoClose size={26} /> </div>}
                    {pathname.includes('/opportunity') || pathname.includes('/leads') ? <WhiteBtn nomeBtn="Quadro" icon={<FaHouseChimney />} onClick={() => handleGoHome()}></WhiteBtn> : <GrnBtn nomeBtn="Oportunidade" onClick={() => handleMostrarModal()} icon={<IoMdAddCircle size={18} />}></GrnBtn>}
                    <div className="flex gap-4 mr-4 ml-4">
                        <div className="flex flex-col items-center justify-center" >
                            <p className="m-0 text-xs font-semibold text-green-500 " >Ganhos (30 dias)</p>
                            <button className=" hover:scale-105 h-9 w-24 customGreenBorder outline-none bg-white rounded-md font-semibold text-green-500 cursor-pointer hover:bg-green-500 hover:text-white transition-all duration-300 ">
                                {indicadores.ganhos == null || indicadores.ganhos == undefined ? <ImSpinner8 className="animate-spin mt-1" /> : indicadores.ganhos}
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="m-0 text-xs font-semibold text-red-500" >Perdidos (30 dias)</p>
                            <button className=" hover:scale-105 h-9 w-24 customRedBorder outline-none bg-white rounded-md font-semibold text-red-500 cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300 ">
                                {indicadores.perdidos == null || indicadores.perdidos == undefined ? <ImSpinner8 className="animate-spin mt-1" /> : indicadores.perdidos}
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center" >
                            <p className="m-0 text-xs font-semibold text-black" >Valor Total aberto</p>
                            <button className=" hover:scale-105 h-9 flex items-center justify-center customBorder outline-none bg-white rounded-md font-semibold text-black cursor-pointer hover:bg-black hover:text-white transition-all duration-300 ">
                                {indicadores.valorTotal == null || indicadores.valorTotal == undefined ? <ImSpinner8 className="animate-spin" /> : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(indicadores.valorTotal)}
                            </button>
                        </div>
                    </div>
                </div>

                <div className=" relative flex justify-center mr-2 "  >
                    <WhiteBtn nomeBtn="Externos" icon={<FcBusinessman />} onClick={() => setShowVendors(!showVendors)} />
                    <div className={` ${showVendors ? "" : "hidden"} customBorder mt-14  customListWidth rounded-md box-border absolute z-50 bg-white flex flex-col `} >
                        {
                            externos.map((gerenciado: externo) => {
                                return (
                                    <label onClick={(e) => e.stopPropagation()} className=" flex px-4 py-3 w-full box-border justify-between transition-all duration-300 hover:bg-black hover:bg-opacity-10 cursor-pointer " >
                                        <p className="m-0 box-border whitespace-nowrap" >{gerenciado.NomeExterno}</p>
                                        <input checked={gerenciado.Selecionado} onClick={() => handleGerenciados(gerenciado)} type="checkbox" className=" w-8 transition-all duration-300 hover:scale-105 " />
                                    </label>
                                )
                            })
                        }
                        <GrnBtn onClick={() => atualizaGerenciadosContext()} customCss="mt-2 mb-2 w-11/12 self-center" nomeBtn="Aplicar Gerenciados" type="submit" icon={<IoFilterSharp />} />
                    </div>
                </div>

                <div className="justify-self-end flex items-center justify-center gap-8 mr-6 h-full">
                    {pathname.includes('/opportunity') ? null : <WhiteBtn onClick={() => handleFiltro()} nomeBtn="Filtros" icon={<FaFilter size={16} />}></WhiteBtn>}
                    <Filter showFilters={mostrarFiltro} baseFilters={Filters} handleFilters={HandleSetFilters} fecharFiltro={handleFiltro} />
                    <div >
                        <CgProfile size={33} onClick={() => handleProfile()} className="mr-8 mt-1.5 hover:scale-105 transition-all duration-500 cursor-pointer" />
                        {mostrarProfile ? <ModalProfile /> : null}
                    </div>
                </div>

            </div>
        </>
    )
}

