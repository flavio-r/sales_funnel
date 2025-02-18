import { DragDropContext } from 'react-beautiful-dnd';
import { ColumnSuperGestoriaInterna } from './columnSuperGestoriaInterna';
import { useEffect, useState, useContext } from 'react';
import { ajax } from '../../ajax/ajax';
import toast, { Toaster } from 'react-hot-toast';
import React from 'react';
import SearchContext from './layoutSuperGestoriaInterna';
import { GanhouPerdeu } from '../modalWinLoss';
import { SuperChangeOwnerInterna } from './modalSuperChangeOwnerInterna';
import { Tooltip } from 'react-tooltip';
import ConfettiExplosion from 'react-confetti-explosion';


export const TaskContextGestoria = React.createContext({} as any);
interface task {
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
    IntRate: number;
}

interface taskMysql {
    id_card: string;
    titulo: string;
    valor_estimado: string;
    pessoa_contato: string;
    data_criacao: string;
    data_prevista: string;
    vendedor: string;
}


export function BoardSuperGestoriaInterna() {

    const { searchValue, filters, gerenciados, alteraIndicadores } = useContext(SearchContext);    
    const [leadMysql, setLeadMysql] = useState<taskMysql[]>([]);
    const [lead, setLead] = useState<task[]>([]);
    const [contato, setContato] = useState<task[]>([]);
    const [diagnostico, setDiagnostico] = useState<task[]>([]);
    const [teste, setTeste] = useState<task[]>([]);
    const [negociacao, setNegociacao] = useState<task[]>([]);
    const [tasks, setTasks] = useState<task[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [showWinLoss, setShowWinLoss] = useState<boolean>(false);
    const [isFirstLoadSearch, setIsFirstLoadSearch] = useState(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number>(0);
    const [currentOwner, setCurrentOwner] = useState<string>("");
    const [isExploding, setIsExploding] = useState(false);

    const confettiProps = {
        force: 0.6,
        duration: 3000,
        particleCount: 250,
        width: 3600,   
    }


    function acertaEtapaSap(etapa: number) {
        switch(etapa) {
            case 1:
                return 6;
            case 2:
                return 3;
            case 3:
                return 8;
            case 4:
                return 7;
            case 5:
                return 5;
        }
    }
    function reorderTasksInSameColumn(columnId: string, sourceIndex: number, destinationIndex: number) {
        // Find the correct column
        let columnTasks;
        switch(columnId) {
            case '1':
                columnTasks = lead;
                break;
            case '2':
                columnTasks = contato;
                break;
            case '3':
                columnTasks = diagnostico;
                break;
            case '4':
                columnTasks = teste;
                break;
            case '5':
                columnTasks = negociacao;
                break;
            default:
                return;
        }
    
        // Create a new array with the task moved to the new position
        const newTasks = Array.from(columnTasks);
        const [removed] = newTasks.splice(sourceIndex, 1);
        newTasks.splice(destinationIndex, 0, removed);
    
        // Update the state with the new tasks array
        switch(columnId) {
            case '1':
                setLead(newTasks);
                break;
            case '2':
                setContato(newTasks);
                break;
            case '3':
                setDiagnostico(newTasks);
                break;
            case '4':
                setTeste(newTasks);
                break;
            case '5':
                setNegociacao(newTasks);
                break;
        }
    }




    
    
    
    function removeTaskFromSource(sourceId: string, taskId: string) {
        if (sourceId == '1') {
            const newTasks = lead.filter(task => task.Id.toString() != taskId);
            setLead(newTasks);
        } else if (sourceId == '2') {
            const newTasks = contato.filter(task => task.Id.toString() != taskId);
            setContato(newTasks);
        } else if (sourceId == '3') {
            const newTasks = diagnostico.filter(task => task.Id.toString() != taskId);
            setDiagnostico(newTasks);
        } else if (sourceId == '4') {
            const newTasks = teste.filter(task => task.Id.toString() != taskId);
            setTeste(newTasks);
        } else if (sourceId == '5') {
            const newTasks = negociacao.filter(task => task.Id.toString() != taskId);
            setNegociacao(newTasks);
        }
    }

    async function addTaskToDestination(destinationId: string, taskId: string, index: number) {
        if (destinationId == "7" || destinationId == "6") {
                toast.dismiss();
                toast.loading("Atualizando Oportunidade");
                const response = await ajax({method: "PATCH", endpoint: "/task/ganhouPerdeu", data: {taskId: taskId, type: destinationId}})
                toast.dismiss();
                if (!response) {
                    toast.error("Erro ao atualizar Oportunidade")
                    return;
                }
                if (response.status == "error") {
                    toast.error(response.message);
                    return;
                }
                if ( response.status == 'success' ) {
                    if (destinationId == "7") {
                        toast.success("Oportunidade Perdida", {icon: '😭', className: "bg-red-500 text-white font-semibold"});
                        return;
                    }   
                    if (destinationId == "6") {
                        setIsExploding(true);
                        toast.success("Oportunidade Ganha!", { icon: '🎉', className: "bg-green-500 text-white font-semibold"});
                        setTimeout(() => {
                            setIsExploding(false);
                        }, 4500);
                        return;
                    }
                    toast.success("Sucesso ao atualizar oportunidade");
                    return;
                }
                toast.error("Erro inesperado ao atualizar oportunidade");
            return;
        }
        var taskToAdd = tasks.find((task: task) => task.Id.toString() == taskId);
        if (!taskToAdd) return false;
        switch(destinationId) {
            case '1':
                var newTasks = [...lead];
                newTasks.splice(index, 0, taskToAdd);
                setLead(newTasks);
                break;
            case '2':
                var newTasks = [...contato];
                newTasks.splice(index, 0, taskToAdd);
                setContato(newTasks);
                break;
            case '3':
                var newTasks = [...diagnostico];
                newTasks.splice(index, 0, taskToAdd);
                setDiagnostico(newTasks);
                break;
            case '4':
                var newTasks = [...teste];
                newTasks.splice(index, 0, taskToAdd);
                setTeste(newTasks);
                break;
            case '5':
                var newTasks = [...negociacao];
                newTasks.splice(index, 0, taskToAdd);
                setNegociacao(newTasks);
                break;
        }
        const newFilteredTasks = [...selectedTasks, taskId];
        setSelectedTasks(newFilteredTasks);
        setTimeout(() => {
            //
        }, 100);
        
        var stageKeySap = acertaEtapaSap(parseInt(destinationId));

        await ajax({method: "PATCH", endpoint: "/task/atualizar", data: { stageKey : stageKeySap, taskId: taskId}})
        
        const filteredTasks = newFilteredTasks.filter(id => id !== taskId)
        setSelectedTasks(filteredTasks);
        toast.success("atualizada");
        return true;
    }


    const handleDragEnd = async (result: any) => {
        setShowWinLoss(false);
        const {destination, source, draggableId} = result;
        //replaced cons log
        if (source.droppableId == '-1' || destination.droppableId == '-1') {
            if (destination.droppableId == "7") {
                //replaced cons log
                const id_card = result.draggableId;
                const response = await ajax({method: "POST", endpoint: "/lead/desativar", data: {id_lead: id_card } })
                if (!response) {
                    toast.error("Erro ao atualizar potencial");
                    return;
                }
                if (response.status == "error") {
                    toast.error("Erro ao atualizar potencial");
                    return;
                }
                if (response.status == "success") {
                    toast.success("Potencial desativado com sucesso");
                }
            }
            toast.error("Transforme o Potencial em Cliente!")
            return;
        }

        if (destination.droppableId == '7' || destination.droppableId == '6') {
            removeTaskFromSource(source.droppableId, draggableId);

        }
        
        if (destination.droppableId == source.droppableId) {
            reorderTasksInSameColumn(source.droppableId, source.index, destination.index);
            return;
        }
        
        if (!destination || !source) {
            return;
        }

        removeTaskFromSource(source.droppableId, draggableId);
        await addTaskToDestination(destination.droppableId, draggableId, destination.index);
    }

    const handleDragStart = async () => {
        setShowWinLoss(true);
    }



    const carregaTasksSAP = async (filter: string = "") => {
        const response = await ajax({ method: 'POST', endpoint: '/superGestoriaInterna/tasks', data: {filter: filter, filtros: filters, externos: gerenciados} });
        if (!response) {
            return false;
        }
        if (response.status === 'error') {
            return false;
        }

        alteraIndicadores(response.indicadores);
        
        const { 3: contatoTasks = [], 6: leadTasks = [], 8: diagnosticoTasks = [], 7: testeTasks = [], 5: negociacaoTasks = [] } = response.data;
        const allTasks = contatoTasks.concat(leadTasks, diagnosticoTasks, testeTasks, negociacaoTasks);
        

        setLead(leadTasks);
        setContato(contatoTasks);
        setDiagnostico(diagnosticoTasks);
        setTeste(testeTasks);
        setNegociacao(negociacaoTasks);
        setTasks(allTasks);
        return true;
    }

    const carregaLeads = async (filter:string = "") => {
        const response = await ajax({method: "POST", endpoint: "/gestoriaInterna/leads", data: {filter: filter, filtros: filters, externos: gerenciados}});    
        if (!response) {
            setLeadMysql([]);
            return false;
        }
        if (response.status == 'error') {
            setLeadMysql([]);
            return false;
        }
        if (response.data.length == 0) {
            setLeadMysql([]);
            return true;
        }

        var tasks: taskMysql[] = [];
        var data = response.data;
        data.forEach((task: taskMysql) => {
            const taskObj: taskMysql = {
                id_card: task.id_card,
                titulo: task.titulo,
                valor_estimado: task.valor_estimado,
                pessoa_contato: task.pessoa_contato,
                data_criacao: task.data_criacao,
                data_prevista: task.data_prevista,
                vendedor: task.vendedor
            }
            tasks.push(taskObj);
        })
        setLeadMysql(tasks);
        return true;
    }

    const carregaTasks = async ( filter: string = "" ) => {
        console.log(gerenciados);
        if (gerenciados.length == 0) {
            return;
        }
        
        if (filter.length == 0) {
            toast.dismiss();
            toast.loading('Carregando Oportunidades...');    
        }
        const responseSap = await carregaTasksSAP(filter);
        const responseMysql = await carregaLeads(filter);
        if (!responseSap || !responseMysql) {
            if (filter.length == 0) {
            toast.dismiss();
            toast.error("Erro ao carregar oportunidades / potenciais");
            }
            return;
        }
        if (responseSap && responseMysql) {
            if (filter.length == 0) {    
                toast.dismiss();
                toast.success("Oportunidades carregadas com sucesso!");
            }
            return;
        }

        if (filter.length == 0) {
        toast.dismiss();
        toast.error('Erro inesperado!');
        }
    }

    const handleGanhouPerdeu = () => {
    }

    useEffect( () => {
        carregaTasks("");
    }, [])

    useEffect(() => {
        if (isFirstLoadSearch) {
            setIsFirstLoadSearch(false);
            return;
        };
        const searchTasks = async () => {
            const searchStr = searchValue.toString();
            if (searchStr.length > 3 || searchStr.length == 0 ) {
                toast.dismiss();
                carregaTasks(searchStr);
            }
            return
        }
        searchTasks();
    }, [searchValue])

    const handleChangeModalState = () => {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        carregaTasks();  
    }, [filters, gerenciados]);

    return (
        <>
        <Tooltip id="tooltip-gestoria-interna" />
        <TaskContextGestoria.Provider value={{selectedTasks: selectedTasks, alterModalState: handleChangeModalState, alterSelectedTask: setSelectedTaskId, alterCurrentOwner: setCurrentOwner}} >
        <>{isExploding && <ConfettiExplosion {...confettiProps} />}</>

        <DragDropContext useDrag={handleGanhouPerdeu} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <div className='flex mt-6 bg-white box-border max-w-full h-auto' >
            { <SuperChangeOwnerInterna mostrarModal={isOpen} atualizaEstadoModal={handleChangeModalState} idTask={selectedTaskId} currentOwner={currentOwner} /> }

            <ColumnSuperGestoriaInterna title="Qualificação" tasks={lead} leads={leadMysql} id="1"/>
            <ColumnSuperGestoriaInterna title="Agendamento / Reunião" tasks={contato} id="2"/>
            <ColumnSuperGestoriaInterna title="Diagnóstico" tasks={diagnostico} id="3"/>
            <ColumnSuperGestoriaInterna title="Teste" tasks={teste} id="4"/>
            <ColumnSuperGestoriaInterna title="Proposta de Valor" tasks={negociacao} id="5"/>
            <GanhouPerdeu show={showWinLoss} />
            <Toaster/>
            </div>  
        </DragDropContext>
        </TaskContextGestoria.Provider>
        </>
    )
}