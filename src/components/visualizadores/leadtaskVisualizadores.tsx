import {useNavigate} from 'react-router-dom';
import { useContext } from 'react';
import { TaskContextGestoria } from './boardVisualizadores';
import { Draggable } from 'react-beautiful-dnd';
import { FaCirclePlus } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { LuDot } from "react-icons/lu";

interface taskProps {
    task: {
        id_card: string;
        titulo: string;
        valor_estimado: string;
        pessoa_contato: string;
        data_criacao: string;
        data_prevista: string;
    }
    index: string;
}



export function LeadTaskVisualizadores({task, index}: taskProps) {
    const navigate = useNavigate();
    const { selectedTasks } = useContext(TaskContextGestoria);

    function handleOpenTask(task: taskProps["task"]) {
        navigate(`/leads/${task.id_card}`)
    }


    
    var formatedDate = new Date(task.data_prevista).toLocaleDateString();
    if (!task.data_prevista) {
        formatedDate = "";
    }
    

    const formatedPrice = task.valor_estimado.toLocaleString();  
    return (
        <Draggable draggableId={task.id_card.toString()} key={task.id_card} index={index}>
            {(provided: any, snapshot: any) => {
                return (
                <div className={`w-full scaleCustom h-auto px-2 py-2 rounded-md ${selectedTasks.includes(task.id_card.toString()) ? "bg-slate-200" : "bg-white"} items-center  flex flex-row border border-black shadow-custom-shadow`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} isdragging={snapshot.isdragging}>
                    <div className='w-11/12'>
                    <h3 className='p-0 m-0'>{task.titulo}</h3>
                    <p className='m-0 mr-2 text-sm'>{task.pessoa_contato}</p>  
                    <p className='m-0 text-xs font-semibold mt-3 flex gap-2 items-center'> <CgProfile /> R$ {formatedPrice} <LuDot /> {formatedDate}</p>
                    </div>
                    <FaCirclePlus onClick={() => handleOpenTask(task)} size={20} className='cursor-pointer transition-all duration-300 hover:scale-125 hover:rotate-90 p-1' />
                </div>
                )
            }}
        </Draggable>
    )
}