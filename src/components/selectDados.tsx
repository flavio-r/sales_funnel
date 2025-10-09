import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { colaborador } from "./modalAddOportunity";
import { estado, municipio } from "../pages/leads";
import { regiao } from "./modalFilter";
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
export function SelectDados({
  customCss,
  tipo,
  funcaoAoMudar,
  requiredDefault,
  preValue,
  register,
  placeholder,
  name,
  icon,
  error,
  rules,
  itens,
  disabled = false,
  id,
  colaboradores,
  estados,
  municipios,
  regioes,
}: input) {
  //replaced cons log
  //replaced cons log
  return (
    <div className={`${customCss}  relative mt-4 `}>
      <p className="m-0 font-semibold text-sm">{placeholder}</p>
      <div className="absolute ml-2 mt-3 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex items-center">
        <select
          id={id ? id : undefined}
          disabled={disabled}
          defaultValue={preValue || ""}
          {...(requiredDefault ? { required: true } : {})}
          {...(funcaoAoMudar
            ? { ...register(name, { onChange: (e) => funcaoAoMudar(e) }) }
            : { ...register(name, rules) })}
          className={` ${
            disabled ? "bg-gray-200  " : ""
          } corPlaceholder text-black fontePadrao font-semibold colocarBorda w-full h-10 rounded-md border-none text-lg  ${
            icon ? "pl-9" : "pr-6 pl-2"
          } focus:outline-none focus:border-2`}
        >
          {tipo == "assunto" ? (
            <>
              <option key="visita" value="Visita">
                Visita
              </option>
              <option key="pedido" value="Pedido">
                Pedido
              </option>
              <option key="orcamento" value="Orçamento">
                Orçamento
              </option>
              <option key="os" value="O.S.">
                O.S.
              </option>
              <option key="demonstracao" value="Demonstração">
                Demonstração
              </option>
              <option key="duvida" value="Dúvida">
                Dúvida
              </option>
              <option key="financeiro" value="Financeiro">
                Financeiro
              </option>
              <option key="entrega" value="Entrega">
                Entrega
              </option>
              <option key="reclamacao" value="Reclamação">
                Reclamação
              </option>
              <option key="retorno" value="Retorno">
                Retorno
              </option>
            </>
          ) : (
            ""
          )}
          {tipo == "tipo" ? (
            <>
              <option
                key="lembrete"
                value="10"
                className="text-black opacity-100"
              >
                Lembrete
              </option>
              <option key="comunicacao" value="11">
                Comunicação
              </option>
            </>
          ) : (
            ""
          )}
          {tipo == "canal" ? (
            <>
              <option key="presencial" value="4">
                Comercial Externo (presencial)
              </option>
              <option key="telefonema" value="7">
                Telefonema
              </option>
              <option key="whatsapp" value="6">
                Whatsapp
              </option>
              <option key="email" value="8">
                E-mail
              </option>
            </>
          ) : (
            ""
          )}

          {tipo == "segmento" ? (
            <>
              <option key="empty" value=""></option>
              <option key="academia" value="102">
                Academia
              </option>
              <option key="alimentos" value="103">
                Aliementos e Bebidas
              </option>
              <option key="condominio" value="104">
                Condomínio
              </option>
              <option key="construcao" value="105">
                Construção Civil
              </option>
              <option key="educacao" value="106">
                Educação
              </option>
              <option key="entreterimento" value="107">
                Entreterimento
              </option>
              <option key="facilities" value="108">
                Facilities
              </option>
              <option key="foodservice" value="109">
                Food Service
              </option>
              <option key="hotelaria" value="110">
                Hotelaria
              </option>
              <option key="industria" value="111">
                Indústria em Geral
              </option>
              <option key="financeiras" value="112">
                Inst. Financeiras
              </option>
              <option key="religiosa" value="113">
                Inst. Religiosa
              </option>
              <option key="lavandeira" value="114">
                Lavandeira
              </option>
              <option key="outros" value="115">
                Outros
              </option>
              <option key="pessoafisica" value="116">
                Pessoa Física
              </option>
              <option key="revenda" value="117">
                Revenda
              </option>
              <option key="saude" value="118">
                Saúde
              </option>
              <option key="setorpublico" value="119">
                Setor Público
              </option>
              <option key="supermercado" value="120">
                Supermercado
              </option>
              <option key="transportes" value="121">
                Transportes
              </option>
              <option key="varejo" value="122">
                Varejo
              </option>
            </>
          ) : (
            ""
          )}
          {tipo == "pgto" ? (
            <>
              <option key="boleto-brade" value="CR_Boleto BRADE">
                Boleto Bradesco ( Clientes copapel )
              </option>
              <option key="boleto-rejovel" value="CR_Boleto">
                Boleto ( Clientes Rejovel )
              </option>
            </>
          ) : (
            ""
          )}
          {tipo == "atribuidos"
            ? itens.map((item: any) => {
                return (
                  <option key={item.userId} value={item.userId}>
                    {item.firstName} {item.lastName}
                  </option>
                );
              })
            : ""}
          {tipo == "colaboradores"
            ? colaboradores.map((colaborador: colaborador) => {
                return (
                  <option
                    key={colaborador.CodigoVendedorColaborador}
                    value={colaborador.CodigoVendedorColaborador}
                  >
                    {colaborador.NomeColaborador}
                  </option>
                );
              })
            : ""}
          {tipo == "estados"
            ? estados?.map((estado: estado) => {
                return (
                  <option key={estado.Code} value={estado.Code}>
                    {estado.Name}
                  </option>
                );
              })
            : ""}
          {tipo == "municipios"
            ? municipios?.map((municipio: municipio) => {
                return (
                  <option
                    key={municipio.AbsId || `municipio-${Math.random()}`}
                    value={municipio.AbsId ? municipio.AbsId : ""}
                  >
                    {municipio.Name ? municipio.Name : "Sem filtro"}
                  </option>
                );
              })
            : ""}
          {tipo == "heatLevels" ? (
            <>
              <option key="sem-filtro" value="">
                Sem filtro
              </option>
              <option key="sem-interesse" value="-1">
                Sem interesse
              </option>
              <option key="baixo-interesse" value="1">
                Baixo interesse
              </option>
              <option key="medio-interesse" value="2">
                Médio interesse
              </option>
              <option key="alto-interesse" value="3">
                Alto interesse
              </option>
              <option key="extremo-interesse" value="4">
                Extremo interesse
              </option>
            </>
          ) : (
            ""
          )}
          {tipo == "regioes"
            ? regioes?.map((regiao: regiao) => {
                return (
                  <option
                    key={regiao.Code || `regiao-${Math.random()}`}
                    value={regiao.Code ? regiao.Code : ""}
                  >
                    {regiao.Code ? regiao.Code : "Sem filtro"}
                  </option>
                );
              })
            : ""}
        </select>
      </div>
      <p className="text-red-600 m-0 font-semibold text-sm">
        {error ? error : ""}
      </p>
    </div>
  );
}
