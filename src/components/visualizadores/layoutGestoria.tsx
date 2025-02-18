import { HeaderVisualizadores } from "./headerVisualizadores"
import { Outlet } from "react-router-dom"
import React from 'react';

import { useState } from "react";
import { AuthContext } from '../../context/authProvider';
import { useContext } from "react";
import { ajax } from "../../ajax/ajax";



interface headerContextData {
    searchValue: string;
    filters: any;
    gerenciados: any;
    allGerenciados: gerenciado[];
    indicadoresContext: any;
    alteraIndicadores: any;
}

export interface gerenciado {
    CodigoVendedor: string;
    VendedorExterno: string;
    Selecionado: boolean;
    SlpName: string;
}

const SearchContextGestoria = React.createContext({} as headerContextData);

export default SearchContextGestoria;

export function LayoutVisualizadores(): JSX.Element {
    const [search, setSearch] = useState<string>('');
    const [gerenciados, setGerenciados] = useState<gerenciado[]>([]);
    const [allGerenciados, setAllGerenciados] = useState<gerenciado[]>([]);
    const [indicadores, setIndicadores] = useState<any>({});

    const { user, loading, attAuthStatus } = useContext(AuthContext);
    if (loading) return <></>;
    
    //if (!user) return attAuthStatus();

    const updateFilters = async (filtros: any) => {
        await ajax({method: "PATCH", endpoint: "/atualizarFiltro", data: { filtros }})
        attAuthStatus();
    }

    return (
        <>
        <SearchContextGestoria.Provider value={{searchValue: search, filters: user.filtros.filtros, gerenciados: gerenciados, allGerenciados: allGerenciados, indicadoresContext: indicadores, alteraIndicadores: setIndicadores}}>
            <HeaderVisualizadores Filters={user.filtros.filtros} setSearch={setSearch} setFilters={updateFilters} setGerenciadosContext={setGerenciados} setAllGerenciadosContext={setAllGerenciados} />
            <Outlet/>
        </SearchContextGestoria.Provider>
        </>
    )
}