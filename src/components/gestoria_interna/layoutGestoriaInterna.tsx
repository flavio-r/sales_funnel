import { HeaderGestoriaInterna } from "./headerGestoriaInterna"
import { Outlet } from "react-router-dom"
import React from 'react';
import { externo } from "./headerGestoriaInterna";
import { useState } from "react";
import { AuthContext } from '../../context/authProvider';
import { useContext, useCallback } from "react";
import { ajax } from "../../ajax/ajax";

interface headerContextData {
    searchValue: string;
    filters: any;
    gerenciados: any;
    allGerenciados: externo[];
    indicadoresContext: any;
    alteraIndicadores: any;
    allVendors: any;
}

export interface vendor {
    CodigoVendedor: string;
    NomeCompletoVendedor: string;
}


const SearchContextGestoria = React.createContext({} as headerContextData);

export default SearchContextGestoria;

export function LayoutGestoriaInterna() {
    const [search, setSearch] = useState<string>('');
    const [allGerenciados, setAllGerenciados] = useState<externo[]>([]);
    const [indicadores, setIndicadores] = useState<any>({});
    const [allVendors, setAllVendors] = useState<vendor[]>([]);

    const { user, loading, attAuthStatus } = useContext(AuthContext);
    
    if (loading) return null;
    
    const updateFilters = async (filtros: any) => {
        await ajax({method: "PATCH", endpoint: "/atualizarFiltro", data: { filtros }})
        attAuthStatus();
        console.log("Atualizou status local do usario com os filtros")
        console.log(filtros);
    }

    
    const updateExternos = async (externos: any) => {
        try {
            await ajax({method: "PATCH", endpoint: "/atualizarExternos", data: { externos }});
            
            // Update the state
            setAllGerenciados(externos);
        
        
            attAuthStatus();
        
        
        } catch (err) {
            console.error("Error updating externos:", err);
        }
    }

    return (
        <>
        <SearchContextGestoria.Provider value={{searchValue: search, allVendors: allVendors, filters: user.filtros.filtros, gerenciados: user.externos.externos, allGerenciados: allGerenciados, indicadoresContext: indicadores, alteraIndicadores: setIndicadores}}>
            <HeaderGestoriaInterna Externos={user.externos.externos} Filters={user.filtros.filtros} setSearch={setSearch} setFilters={updateFilters} setExternosContext={updateExternos} setAllGerenciadosContext={setAllGerenciados} setAllVendorsContext={setAllVendors} />
            <Outlet/>
        </SearchContextGestoria.Provider>
        </>
    )
}