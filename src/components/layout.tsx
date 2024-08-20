import { Header } from "./header/header"
import { Outlet } from "react-router-dom"
import React from 'react';
import { useState } from "react";


interface headerContextData {
    searchValue: string;
    filters: any;
    isGestor: boolean;
}

const SearchContext = React.createContext({} as headerContextData);

export default SearchContext;

export function Layout() {
    const [search, setSearch] = useState<string>('');
    const [filters, setFilters] = useState({});
    const [isGestor, setIsGestor] = useState<boolean>(false);
    return (
        <>
        <SearchContext.Provider value={{searchValue: search, filters: filters, isGestor: isGestor }}>
            <Header setSearch={setSearch} setFilters={setFilters} setGestor={setIsGestor} />
            <Outlet/>
        </SearchContext.Provider>
        </>
    )
}