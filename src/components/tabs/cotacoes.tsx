import { task } from "../../pages/opportunity";
import { useEffect, useState } from "react";
import { ajax } from "../../ajax/ajax";
import { GoArrowUpRight } from "react-icons/go";
import { LoadingModal } from "../modalLoading";
import { GrnBtn } from "../greenBtn";
import { RxValueNone } from "react-icons/rx";
import { Cotacao } from "../cotacao";
import toast from "react-hot-toast";

export type cotacao = {
  DocNum: string;
  DocEntry: string;
  DocTotal: number;
  DocDueDate: string;
  DocDate: string;
  DOCSTATUS: string;
  index?: number;
};

export function Cotacoes({ task }: { task?: task }) {
  const [cotacoes, setCotacoes] = useState<cotacao[]>([]);
  const [loadingCotacoes, setLoadingCotacoes] = useState(true);

  function redirectCriarProposta() {
    const CardCode = task?.CardCode;

    const baseUrl = `https://proposta.copapel.com.br`;
    const url = `${baseUrl}/api/proposta/createFromCustomer/${CardCode}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        //replaced cons log
        if (!data.success) {
          toast.error("Erro ao criar proposta!");
        }

        const { redirectUrl } = data.proposta;

        window.open(redirectUrl, "_blank");
      })
      .catch((error) => {
        //replaced cons log
        toast.error("Erro ao criar proposta!: " + error.message);
      });
  }

  async function getQuotationsFromClient(CardCode: string) {
    setLoadingCotacoes(true);
    const response = await ajax({
      method: "GET",
      endpoint: `/cotacoes/${CardCode}`,
      data: null,
    });
    if (!response || response.status == "error") {
      toast.error("Erro ao buscar cotações do cliente");
      return;
    }

    const { data } = response;
    if (data.length > 0 && Object.entries(data[0]).length > 0) {
      setCotacoes(data);
    }

    setLoadingCotacoes(false);
  }

  useEffect(() => {
    if (task) {
      getQuotationsFromClient(task.CardCode);
    }
  }, [task]);

  return (
    <>
      <div className="  box-border">
        <div className=" flex justify-between mb-2 items-end">
          <GrnBtn
            nomeBtn="Criar proposta de valor"
            onClick={() => redirectCriarProposta()}
            icon={<GoArrowUpRight />}
            customCss="h-10"
          />
        </div>

        <div
          key={0}
          style={{ maxHeight: "80vh" }}
          className=" w-full flex  flex-col gap-0.5 bg-custom-gray rounded-md customBorder shadow-sm p-2 box-border overflow-y-scroll overflow-x-hidden"
        >
          <div className="flex gap-2  w-full px-2 mb-2 ">
            <h2 className="m-0 w-1/6 ">Cotação</h2>
            <h2 className="m-0 w-1/6">Valor</h2>
            <h2 className="m-0 w-1/6">Data</h2>
            <h2 className="m-0 w-2/6">Prazo</h2>
            <h2 className="m-0 w-1/6">Status</h2>
            {<h2 className="m-0 w-1/6"></h2>}
          </div>
          {loadingCotacoes ? (
            <LoadingModal />
          ) : Array.isArray(cotacoes) && cotacoes.length === 0 ? (
            <div
              style={{ height: "80vh" }}
              className="w-full flex flex-col items-center justify-center"
            >
              <RxValueNone size={120} />
              <p className="font-semibold text-xl">
                Esse cliente não possui cotações
              </p>
            </div>
          ) : (
            Array.isArray(cotacoes) &&
            cotacoes.map((cotacao: cotacao, index) => {
              return <Cotacao cotacao={cotacao} index={index} />;
            })
          )}
        </div>
      </div>
    </>
  );
}
