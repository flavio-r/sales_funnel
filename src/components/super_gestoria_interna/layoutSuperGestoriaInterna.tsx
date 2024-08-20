import { HeaderSuperGestoriaInterna } from "./headerSuperGestoriaInterna"
import { Outlet } from "react-router-dom"
import React from 'react';
import { useState } from "react";
import { externoSupervisionado } from "./headerSuperGestoriaInterna";

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
    const [filters, setFilters] = useState({});
    const [externos, setExternos] = useState<externoSupervisionado[]>([]);
    const [allGerenciados, setAllGerenciados] = useState<externoSupervisionado[]>([]);
    const [indicadores, setIndicadores] = useState<any>({});
    return (
        <>
        <SearchContextGestoria.Provider value={{searchValue: search, filters: filters, gerenciados: externos, allGerenciados: allGerenciados, indicadoresContext: indicadores, alteraIndicadores: setIndicadores}}>
            <HeaderSuperGestoriaInterna setSearch={setSearch} setFilters={setFilters} setExternosContext={setExternos} setAllExternosContext={setAllGerenciados} />
            <Outlet/>
        </SearchContextGestoria.Provider>
        </>
    )
}