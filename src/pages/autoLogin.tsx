import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ajax } from "../ajax/ajax";
import { LoadingModal } from "../components/modalLoading";
import { AuthContext } from "../context/authProvider";
import { useContext } from "react";
import { getHubUrl, isDevelopment } from "../utils/helpers";
import toast, { Toaster } from "react-hot-toast";
export function AutoLogin() {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  //    const a = 123;

  const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  };

  const logout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    deleteAllCookies();
    await ajax({ method: "GET", endpoint: "/logout", data: null });
    logingAutomatico();
  };

  const login = async (dataLogin: any) => {
    const response = await ajax({
      method: "POST",
      endpoint: "/loginSession",
      data: dataLogin,
    });

    if (response.status == "error") {
      const errorMessage =
        response.message || "Erro ao realizar login automático";
      console.error("Erro no login automático:", response);

      if (isDevelopment()) {
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        window.location.href = getHubUrl();
      }
      return;
    }

    if (response.status == "success") {
      navigate("/");
      window.location.reload();
      return;
    }
  };
  const logingAutomatico = async () => {
    const searchParams = new URLSearchParams(location.search);
    const loginDataEncoded = searchParams.get("login");

    const dataLogin = { sessionId: loginDataEncoded };
    await login(dataLogin);
  };

  useEffect(() => {
    if (user) {
      //replaced cons log
      logout();
    } else {
      logingAutomatico();
    }
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      {error ? (
        <div className="flex flex-col items-center gap-4 p-8 bg-red-50 border border-red-200 rounded-md">
          <h1 className="text-red-600 font-semibold text-xl">
            Erro no Login Automático
          </h1>
          <p className="text-red-800">{error}</p>
          <p className="text-sm text-gray-600">
            Verifique o console do navegador para mais detalhes.
          </p>
        </div>
      ) : (
        <>
          <h1>Realizando login automático</h1>
          <LoadingModal />
        </>
      )}
      <Toaster />
    </div>
  );
}
