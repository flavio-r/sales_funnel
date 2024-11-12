import { ReactNode, useContext } from "react";
import { AuthContext } from "../context/authProvider";
import { useEffect } from "react";
import { useState } from "react";
import { LoadingModal } from "../components/modalLoading";

interface PrivateProps {
    children: ReactNode;
}

export function Private({children}: PrivateProps): any {
    const { signed, loading, attAuthStatus } = useContext(AuthContext);
    const [authStatusChecked, setAuthStatusChecked] = useState(false);

    
    useEffect(() => {
        if (!signed) {
            attAuthStatus();
        }
        setAuthStatusChecked(true);
    }, []);

    if (loading || !authStatusChecked) {
        return  (
            <LoadingModal/>
        )
    }
    if (!loading && !signed) {
        console.log("Detectou mano não logado!");
        return window.location.href = 'https://hub.copapel.com.br/';
    }

    return children;
}