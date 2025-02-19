import { HeaderGestoria } from "./headerGestoria"
import { Outlet } from "react-router-dom"
import React from 'react';

import { useState } from "react";
import { AuthContext } from '../../context/authProvider';
import { useContext } from "react";
import { ajax } from "../../ajax/ajax";

export interface headerContextData {
    searchValue: string;
    filters: any;
    gerenciados: any;
    allGerenciados: gerenciado[];
    indicadoresContext: any;
    alteraIndicadores: any;
}

interface gerenciado {
    CodigoVendedor: string;
    VendedorExterno: string;
    Selecionado: boolean;
    SlpName: string;
}

const SearchContextGestoria = React.createContext({} as headerContextData);

export default SearchContextGestoria;

export function LayoutGestoria() {
    const { user, loading, attAuthStatus } = useContext(AuthContext);

    const [search, setSearch] = useState<string>('');
    const [allGerenciados, setAllGerenciados] = useState<gerenciado[]>([]);
    const [indicadores, setIndicadores] = useState<any>({});
    
    if (loading) return null;
    
    const updateFilters = async (filtros: any) => {
        await ajax({method: "PATCH", endpoint: "/atualizarFiltro", data: { filtros }})
        attAuthStatus();
        console.log("Atualizou status local do usario com os filtros")
        console.log(filtros);
    }

    
    const updateGerenciados = async (gerenciados: any) => {
        try {
            await ajax({method: "PATCH", endpoint: "/atualizarGerenciados", data: { gerenciados }});
            
            // Update the state
            setAllGerenciados(gerenciados);
        
        
            attAuthStatus();
        } catch (err) {
            console.error("Error updating externos:", err);
        }
    }



    return (
        <>
        <SearchContextGestoria.Provider value={{searchValue: search, filters: user.filtros.filtros, gerenciados: user.gerenciados, allGerenciados: allGerenciados, indicadoresContext: indicadores, alteraIndicadores: setIndicadores}}>
            <HeaderGestoria Gerenciados={user.gerenciados} Filters={user.filtros.filtros} setGerenciadosContext={updateGerenciados} setSearch={setSearch} setFilters={updateFilters} setAllGerenciadosContext={setAllGerenciados} />
            <Outlet/>
        </SearchContextGestoria.Provider>
        </>
    )
}