import { HeaderGestoriaInterna } from "./headerGestoriaInterna"
import { Outlet } from "react-router-dom"
import React from 'react';
import { useState } from "react";
import { externo } from "./headerGestoriaInterna";

interface headerContextData {
    searchValue: string;
    filters: any;
    gerenciados: any;
    allGerenciados: externo[];
    indicadoresContext: any;
    alteraIndicadores: any;
}



const SearchContextGestoria = React.createContext({} as headerContextData);

export default SearchContextGestoria;

export function LayoutGestoriaInterna() {
    const [search, setSearch] = useState<string>('');
    const [filters, setFilters] = useState({});
    const [externos, setExternos] = useState<externo[]>([]);
    const [allGerenciados, setAllGerenciados] = useState<externo[]>([]);
    const [indicadores, setIndicadores] = useState<any>({});
    return (
        <>
        <SearchContextGestoria.Provider value={{searchValue: search, filters: filters, gerenciados: externos, allGerenciados: allGerenciados, indicadoresContext: indicadores, alteraIndicadores: setIndicadores}}>
            <HeaderGestoriaInterna setSearch={setSearch} setFilters={setFilters} setExternosContext={setExternos} setAllGerenciadosContext={setAllGerenciados} />
            <Outlet/>
        </SearchContextGestoria.Provider>
        </>
    )
}