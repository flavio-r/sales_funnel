const env = import.meta.env.VITE_ENV_NAME;

interface Request {
  method: string;
  endpoint: string;
  data: any;
  signal?: AbortSignal;
}

const deleteAllCookies = () => {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
};

export async function ajax({ method, endpoint, data, signal }: Request) {
  var url;
  if (env == "dev") {
    url = "http://localhost:8006/requests" + endpoint;
  } else if (env == "prd") {
    url = "https://funilapi.copapel.com.br/requests" + endpoint;
  } else {
    url = "https://funilapi.copapel.com.br/requests" + endpoint;
  }

  try {
    const options: any = {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-requested-with": "XMLHttpRequest",
      },
      credentials: "include",
      signal,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }
    const response: any = await fetch(url, options);
    const responseJson = await response.json();

    if (responseJson.message == "Unauthorized") {
      if (endpoint === "/logout") {
        return;
      }

      deleteAllCookies();
      localStorage.clear();
      sessionStorage.clear();

      return (window.location.href = "https://hub.copapel.com.br/");
    }
    return responseJson;
  } catch (err: any) {
    // Verificar se a falha ocorreu devido ao cancelamento da requisição
    if (err.name === "AbortError") {
      return; // Retornar sem fazer nada se a requisição foi cancelada
    }
    return { status: "internal_error", message: err };
  }
}
