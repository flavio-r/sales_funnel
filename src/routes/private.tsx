import { ReactNode, useContext } from "react";
import { AuthContext } from "../context/authProvider";
import { useEffect } from "react";
import { useState } from "react";
import { LoadingModal } from "../components/modalLoading";
import { useLocation } from "react-router-dom";
import { ajax } from "../ajax/ajax";
import { getHubUrl, isDevelopment } from "../utils/helpers";
import toast, { Toaster } from "react-hot-toast";

interface PrivateProps {
  children: ReactNode;
}

export function Private({ children }: PrivateProps): any {
  const { user, signed, loading, attAuthStatus } = useContext(AuthContext);
  const [authStatusChecked, setAuthStatusChecked] = useState(false);
  const [isAutoLogging, setIsAutoLogging] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        const errorMessage = response.message || "Erro ao realizar login automático";
        console.error("Erro no login automático:", response);
        
        // Temporariamente removido redirecionamento - apenas exibe erro
        setError(errorMessage);
        toast.error(errorMessage);
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
    } catch (error: any) {
      const errorMessage = error?.message || "Erro inesperado no login automático";
      console.error("Erro no login automático:", error);
      
      // Temporariamente removido redirecionamento - apenas exibe erro
      setError(errorMessage);
      toast.error(errorMessage);
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
    return (
      <>
        <LoadingModal />
        <Toaster />
      </>
    );
  }
  
  if (error) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 p-8 bg-red-50 border border-red-200 rounded-md max-w-md">
          <h1 className="text-red-600 font-semibold text-xl">Erro de Autenticação</h1>
          <p className="text-red-800">{error}</p>
          <p className="text-sm text-gray-600">Verifique o console do navegador para mais detalhes.</p>
        </div>
        <Toaster />
      </div>
    );
  }
  
  if (!loading && !signed) {
    //replaced cons log
    // Temporariamente removido redirecionamento - apenas exibe erro
    const errorMessage = "Usuário não autenticado";
    console.error(errorMessage);
    toast.error(errorMessage);
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 p-8 bg-red-50 border border-red-200 rounded-md max-w-md">
          <h1 className="text-red-600 font-semibold text-xl">Erro de Autenticação</h1>
          <p className="text-red-800">{errorMessage}</p>
          <p className="text-sm text-gray-600">Verifique o console do navegador para mais detalhes.</p>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
