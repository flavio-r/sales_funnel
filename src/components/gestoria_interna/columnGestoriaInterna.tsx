import { Droppable } from 'react-beautiful-dnd';
import { TaskGestoriaInterna } from './taskGestoriaInterna';
import { IoMdAddCircle } from "react-icons/io";
import { useState } from 'react';
import { AddPotential } from '../modalAddPotencial';
import { LeadTaskGestoriaInterna } from './leadtaskGestoriaInterna';
import { FaBoxOpen } from "react-icons/fa";

interface colunaProps {
    title: string;
    tasks?: {
        Id: number;
        CardCode: string;
        CostumerName: string;
        StartDate: string;
        OpportunityName: string;
        MaxLocalTotal: number;
        StageId: number;
        PredDate: string;
        firstName: string;
        lastName: string;
        DestacadoGerente: string;
    }[];
    id: string;
    leads?: {
        id_card: string;
        titulo: string;
        valor_estimado: string;
        pessoa_contato: string;
        data_criacao: string;
        data_prevista: string;
        vendedor: string;
    }[]
}




export function ColumnGestoriaInterna({tasks, title, id, leads}: colunaProps) {
    const [mostrarPotencial, setMostrarPotencial] = useState<boolean>(false);
    const getTotalValue = (tasks: colunaProps["tasks"]) => {
        let totalValue = 0;
        
        tasks?.forEach(task => {
            totalValue += task.MaxLocalTotal;
        });
        return totalValue.toLocaleString('pt-BR');
    }

    const atualizarEstadoModal = () => {
        setMostrarPotencial(false);
    } 

    const valor = getTotalValue(tasks);

    return (
        <>
        <AddPotential atualizarEstadoModal={ () => atualizarEstadoModal()} mostrarModal={mostrarPotencial} />
        <div className='min-h-screen w-full items-center bg-custom-gray flex flex-col border border-black ml-3  p-1 box-border relative '>
           <div className="triangle-right-white-board absolute"></div> <div className='self-start levantar m-0 flex w-full z-10 justify-between pt-2'><h3 className='self-start m-0 mt-1 ml-8 font-semibold'>{title} </h3> <h2 className={`self-end m-0 mr-4`}>{tasks ? tasks.length : '0'}</h2> </div> {title == 'Proposta de Valor' ? "" : <div className={`triangle-right-grey-board absolute`} ></div> }
            <p className='m-0 self-start mb-6 px-2 text-sm mt-3 font-semibold'>{valor == '0' ? 'R$ 0.00' : 'R$' + valor + '.000'}</p>

            <Droppable droppableId={id}>
                {(provided: any, snapshot: any) => {
                    return (
                        <div className={` ${ title == 'Qualificação' ? "" : "h-full" } w-11/12 bg-custom-gray gap-3 items-center flex flex-col `} ref={provided.innerRef} {...provided.droppableProps} isdraggingover={snapshot.isDraggingOver.toString()}>
                            {tasks?.length == 0 ? <div className='flex flex-col items-center justify-center mb-12 ' ><FaBoxOpen size={60} /></div> : "" }
                            {tasks?.map((task: any, index: any) => <TaskGestoriaInterna task={task} index={index} key={task.Id} />)}
                            {provided.placeholder}
                        </div>
                    );
                }}
            </Droppable>
            {/* caso seja o lead ele adiciona a coluna dos potenciais */}
            {title == 'Qualificação' ? <Droppable droppableId={"-1"}>
            {(provided: any, snapshot: any) => {
                    return (
                        <>
                        <div data-tooltip-id="tooltip-1" data-tooltip-content="Não exige cadastro no SAP" className='relative flex items-center gap-2 w-11/12 justify-center mt-8' >
                            <div className='line left'></div>
                            <h3>Potenciais</h3>
                            <div className='line right' ></div>
                        </div>
                        <div className=' w-11/12 h-full bg-custom-gray gap-3 items-center flex flex-col' ref={provided.innerRef} {...provided.droppableProps} isdraggingover={snapshot.isDraggingOver.toString()}>
                            {leads?.map((task: any, index: any) => <LeadTaskGestoriaInterna task={task} index={index} key={task.id_card} />)}
                            {provided.placeholder}
                        </div>
                        </>
                    );
                }}
            </Droppable> : ""}
            { title == 'Qualificação' ?  <button className=' mt-4 px-4 mb-4 flex items-center justify-center gap-2 p-2 rounded-md  oultine-none border-none bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-600 transition-all duration-500 hover:shadow-lg hover:scale-105' onClick={() => setMostrarPotencial(!mostrarPotencial)}> <IoMdAddCircle/>  Potencial </button> : ""}
        </div>
        </>
    )
}