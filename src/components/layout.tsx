import { Header } from "./header/header"
import { Outlet } from "react-router-dom"
import React from 'react';
import { useState, useEffect } from "react";
import { AuthContext } from '../context/authProvider';
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
    const [search, setSearch] = useState<string>('');
    const [isGestor, setIsGestor] = useState<boolean>(false);


    const { user, loading, attAuthStatus } = useContext(AuthContext);

    if (loading) return null;


    const updateFilters = async (filtros: any) => {
        const response = await ajax({method: "PATCH", endpoint: "/atualizarFiltro", data: { filtros }})
        attAuthStatus();
        console.log(response);
    }


    return (
        <>
            <SearchContext.Provider value={{searchValue: search, filters: user.filtros.filtros, isGestor: isGestor }}>
                <Header Filters={user.filtros.filtros} setSearch={setSearch} setFilters={updateFilters} setGestor={setIsGestor} />
                <Outlet/>
            </SearchContext.Provider>
        </>
    )
}