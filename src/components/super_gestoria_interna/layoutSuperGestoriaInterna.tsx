import { HeaderSuperGestoriaInterna } from "./headerSuperGestoriaInterna"
import { Outlet } from "react-router-dom"
import React from 'react';
import { externoSupervisionado } from "./headerSuperGestoriaInterna";

import { useState } from "react";
import { AuthContext } from '../../context/authProvider';
import { useContext } from "react";
import { ajax } from "../../ajax/ajax";

interface headerContextData {
    searchValue: string;
    filters: any;
    gerenciados: any;
    allGerenciados: externoSupervisionado[];
    indicadoresContext: any;
    alteraIndicadores: any;
}



const SearchContextGestoria = React.createContext({} as headerContextData);

export default SearchContextGestoria;

export function LayoutSuperGestoriaInterna() {
    const [search, setSearch] = useState<string>('');
    const [allGerenciados, setAllGerenciados] = useState<externoSupervisionado[]>([]);
    const [indicadores, setIndicadores] = useState<any>({});

    const { user, loading, attAuthStatus } = useContext(AuthContext);
    if (loading) return null;
    
    const updateFilters = async (filtros: any) => {
        await ajax({method: "PATCH", endpoint: "/atualizarFiltro", data: { filtros }})
        attAuthStatus();
        console.log("Atualizou status local do usario com os filtros")
        console.log(filtros);
    }


    const updateExternos = async (supervisionados: any) => {
        try {
            await ajax({method: "PATCH", endpoint: "/atualizarSupervisionados", data: { supervisionados }});
            
            // Update the state
            setAllGerenciados(supervisionados);
        
        
            attAuthStatus();
        
        
        } catch (err) {
            console.error("Error updating externos:", err);
        }
    }

    return (
        <>
        <SearchContextGestoria.Provider value={{searchValue: search, filters: user.filtros.filtros, gerenciados: user.supervisionados.supervisionados, allGerenciados: allGerenciados, indicadoresContext: indicadores, alteraIndicadores: setIndicadores}}>
            <HeaderSuperGestoriaInterna Supervisionados={user.supervisionados.supervisionados} Filters={user.filtros.filtros} setSearch={setSearch} setFilters={updateFilters} setExternosContext={updateExternos} setAllExternosContext={setAllGerenciados} />
            <Outlet/>
        </SearchContextGestoria.Provider>
        </>
    )
}