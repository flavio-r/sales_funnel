export const isDevelopment = () => {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
};

export const getHubUrl = () => {
  return isDevelopment() ? "/login" : "https://hub.copapel.com.br/";
};

export const formatDate = (data: Date) => {
  var dia: string | number = data.getDate();
  var mes: string | number = data.getMonth() + 1;
  var ano: number = data.getFullYear();

  dia = dia < 10 ? "0" + dia : dia;
  mes = mes < 10 ? "0" + mes : mes;

  return dia + "/" + mes + "/" + ano;
};

export const categorizarAssuntos = (assuntos: any[]) => {
  const sucesso = [102, 94, 90, 93, 108, 95, 105, 104, 91, 89, 106, 103, 96];
  const insucesso = [107, 98, 100];

  const assuntosCategorizados = {
    sucesso: assuntos.filter((assunto) => sucesso.includes(assunto.Code)),
    insucesso: assuntos.filter((assunto) => insucesso.includes(assunto.Code)),
  };

  return assuntosCategorizados;
};

export const achaNumAssunto = (assunto: any) => {
  // Retorna diretamente o código numérico da API
  if (typeof assunto === "number" || !isNaN(Number(assunto))) {
    return Number(assunto);
  }

  // Se não for um número válido, retorna false
  return false;
};
