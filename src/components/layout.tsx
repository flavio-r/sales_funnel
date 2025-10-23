import { Header } from "./header/header";
import { Outlet, useLocation } from "react-router-dom";
import React from "react";
import { useState, useEffect } from "react";
import { AuthContext } from "../context/authProvider";
import { useContext } from "react";
import { filter_fields } from "./modalFilter";
import { ajax } from "../ajax/ajax";

interface headerContextData {
  searchValue: string;
  filters: filter_fields;
  isGestor: boolean;
}

const SearchContext = React.createContext({} as headerContextData);

export default SearchContext;

export function Layout() {
  const [search, setSearch] = useState<string>("");
  const [isGestor, setIsGestor] = useState<boolean>(false);
  const [isAutoLogging, setIsAutoLogging] = useState(false);
  const location = useLocation();

  const { user, loading, attAuthStatus } = useContext(AuthContext);

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

    if (sessionId && !user && !loading) {
      // Se há sessionId na URL e usuário não está logado, faz login automático
      loginWithSessionId(sessionId);
      return;
    }

    if (!user && !loading) {
      attAuthStatus();
    }
  }, [location.search, user, loading]);

  if (loading || isAutoLogging) {
    return <></>;
  }

  const updateFilters = async (filtros: any) => {
    await ajax({
      method: "PATCH",
      endpoint: "/atualizarFiltro",
      data: { filtros },
    });
    attAuthStatus();
  };

  return (
    <>
      <SearchContext.Provider
        value={{
          searchValue: search,
          filters: user?.filtros?.filtros,
          isGestor: isGestor,
        }}
      >
        <Header
          Filters={user?.filtros?.filtros}
          setSearch={setSearch}
          setFilters={updateFilters}
          setGestor={setIsGestor}
        />
        <Outlet />
      </SearchContext.Provider>
    </>
  );
}
