import { GrnBtn } from "../greenBtn"
import styles from './header.module.css'
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
import SearchContextGestoria from "./layoutGestoria";
interface header {
    setSearch: (search: string) => void;
    setFilters: (filters: any) => void;
    setGerenciadosContext: (gestores: gerenciado[]) => void;
    setAllGerenciadosContext: (gestores: gerenciado[]) => void;
}
export interface gerenciado {
    CodigoVendedor: string;
    VendedorExterno: string;
    Selecionado: boolean;
}

export function HeaderGestoria({ setSearch, setFilters, setGerenciadosContext, setAllGerenciadosContext }: header) {
    const [mostrarProfile, setMostrarProfile] = useState<boolean>(false);
    const [mostrarAdicionar, setMostrarAdicionar] = useState<boolean>(false);
    const [mostrarFiltro, setMostrarFiltro] = useState<boolean>(false);
    const [localSearch, setLocalSearch] = useState<string>('');
    const [showVendors, setShowVendors] = useState<boolean>(false);
    const [gerenciados, setGerenciados] = useState<gerenciado[]>([]);
    const [firstRender, setFirstRender] = useState<boolean>(true);
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
        navigate('/gestoria')
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
        console.log("carregou gerenciados")
        const response = await ajax({method: "GET", endpoint: "/gestoria/gerenciados", data: null })
        if (response.status == "error") {
            toast.error("Erro ao carregar os gerenciados")
            setTimeout(() => {
                navigate('/');  
            }, 2000);
            return;
        }
        if (response.status == "success") {
            const data = response.data;
            adicionaSelecionadoGerenciados(data);
        }
    }

    const adicionaSelecionadoGerenciados = async (data: gerenciado[]) => {
        var gerenciadosComSelecionado = data;
        gerenciadosComSelecionado.forEach((gerenciado) => {
            gerenciado.Selecionado = true;
        })
        setGerenciados(gerenciadosComSelecionado);
    }

    const handleGerenciados = ( gerenciado: gerenciado ) => {
        const index = gerenciados.findIndex((item) => item.CodigoVendedor == gerenciado.CodigoVendedor);
        if (gerenciados[index].Selecionado) {
            gerenciados[index].Selecionado = false;
            setGerenciados([...gerenciados]);
            return;
        }
        if (!gerenciados[index].Selecionado) {
            gerenciados[index].Selecionado = true;
            setGerenciados([...gerenciados]);
            return;
        }
    }


    const atualizaGerenciadosContext = (firstRender: boolean = false) => {
        var gerenciadosFiltrados = gerenciados.filter((gerenciado) => gerenciado.Selecionado == true);
        setGerenciadosContext(gerenciadosFiltrados);
        if (firstRender) {
            setAllGerenciadosContext(gerenciados);
        }
    }

    useEffect(() => {
        if (gerenciados.length > 0) {
            if (firstRender) {
                atualizaGerenciadosContext(true);
                setFirstRender(false);
            }
        }
        
        
    }, [gerenciados])

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
        <AddOportunity atualizaEstadoModal={() => setMostrarAdicionar(!mostrarAdicionar)} mostrarModal={mostrarAdicionar} isGestor={true}  />
        <div className="headerHeight flex shadow-md w-full items-center box-border relative justify-between">
            <img src={logo}  className=" w-14 h-14 ml-4 justify-self-start cursor-pointer " onClick={handleGoHome}  alt="" />
            <div className="flex w-auto gap-8 items-center relative self-center">
                <div className="absolute ml-4 mt-1"><CiSearch size={26} /></div>
                <input disabled={pathname.includes('/opportunity') || pathname.includes('/leads') ? true : false } type="text" value={localSearch} className={pathname.includes('/opportunity') || pathname.includes('/leads') ? styles.searchDesativado : styles.search } onChange={(e) => handleSearch(e.target.value)}  placeholder="Busque por Oportunidades"  />
               { localSearch == "" ? "" : <div className="absolute mr-4 right-0 mt-1" onClick={() => handleSearch("")}> <IoClose size={26}/> </div> } 
               {pathname.includes('/opportunity') || pathname.includes('/leads') ? <WhiteBtn nomeBtn="Quadro" icon={<FaHouseChimney/>}  onClick={() => handleGoHome()}></WhiteBtn> : <GrnBtn nomeBtn="Oportunidade"  onClick={() => handleMostrarModal()} icon={<IoMdAddCircle size={18}/>}></GrnBtn>}
                <div className="flex gap-4 mr-4 ml-4">
                    <div className="flex flex-col items-center justify-center" >
                        <p className="m-0 text-xs font-semibold text-green-500 " >Ganhos</p>
                        <button className=" hover:scale-105 h-9 w-24 customGreenBorder outline-none bg-white rounded-md font-semibold text-green-500 cursor-pointer hover:bg-green-500 hover:text-white transition-all duration-300 ">
                           { indicadores.ganhos || <ImSpinner8 className="animate-spin mt-1" />  }
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="m-0 text-xs font-semibold text-red-500" >Perdidos</p>
                        <button className=" hover:scale-105 h-9 w-24 customRedBorder outline-none bg-white rounded-md font-semibold text-red-500 cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300 ">
                            { indicadores.perdidos || <ImSpinner8 className="animate-spin mt-1"/>  }
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center" >
                        <p className="m-0 text-xs font-semibold text-black" >Valor Total</p>
                        <button className=" hover:scale-105 h-9 flex items-center justify-center customBorder outline-none bg-white rounded-md font-semibold text-black cursor-pointer hover:bg-black hover:text-white transition-all duration-300 ">
                            { indicadores.valorTotal ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(indicadores.valorTotal) : <ImSpinner8 className="animate-spin"/> }
                        </button>
                    </div>
                </div>    
            </div>

                

                <div className=" relative flex justify-center mr-2 "  >
                    <WhiteBtn nomeBtn="Vendedores" icon={<FcBusinessman  />} onClick={() => setShowVendors(!showVendors)} />
                    <div className={` ${showVendors ? "" : "hidden"} customBorder mt-14  customListWidth rounded-md box-border absolute z-50 bg-white flex flex-col `} >
                    {
                        gerenciados.map((gerenciado: { VendedorExterno: string, CodigoVendedor: string, Selecionado: boolean }) =>  {
                            return (
                                <label onClick={(e) => e.stopPropagation()}  className=" flex px-4 py-3 w-full box-border justify-between transition-all duration-300 hover:bg-black hover:bg-opacity-10 cursor-pointer " >
                                    {gerenciado.VendedorExterno}
                                    <input checked={ gerenciado.Selecionado } onClick={() => handleGerenciados(gerenciado)}  type="checkbox" className=" w-8 transition-all duration-300 hover:scale-105 " />
                                </label>
                            )
                        })
                    }
                    <GrnBtn onClick={ () => atualizaGerenciadosContext() } customCss="mt-2 mb-2 w-11/12 self-center" nomeBtn="Aplicar Gerenciados" type="submit" icon={<IoFilterSharp />} />
                    </div>
                </div>

            <div className="justify-self-end flex items-center justify-center gap-8 mr-6 h-full">
                {pathname.includes('/opportunity') ? null : <WhiteBtn onClick={() => handleFiltro()} nomeBtn="Filtros" icon={<FaFilter size={16}/>}></WhiteBtn>}
                {mostrarFiltro? <Filter handleFilters={HandleSetFilters} fecharFiltro={handleFiltro} /> : null} 
                <div >
                    <CgProfile size={33} onClick={() => handleProfile()} className="mr-8 mt-1.5 hover:scale-105 transition-all duration-500 cursor-pointer"/>  
                    {mostrarProfile ? <ModalProfile/> : null }
                </div>
            </div>

        </div>
        </>
    )
}

