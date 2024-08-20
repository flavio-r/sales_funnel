/*
import { ReactNode } from "react";
import SearchContext from "../components/layout";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
interface GestorProps {
    children: ReactNode;
}

export function Gestor({children}: GestorProps): any {
    const {isGestor} = useContext(SearchContext);
    const navigate = useNavigate();
    


    useEffect(() => {
        if (!isGestor) {
            navigate("/");
        }
        if (isGestor) {
            return children;
        }
    }, [isGestor])

}
*/