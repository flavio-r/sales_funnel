import { HeaderGestoria } from "./headerGestoria"
import { Outlet } from "react-router-dom"
import React from 'react';
import { useState } from "react";


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
    const [search, setSearch] = useState<string>('');
    const [filters, setFilters] = useState({});
    const [gerenciados, setGerenciados] = useState<gerenciado[]>([]);
    const [allGerenciados, setAllGerenciados] = useState<gerenciado[]>([]);
    const [indicadores, setIndicadores] = useState<any>({});
    return (
        <>
        <SearchContextGestoria.Provider value={{searchValue: search, filters: filters, gerenciados: gerenciados, allGerenciados: allGerenciados, indicadoresContext: indicadores, alteraIndicadores: setIndicadores}}>
            <HeaderGestoria setSearch={setSearch} setFilters={setFilters} setGerenciadosContext={setGerenciados} setAllGerenciadosContext={setAllGerenciados} />
            <Outlet/>
        </SearchContextGestoria.Provider>
        </>
    )
}