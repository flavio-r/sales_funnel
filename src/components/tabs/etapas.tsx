import { task } from "../../pages/opportunity"
import { useState } from "react";
import { useEffect } from "react";
export function Etapas({task}: {task?: task}) {
    const [etapas, setEtapas] = useState<any>([]);
    const [counter, setCounter] = useState<number>(0);

    function addDays(date: Date, days: number): Date {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function handeleEtapas() {
        var etapas = task?.SalesOpportunitiesLines
        var etapasArray: any = [];
        //replaced cons log
        etapas.forEach((etapa: any) => {
            
            const nomeEtapa = acertaEtapaSapReverso(etapa.StageKey);
            const startDate: Date = addDays(new Date(etapa.StartDate), 1);
            //replaced cons log
            //replaced cons log
            const closingDate: Date = addDays(new Date(etapa.ClosingDate), 1);
            const diffMilliseconds: number = closingDate.getTime() - startDate.getTime();
            var diasNaEtapa: number = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
            const startDateFormatted: string = `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()}`;
            const finishDateFormatted: string = `${closingDate.getDate().toString().padStart(2, '0')}/${(closingDate.getMonth() + 1).toString().padStart(2, '0')}/${closingDate.getFullYear()}`;
                    if (diasNaEtapa == 0) { diasNaEtapa = 1 }
            var objToAdd = {
                nomeEtapa: nomeEtapa,
                diasNaEtapa: diasNaEtapa,
                startDateFormatted: startDateFormatted,
                finishDateFormatted: finishDateFormatted
            }
            //replaced cons log
            etapasArray.push(objToAdd);
        });
        setCounter(etapas.length - 1);
        setEtapas(etapasArray);
        
    }
    
    useEffect( () => {
        handeleEtapas();
    }, [])


    function acertaEtapaSapReverso(etapa: number) {
        switch(etapa) {
            case 6:
                return "Qualificação";
            case 3:
                return "Contato";
            case 8:
                return "Diagnóstico";
            case 7:
                return "Teste";
            case 5:
                return "Negoçiação";
            default:
                return "Indefinido"
        }
    }


    return (
        <div className="flex flex-col">
            <h1 className="mb-4 m-0" >Etapas</h1>
            {etapas.map((etapa: any, index: number) => {
                return (
                    <div className={` ${index != counter ? "hover:bg-white" : ""} transition-all hover:shadow-lg duration-500 flex items-center w-full rounded customBorder mb-6 ${ index != counter ? "bg-custom-gray" : "" }  shadow-md px-4 py-2 justify-between box-border`}>
                        <div className="flex flex-col w-1/4" >
                            <p className="text-lg font-semibold mb-4 m-0 " >Etapa:</p>
                            <p className="text-3xl m-0 mb-2" >{etapa.nomeEtapa}</p>
                            <div className="" ></div>
                        </div>
                        <div className="flex flex-col w-1/4" >
                            <p className="text-lg font-semibold mb-4 m-0 " >Dias na etapa: </p>
                            <p className="text-3xl m-0 mb-2" >{etapa.diasNaEtapa}</p>
                        </div>
                        <div className="flex flex-col w-1/4" >
                            <p className="text-lg font-semibold mb-4 m-0 " >Data de Início: </p>
                            <p className="text-3xl m-0 mb-2" >{etapa.startDateFormatted}</p>
                        </div>
                        <div className="flex flex-col w-1/4" >
                            <p className="text-lg font-semibold mb-4 m-0 " >Data de fechamento: </p>
                            <p className="text-3xl m-0 mb-2" >{etapa.finishDateFormatted}</p>
                        </div>
                    </div>
                )
            })}
            
        </div>
    )
}