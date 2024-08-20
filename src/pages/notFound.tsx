import { GrnBtn } from "../components/greenBtn" 
import { FaBackward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export function NotFound() {
    const navigate = useNavigate();
    
    return (
        <div className="w-full pageHeight flex flex-col items-center justify-center" >
            <p className="text-3xl font-semibold" >Página não existe!</p>
            <GrnBtn nomeBtn="Voltar"  onClick={() => navigate("/")} icon={<FaBackward  size={18}/>}></GrnBtn>
        </div>
    )
}