import { AuthContext } from "../context/authProvider"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { ajax } from "../ajax/ajax";
import { IoEnter } from "react-icons/io5";
import { useLocation } from "react-router-dom";
export function ModalProfile({isGerente, isInterno, isSupervisor, isVisualizador}: {isGerente?: boolean, isInterno?: boolean, isSupervisor?: boolean, isVisualizador?: boolean} ) {
    const { user, signed } = useContext(AuthContext);
    const location = useLocation();
    const page = location.pathname;
    const navigate = useNavigate();
    
    
    
    var name;
    if (signed) {
        name = user.name
    }



    const deleteAllCookies = () => {
        const cookies = document.cookie.split(";");
      
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
    }

    const deslogaUsuario = async () => {
        localStorage.clear();
        sessionStorage.clear();
        deleteAllCookies();
        await ajax({method: "GET", endpoint: "/logout", data: null});
        //replaced cons log
    }
    

    async function handleLogOut() {    
        await deslogaUsuario();

        window.location.href = "https://hub.copapel.com.br/";
    }
    
    return (
        <div className="flex-col gap-4 h-auto w-auto p-6 bg-white rounded-md shadow-2xl absolute flex items-center justify-center outline-0.5 right-3 z-50"> 
          <div className="flex items-center gap-2"> <CiUser />  <p className="m-0 font-semibold text-md">{signed ? name : "" }</p></div>
          { page == "/gestoria" ? <div className=" customBorder shadow-sm flex items-center justify-center gap-2 hover:text-white text-black bg-white cursor-pointer hover:bg-black p-2 rounded-md w-full hover:shadow-lg transiton-all duration-300" onClick={() => navigate("/")} > <IoEnter /> <p className="font-semibold m-0 " >Voltar</p></div> : isGerente ? <div className=" customBorder shadow-sm flex items-center justify-center gap-2 hover:text-black text-white bg-black cursor-pointer hover:bg-white p-2 rounded-md w-full hover:shadow-lg transiton-all duration-300" onClick={() => navigate("/gestoria")} > <IoEnter /> <p className="font-semibold m-0 " >Gestoria</p></div> : null }
          { page == "/gestoriaInterna" ? <div className=" customBorder shadow-sm flex items-center justify-center gap-2 hover:text-white text-black bg-white cursor-pointer hover:bg-black p-2 rounded-md w-full hover:shadow-lg transiton-all duration-300" onClick={() => navigate("/")} > <IoEnter /> <p className="font-semibold m-0 " >Voltar</p></div> : isInterno && !isSupervisor ? <div className=" customBorder shadow-sm flex items-center justify-center gap-2 hover:text-black text-white bg-black cursor-pointer hover:bg-white p-2 rounded-md w-full hover:shadow-lg transiton-all duration-300" onClick={() => navigate("/gestoriaInterna")} > <IoEnter /> <p className="font-semibold m-0 " >Gestoria (Internos)</p></div> : null }
          { page == "/supergestoria" ? <div className=" customBorder shadow-sm flex items-center justify-center gap-2 hover:text-white text-black bg-white cursor-pointer hover:bg-black p-2 rounded-md w-full hover:shadow-lg transiton-all duration-300" onClick={() => navigate("/")} > <IoEnter /> <p className="font-semibold m-0 " >Voltar</p></div> : isSupervisor ? <div className=" customBorder shadow-sm flex items-center justify-center gap-2 hover:text-black text-white bg-black cursor-pointer hover:bg-white p-2 rounded-md w-full hover:shadow-lg transiton-all duration-300" onClick={() => navigate("/supergestoria")} > <IoEnter /> <p className="font-semibold m-0 " >Super Gestoria (Internos)</p></div> : null }
          { page == "/visualizador" ? <div className=" customBorder shadow-sm flex items-center justify-center gap-2 hover:text-white text-black bg-white cursor-pointer hover:bg-black p-2 rounded-md w-full hover:shadow-lg transiton-all duration-300" onClick={() => navigate("/")} > <IoEnter /> <p className="font-semibold m-0 " >Voltar</p></div> : isVisualizador ? <div className=" customBorder shadow-sm flex items-center justify-center gap-2 hover:text-black text-white bg-black cursor-pointer hover:bg-white p-2 rounded-md w-full hover:shadow-lg transiton-all duration-300" onClick={() => navigate("/visualizador")} > <IoEnter /> <p className="font-semibold m-0 " >Visualizador</p></div> : null }

          <div className="flex items-center justify-center gap-2 cursor-pointer p-2 rounded-md bg-red-500 w-full hover:bg-red-800 hover:shadow-lg transiton-all duration-300" onClick={() => handleLogOut()}><CiLogout /><p className="text-white font-semibold m-0" >Sair</p></div>
        </div>
    )
}