import { GrnBtn } from "../greenBtn"
import styles from './headerSuperInterna.module.css'
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
import SearchContextGestoria from "./layoutSuperGestoriaInterna";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { AuthContext } from "../../context/authProvider";
import { BiSelectMultiple } from "react-icons/bi";
import { IoIosRemoveCircle } from "react-icons/io";
import { IoIosHappy } from "react-icons/io";

interface header {
    setSearch: (search: string) => void;
    setFilters: (filters: any) => void;
    setExternosContext: (gestores: externoSupervisionado[]) => void;
    setAllExternosContext: (gestores: externoSupervisionado[]) => void;
}
export interface supervisionado {
    NomeInterna: string;
    CodigoInterna: number;
    Selecionada: boolean;
    externos: externoSupervisionado[];
}

export interface externoSupervisionado {
    CodigoExterno: number;
    NomeExterno: string;
    Selecionado: boolean;
}

export function HeaderSuperGestoriaInterna({ setSearch, setFilters, setExternosContext, setAllExternosContext }: header) {
    const [mostrarProfile, setMostrarProfile] = useState<boolean>(false);
    const [mostrarAdicionar, setMostrarAdicionar] = useState<boolean>(false);
    const [mostrarFiltro, setMostrarFiltro] = useState<boolean>(false);
    const [localSearch, setLocalSearch] = useState<string>('');
    const [showVendors, setShowVendors] = useState<boolean>(false);
    const [supervisionados, setSupervisionados] = useState<supervisionado[]>([]);
    const [firstRender, setFirstRender] = useState<boolean>(true);
    const [indicadores, setIndicadores] = useState<any>({});
    const [openedDropdowns, setOpenedDropdowns] = useState<number[]>([]);

    const { user } = useContext(AuthContext);



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

    const carregaSupervisionados = async () => {
        console.log("carregou gerenciados")
        const response = await ajax({ method: "GET", endpoint: "/superGestoriaInterna/supervisionados", data: null })
        console.log(response);
        if (response.status == "error") {
            toast.error(response.message);
            setTimeout(() => {
                navigate('/');
            }, 2000);
            return;
        }
        if (response.status == "success") {
            const data: supervisionado[] = response.data;
            const supervisio = formatSetExternosAndInternasAllSelectedByDefault(data);
            setSupervisionados(supervisio);
            const allExternos = getExternosFromSupervisionados(data);
            setAllExternosContext(allExternos);
        }
    }

    const formatSetExternosAndInternasAllSelectedByDefault = (supervisionados: supervisionado[]): supervisionado[] => {
        const newSupervisionados: supervisionado[] = supervisionados;
        newSupervisionados.map((interna) => {
            interna.Selecionada = true;
            interna.externos.map((externo: externoSupervisionado) => {
                externo.Selecionado = true;
            })
        })
        return newSupervisionados;
    }

    const getExternosFromSupervisionados = (supervisionados: supervisionado[]): externoSupervisionado[] => {
        const externos: externoSupervisionado[] = [];
        supervisionados.map((interna) => {
            interna.externos.map((externo) => {
                externos.push(externo);
            })
        })
        return externos;
    }

    const handleExternos = (externoEscolhido: externoSupervisionado): void => {
        setSupervisionados(prevState =>
            prevState.map(interna => ({
                ...interna,
                externos: interna.externos.map(ext =>
                    ext === externoEscolhido ? { ...ext, Selecionado: !ext.Selecionado } : ext
                )
            }))
        );
    }

    const handleInterna = (internaEscolhida: supervisionado): void => {
        setSupervisionados(prevState =>
            prevState.map(interna => {
                if (interna === internaEscolhida) {
                    const novaSelecionada = !interna.Selecionada;
                    return {
                        ...interna,
                        Selecionada: novaSelecionada,
                        externos: interna.externos.map(ext => ({ ...ext, Selecionado: novaSelecionada }))
                    };
                }
                return interna;
            })
        );
    };

    const atualizaExternosContext = () => {
        const externosSelecionados: externoSupervisionado[] = [];
        supervisionados.map((interna: supervisionado) => {
            interna.externos.map((externo: externoSupervisionado) => {
                if (externo.Selecionado) {
                    externosSelecionados.push(externo);
                }
            })
        });

        setExternosContext(externosSelecionados);
    }

    const myOpportunities = () => {
        const externo: externoSupervisionado = {
            CodigoExterno: user.id,
            NomeExterno: user.name,
            Selecionado: true
        }
        setExternosContext([externo]);

    }

    const selectAll = () => {
        setSupervisionados(prevState =>
            prevState.map(interna => ({
                ...interna,
                Selecionada: true,
                externos: interna.externos.map(ext => ({ ...ext, Selecionado: true }))
            }))
        );
    }

    const deSelectAll = () => {
        console.log("deSelectAll");
        setSupervisionados(prevState =>
            prevState.map(interna => ({
                ...interna,
                Selecionada: false,
                externos: interna.externos.map(ext => ({ ...ext, Selecionado: false }))
            }))
        );
    }
    



    useEffect(() => {
        if (supervisionados.length > 0) {
            if (firstRender) {
                atualizaExternosContext();
                setFirstRender(false);
            }
        }


    }, [supervisionados])

    useEffect(() => {
        carregaSupervisionados();
    }, []);

    useEffect(() => {
        if (indicadoresContext) {
            setIndicadores(indicadoresContext);
        }
    }, [indicadoresContext])


    const toggleDropdown = (index: number) => {
        setOpenedDropdowns(openedDropdowns.includes(index) ? openedDropdowns.filter((item) => item !== index) : [...openedDropdowns, index]);
    };


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
                                {(indicadores.ganhos || indicadores.ganhos == 0) || <ImSpinner8 className="animate-spin mt-1" />}
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="m-0 text-xs font-semibold text-red-500" >Perdidos (30 dias)</p>
                            <button className=" hover:scale-105 h-9 w-24 customRedBorder outline-none bg-white rounded-md font-semibold text-red-500 cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300 ">
                                {(indicadores.perdidos || indicadores.perdidos == 0) || <ImSpinner8 className="animate-spin mt-1" />}
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center" >
                            <p className="m-0 text-xs font-semibold text-black" >Valor Total aberto</p>
                            <button className=" hover:scale-105 h-9 flex items-center justify-center customBorder outline-none bg-white rounded-md font-semibold text-black cursor-pointer hover:bg-black hover:text-white transition-all duration-300 ">
                                {indicadores.valorTotal ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(indicadores.valorTotal) : <ImSpinner8 className="animate-spin" />}
                            </button>
                        </div>
                    </div>
                </div>



                <div className=" relative flex justify-center mr-2 "  >
                    <WhiteBtn nomeBtn="Internos" icon={<FcBusinessman />} onClick={() => setShowVendors(!showVendors)} />
                    <div className={` ${showVendors ? "" : "hidden"} customBorder mt-14  customListWidth rounded-md box-border absolute z-50 bg-white flex flex-col `} >
                        {
                            supervisionados ?
                                supervisionados.map((interna: supervisionado, index) => {
                                    return (
                                        <>
                                            <label key={index} onClick={(e) => e.stopPropagation()} className="flex px-4 py-3 w-full box-border justify-between transition-all duration-300 hover:bg-black hover:bg-opacity-10 cursor-pointer">
                                                <p className="m-0 box-border whitespace-nowrap">{interna.NomeInterna}</p>
                                                <div className="w-full h-full flex justify-end items-center " >
                                                    <input checked={interna.Selecionada} onChange={() => handleInterna(interna)} type="checkbox" className=" w-16 h-4 p-2 transition-all duration-300 hover:scale-105 " />
                                                    <button onClick={() => toggleDropdown(index)} className="ml-2 focus:outline-none bg-transparent flex items-center justify-center rounded-md p-1 border-none  cursor-n-resize ">
                                                        <IoIosArrowDropupCircle size={26} className={` ${openedDropdowns.includes(index) ? "rotate-up" : "rotate-down" }  `} /> 
                                                    </button>
                                                </div>
                                            </label>
                                            {openedDropdowns.includes(index) && (
                                                <div id="externos" className="mt-2">
                                                    {interna.externos ?
                                                        interna.externos.map((externo: externoSupervisionado) => (
                                                            <label onClick={(e) => e.stopPropagation()} className=" flex px-4 py-3 w-full box-border justify-between transition-all duration-300 hover:bg-black hover:bg-opacity-10 cursor-pointer " >
                                                                <p className="m-0 ml-8 box-border whitespace-nowrap" >{externo.NomeExterno}</p>
                                                                <input checked={externo.Selecionado} onChange={() => handleExternos(externo)} type="checkbox" className=" w-8 transition-all duration-300 hover:scale-105 " />
                                                            </label>

                                                        ))
                                                        :
                                                        <p>Carregando...</p>
                                                    }
                                                </div>
                                            )}
                                        </>
                                    )
                                })
                                :
                                <p>Carregando...</p>
                        }
                        <div className="w-full flex items-center gap-2 justify-center px-2 py-1 box-border" >
                            <GrnBtn onClick={() => atualizaExternosContext()} customCss="mt-2 mb-2 w-full self-center" nomeBtn="Aplicar Supervisionados" type="submit" icon={<IoFilterSharp size={20} />} />
                        </div>
                        <div className="w-full flex items-center gap-2 justify-center px-2 py-1 box-border" >
                            <GrnBtn onClick={() => myOpportunities()} customCss="mt-2 mb-2 w-full self-center bg-green-700 " nomeBtn="Minhas oportunidades" type="submit" icon={<IoIosHappy size={20} />} />

                        </div>
                        <div className="w-full flex items-center gap-2 justify-center p-2 box-border"  >
                            <GrnBtn customCss="w-6/12 whitespace-nowrap" onClick={() => selectAll()} nomeBtn="Selecionar todos" icon={<BiSelectMultiple />}  />
                            <GrnBtn customCss="w-6/12 whitespace-nowrap bg-red-500 hover:bg-red-600" onClick={() => deSelectAll()} nomeBtn="Remover todos" icon={<IoIosRemoveCircle />}  />
                        </div>
                    </div>
                </div>

                <div className="justify-self-end flex items-center justify-center gap-8 mr-6 h-full">
                    {pathname.includes('/opportunity') ? null : <WhiteBtn onClick={() => handleFiltro()} nomeBtn="Filtros" icon={<FaFilter size={16} />}></WhiteBtn>}
                    <Filter showFilters={mostrarFiltro} handleFilters={HandleSetFilters} fecharFiltro={handleFiltro} />
                    <div >
                        <CgProfile size={33} onClick={() => handleProfile()} className="mr-8 mt-1.5 hover:scale-105 transition-all duration-500 cursor-pointer" />
                        {mostrarProfile ? <ModalProfile /> : null}
                    </div>
                </div>

            </div>
        </>
    )
}

