import {RegisterOptions, UseFormRegister} from 'react-hook-form';
import { colaborador } from './modalAddOportunity';
import { estado, municipio } from '../pages/leads';
import { regiao } from './modalFilter';
interface input {
    placeholder: string;
    name: string;
    icon?: any;
    error?: string;
    rules?: RegisterOptions;
    insidePlaceholder?: string;
    preValue?: string | number;
    tipo?: string;
    register: UseFormRegister<any>;
    requiredDefault?: boolean;
    funcaoAoMudar?: (e: any) => void;
    itens?: any;
    colaboradores?: any;
    id?: string;
    disabled?: boolean;
    estados?: estado[];
    municipios?: municipio[];
    regioes?: regiao[];
    customCss?: string;
}
export function SelectDados({customCss, tipo, funcaoAoMudar, requiredDefault, preValue, register, placeholder, name, icon, error, rules, itens, disabled = false, id, colaboradores, estados, municipios, regioes}: input) {
    console.log(tipo);
    console.log(regioes);
    return (
        <div className={`${customCss}  relative mt-4 `}>
            <p className="m-0 font-semibold text-sm">{placeholder}</p>
            <div className="absolute ml-2 mt-3 flex items-center justify-center">{icon}</div>
            <div className='flex items-center'>
            <select id={id ? id : undefined} disabled={disabled}  {...(requiredDefault ? { required: true } : {})} {...funcaoAoMudar ? { ...register(name, { onChange: (e) => funcaoAoMudar(e) } ) } : { ...register(name, rules ) } }    className={` ${disabled ? "bg-gray-200  " : ""} corPlaceholder text-black fontePadrao font-semibold colocarBorda w-full h-10 rounded-md border-none text-lg  ${icon ? 'pl-9' : 'pr-6 pl-2'} focus:outline-none focus:border-2`} >
                {
                    tipo == 'assunto' ? 
                    <>
                        <option value="Visita">Visita</option>
                        <option value="Pedido">Pedido</option>
                        <option value="Orçamento">Orçamento</option>
                        <option value="O.S.">O.S.</option>
                        <option value="Demonstração">Demonstração</option>
                        <option value="Dúvida">Dúvida</option>
                        <option value="Financeiro">Financeiro</option>
                        <option value="Entrega">Entrega</option>
                        <option value="Reclamação">Reclamação</option>
                        <option value="Retorno">Retorno</option>
                    </>
                    : ""
                }
                {
                    tipo == 'tipo' ? 
                    <>
                        <option selected={preValue == "Lembrete"} value="10" className='text-black opacity-100' >Lembrete</option>
                        <option selected={preValue == "Comunicação"} value="11">Comunicação</option>
                    </>
                    : ""
                }
                {
                    tipo == 'canal' ? 
                    <>
                    <option selected={preValue == "4"} value="4">Comercial Externo (presencial)</option>
                    <option selected={preValue == "7"} value="7">Telefonema</option>
                    <option selected={preValue == "6"} value="6">Whatsapp</option>
                    <option selected={preValue == "8"} value="8">E-mail</option>
                    </>
                    :
                    ""
                }
                
                { tipo == 'segmento' ? 
                <>
                <option selected={preValue == "102"} value="102">Academia</option>
                <option selected={preValue == "103"}value="103">Aliementos e Bebidas</option>
                <option selected={preValue == "104"}value="104">Condomínio</option>
                <option selected={preValue == "105"}value="105">Construção Civil</option>
                <option selected={preValue == "106"}value="106">Educação</option>
                <option selected={preValue == "107"}value="107">Entreterimento</option>
                <option selected={preValue == "108"}value="108">Facilities</option>
                <option selected={preValue == "109"}value="109">Food Service</option>
                <option selected={preValue == "110"}value="110">Hotelaria</option>
                <option selected={preValue == "111"}value="111">Indústria em Geral</option>
                <option selected={preValue == "112"}value="112">Inst. Financeiras</option>
                <option selected={preValue == "113"}value="113">Inst. Religiosa</option>
                <option selected={preValue == "114"}value="114">Lavandeira</option>
                <option selected={preValue == "115"}value="115">Outros</option>
                <option selected={preValue == "116"}value="116">Pessoa Física</option>
                <option selected={preValue == "117"}value="117">Revenda</option>
                <option selected={preValue == "118"}value="118">Saúde</option>
                <option selected={preValue == "119"}value="119">Setor Público</option>
                <option selected={preValue == "120"}value="120">Supermercado</option>
                <option selected={preValue == "121"}value="121">Transportes</option>
                <option selected={preValue == "122"}value="122">Varejo</option>                
                </>
                :
                ""
                }
                {
                    tipo == "pgto" ?
                <>
                <option value="CR_Boleto BRADE">Boleto Bradesco ( Clientes copapel )</option>
                <option value="CR_Boleto">Boleto ( Clientes Rejovel )</option>
                </>
                :
                ""
                }
                {
                    tipo == "atribuidos" ?
                    itens.map((item: any) => {
                        return <option selected={item.userId == preValue} value={item.userId}>{item.firstName} {item.lastName}</option>
                    }) 
                    :
                    ""
                }
                {
                    tipo == "colaboradores" ?
                    colaboradores.map((colaborador: colaborador) => {
                        return <option selected={colaborador.CodigoVendedorColaborador == preValue} value={colaborador.CodigoVendedorColaborador}>{colaborador.NomeColaborador}</option>
                    })
                    :
                    ""
                }
                {
                    tipo == "estados" ?
                    estados?.map((estado: estado) => {
                        return <option selected={estado.Code == preValue} value={estado.Code}>{estado.Name}</option>
                    })
                    :
                    ""
                }
                {
                    tipo == "municipios" ?
                    municipios?.map((municipio: municipio) => {
                        return <option selected={municipio.AbsId == preValue} value={municipio.AbsId ? municipio.AbsId : ''}>{municipio.Name ? municipio.Name : 'Sem filtro'}</option>
                    })
                    :
                    ""
                }
                {
                    tipo == "heatLevels" ? (
                        <>
                            <option value="">Sem filtro</option>
                            <option value="-1">Sem interesse</option>
                            <option value="1">Baixo interesse</option>
                            <option value="2">Médio interesse</option>
                            <option value="3">Alto interesse</option>
                            <option value="4">Extremo interesse</option>
                        </>
                    ) :
                    ""
                }
                {
                    tipo == "regioes" ?
                    regioes?.map((regiao: regiao) => {
                        return <option selected={regiao.Code == preValue} value={regiao.Code ? regiao.Code : ''}>{regiao.Code ? regiao.Code : 'Sem filtro'}</option>
                    })
                    :
                    ""
                }
            </select>
        
            </div>
           <p className='text-red-600 m-0 font-semibold text-sm'>{error ? error : ''}</p>
        </div>

        

)
}


