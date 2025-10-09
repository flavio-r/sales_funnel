import { ReactNode, createContext, useState } from "react";
import { ajax } from "../ajax/ajax";
import { filter_fields } from "../components/modalFilter";

export interface user {
  id: number;
  name: string;
  id_sap: number;
  empId: number;
  user_code: string;
  senha: string;
  filtros: filter_fields;
}

interface AuthContextData {
  signed: boolean;
  user: any;
  loading: boolean;
  attAuthStatus: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<user | null>(() => {
    const userFromStorage = localStorage.getItem("user");
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  });
  const [loadingAuth, setLoadingAuth] = useState<boolean>(false);

  // Toda vez que a func eh chamada ela re-renderiza pois é um componente pai (provider) alterando estado
  const attAuthStatus = async () => {
    setLoadingAuth(true);
    try {
      //replaced cons log
      const response = await ajax({
        method: "GET",
        endpoint: "/authStatus",
        data: null,
      });
      if (!response) {
        setUser(null);
        localStorage.removeItem("user");
        setLoadingAuth(false);
        return;
      }
      if (response.status == "success" && response.user) {
        //replaced cons log
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      if (response.status == "error") {
        //replaced cons log
        localStorage.removeItem("user");
        setUser(null);
      }
      setLoadingAuth(false);
    } catch (err) {
      console.error("Auth error:", err);
      setUser(null);
      localStorage.removeItem("user");
      setLoadingAuth(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user: user,
        loading: loadingAuth,
        attAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
