import { GrnBtn } from "../greenBtn"
import { WhiteBtn } from "../whiteBtn";
import styles from './header.module.css'
import { IoMdAddCircle } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";
import { ModalProfile } from "../modalProfile";
import { useLocation } from "react-router-dom";
import { FaHouseChimney } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { AddOportunity } from "../modalAddOportunity";
import { Filter } from "../modalFilter";
import { IoClose } from "react-icons/io5";
import { ajax } from "../../ajax/ajax";
import logo from '../../../public/assets/images/logo_funil_fundoBranco.png'
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../../context/authProvider";
import { filter_fields } from "../modalFilter";

interface header {
    setSearch: (search: string) => void;
    setFilters: (filters: any) => void;
    setGestor: (isGestor: boolean) => void;
    Filters: filter_fields;
}

export function Header({ setSearch, setFilters, setGestor, Filters }: header) {
    const [mostrarProfile, setMostrarProfile] = useState<boolean>(false);
    const [mostrarAdicionar, setMostrarAdicionar] = useState<boolean>(false);
    const [mostrarFiltro, setMostrarFiltro] = useState<boolean>(false);
    const [localSearch, setLocalSearch] = useState<string>('');
    const [isGerente, setIsGerente] = useState<boolean>(false);
    const [isInterno, setIsInterno] = useState<boolean>(false);
    const [isSupervisor, setIsSupervisor] = useState<boolean>(false);
    const [isVisualizador, setIsVisualizador] = useState<boolean>(false);

    const navigate = useNavigate();

    const { signed } = useContext(AuthContext);

    const { pathname } = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const origem = searchParams.get('origem');


    const handleSearch = (e: any) => {
        setSearch(e);
        setLocalSearch(e);
    }

    const HandleSetFilters = (filters: any) => {
        setFilters(filters);
    }

    const handleGoHome = () => {
        if (origem) {
            if (origem == "gestoria") {
                return navigate("/gestoria");
            } else if (origem == "gestoriaInterna") {
                return navigate("/gestoriaInterna");
            } else if (origem == "superGestoriaInterna") {
                return navigate("/supergestoria");
            } else if (origem == "visualizador") {
                return navigate("/visualizador");
            } 
        }
        navigate('/');
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

    const checaIsGerente = async () => {
        const response = await ajax({ method: "GET", endpoint: "/gestoria/checaGerente", data: null });
        if (response.status == "success") {
            const isGerente = response.data.isGerente;
            if (isGerente) {
                setIsGerente(true);
                setGestor(true);
            }
            return;
        }
        toast.error("Erro ao verificar se usuario é gerente")
    }

    const checaIsInterno = async () => {
        const response = await ajax({ method: "GET", endpoint: "/gestoriaInterna/checaInterno", data: null });
        if (response.status == "success") {
            const isInterno = response.data.isInterno;
            if (isInterno) {
                setIsInterno(true);
            }
            return;
        }
        toast.error("Erro ao verificar se usuario é interno")
    }

    const checaIsSupervisoraInterna = async () => {
        const response = await ajax({ method: "GET", endpoint: "/superGestoriaInterna/isSupervisor", data: null });
        if (response.status == "success") {
            const isSupervisor = response.data.isSupervisor;
            if (isSupervisor) {
                setIsSupervisor(true);
            }
            return;
        }
        toast.error("Erro ao verificar se usuario é supervisor interno")
    }

    const checaIsVisualizador = async () => {
        const response = await ajax({ method: "GET", endpoint: "/visualizadores/isVisualizador", data: null });
        if (response.status == "success") {
            const isSupervisor = response.data.isVisualizador;
            if (isSupervisor) {
                setIsVisualizador(true);
            }
            return;
        }
        toast.error("Erro ao verificar se usuario é supervisor interno")
    }


    const checkRoles = () => {
        checaIsInterno();
        checaIsGerente();
        checaIsSupervisoraInterna();
        checaIsVisualizador();
    }


    useEffect(() => {
            checkRoles();
    }, [signed])


    return (
        <>
            <AddOportunity atualizaEstadoModal={() => setMostrarAdicionar(!mostrarAdicionar)} mostrarModal={mostrarAdicionar} />
            <div className="headerHeight flex shadow-md w-full items-center box-border relative justify-between">
                <img src={logo} className=" w-14 h-14 ml-4 justify-self-start cursor-pointer " onClick={handleGoHome} alt="" />
                <div className="flex w-auto gap-8 items-center relative self-center">
                    <div className="absolute ml-4 mt-1"><CiSearch size={26} /></div>
                    <input disabled={pathname.includes('/opportunity') || pathname.includes('/leads') ? true : false} type="text" value={localSearch} className={pathname.includes('/opportunity') || pathname.includes('/leads') ? styles.searchDesativado : styles.search} onChange={(e) => handleSearch(e.target.value)} placeholder="Busque por Oportunidades" ></input>
                    {localSearch == "" ? "" : <div className="absolute mr-4 right-52 mt-1" onClick={() => handleSearch("")}> <IoClose size={26} /> </div>}

                    {pathname.includes('/opportunity') || pathname.includes('/leads') ? <WhiteBtn nomeBtn="Quadro" icon={<FaHouseChimney />} onClick={() => handleGoHome()}></WhiteBtn> : <GrnBtn nomeBtn="Oportunidade" onClick={() => handleMostrarModal()} icon={<IoMdAddCircle size={18} />}></GrnBtn>}

                </div>


                <div className="justify-self-end flex items-center justify-center gap-8 mr-6 h-full">

                    {pathname.includes('/opportunity') ? null : <WhiteBtn onClick={() => handleFiltro()} nomeBtn="Filtros" icon={<FaFilter size={16} />}></WhiteBtn>}
                    <Filter baseFilters={Filters} showFilters={mostrarFiltro} handleFilters={HandleSetFilters} fecharFiltro={handleFiltro} />
                    <div >

                        <CgProfile size={33} onClick={() => handleProfile()} className="mr-8 mt-1.5 hover:scale-105 transition-all duration-500 cursor-pointer" />
                        {mostrarProfile ? <ModalProfile isGerente={isGerente} isInterno={isInterno} isSupervisor={isSupervisor} isVisualizador={isVisualizador} /> : null}
                    </div>
                </div>

            </div>
        </>
    )
}

