export const formatDate = (data: Date) => {
    var dia: string | number = data.getDate();
    var mes: string | number = data.getMonth() + 1; 
    var ano: number = data.getFullYear();

    dia = dia < 10 ? '0' + dia : dia;
    mes = mes < 10 ? '0' + mes : mes;

    return dia + '/' + mes + '/' + ano;
}


export const achaNumAssunto = (assunto: any, tipo: any) => {
    if (tipo == "Comunicação") {
        switch (assunto) {
            case "Visita":
                assunto = 80;
                break;
            case "Pedido":
                assunto = 81;
                break;
            case "Orçamento":
                assunto = 82;
                break;
            case "O.S.":
                assunto = 83;
                break;
            case "Demonstração":
                assunto = 84;
                break;
            case "Dúvida":
                assunto = 85;
                break;
            case "Financeiro":
                assunto = 86;
                break;
            case "Entrega":
                assunto = 87;
                break;
            case "Reclamação":
                assunto = 97;
                break;
            case "Retorno":
                assunto = 99;
                break;
            default:
                assunto = false
                break;
        }
        return assunto;
    }
    if (tipo == "Lembrete") {
        switch (assunto) {
            case "Visita":
                assunto = 88;
                break;
            case "Pedido":
                assunto = 89;
                break;
            case "Orçamento":
                assunto = 90;
                break;
            case "O.S.":
                assunto = 91;
                break;
            case "Demonstração":
                assunto = 92;
                break;
            case "Dúvida":
                assunto = 93;
                break;
            case "Financeiro":
                assunto = 94;
                break;
            case "Entrega":
                assunto = 95;
                break;
            case "Reclamação":
                assunto = 96;
                break;
            case "Retorno":
                assunto = 98;
                break;
            default:
                assunto = false
                break;
        }
        return assunto;
    }

}
