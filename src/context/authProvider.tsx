import { ReactNode, createContext, useState } from "react";
import { ajax } from "../ajax/ajax";

interface AuthContextData {
    signed: boolean;
    user: any;
    loading: boolean;
    attAuthStatus: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(() => {
        const userFromStorage = localStorage.getItem('user');
        return userFromStorage ? JSON.parse(userFromStorage) : null;
    });
    const [loadingAuth, setLoadingAuth] = useState<boolean>(false);


    const attAuthStatus = async () => {
            setLoadingAuth(true);
            try {
                console.log("Chamou a att")
                const response = await ajax({method: "GET", endpoint: "/authStatus", data: null})
                if (!response) {
                    setUser(null);
                    localStorage.removeItem('user');
                    setLoadingAuth(false);
                    return;
                }
                if (response.status == "success") {
                    console.log("atualizou o user no authProvider")
                    setUser(response.user);
                    localStorage.setItem('user', JSON.stringify(response.user));

                }
                if (response.status == "error") {
                    console.log("O cara está deslogado");
                    localStorage.removeItem('user');
                    setUser(null);  
                }
                setLoadingAuth(false);
            }
            catch(err) {
                setUser(null);
                localStorage.removeItem('user');
                setLoadingAuth(false);
            }
        }

    return (
        <AuthContext.Provider
        value={{ signed: !!user, user: user, loading: loadingAuth, attAuthStatus}}
        >
            {children}  
        </AuthContext.Provider>
    )
}

export default AuthProvider;