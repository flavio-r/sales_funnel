import { ReactNode, useContext } from "react";
import { AuthContext } from "../context/authProvider";
import { useEffect } from "react";
import { useState } from "react";
import { LoadingModal } from "../components/modalLoading";
import { useLocation } from "react-router-dom";
import { ajax } from "../ajax/ajax";

interface PrivateProps {
  children: ReactNode;
}

export function Private({ children }: PrivateProps): any {
  const { user, signed, loading, attAuthStatus } = useContext(AuthContext);
  const [authStatusChecked, setAuthStatusChecked] = useState(false);
  const [isAutoLogging, setIsAutoLogging] = useState(false);
  const location = useLocation();

  const loginWithSessionId = async (sessionId: string) => {
    setIsAutoLogging(true);
    try {
      const response = await ajax({
        method: "POST",
        endpoint: "/loginSession",
        data: { sessionId: sessionId },
      });

      if (response.status === "error") {
        window.location.href = "https://hub.copapel.com.br/";
        return;
      }

      if (response.status === "success") {
        // Remove o parâmetro sessionId da URL após login bem-sucedido
        const url = new URL(window.location.href);
        url.searchParams.delete("sessionId");
        window.history.replaceState({}, "", url.pathname + url.search);

        // Recarrega a página para aplicar a autenticação
        window.location.reload();
        return;
      }
    } catch (error) {
      console.error("Erro no login automático:", error);
      window.location.href = "https://hub.copapel.com.br/";
    } finally {
      setIsAutoLogging(false);
    }
  };

  useEffect(() => {
    // Verifica se há um sessionId na URL
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get("sessionId");

    if (sessionId && !signed && !user) {
      // Se há sessionId na URL e usuário não está logado, faz login automático
      loginWithSessionId(sessionId);
      return;
    }

    if (!signed || !user) {
      attAuthStatus();
    }
    setAuthStatusChecked(true);
  }, [location.search, signed, user]);

  if (loading || !authStatusChecked || isAutoLogging) {
    return <LoadingModal />;
  }
  if (!loading && !signed) {
    //replaced cons log
    return (window.location.href = "https://hub.copapel.com.br/");
  }

  return children;
}
