import {useNavigate} from 'react-router-dom';
import { useContext } from 'react';
import { TaskContextGestoria } from '../gestoria/boardGestoria';
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
        vendedor: string;
    }
    index: string;
}



export function LeadTaskGestoria({task, index}: taskProps) {
    const navigate = useNavigate();
    const { selectedTasks, alterLeadModalState, alterSelectedLead } = useContext(TaskContextGestoria);

    const firstName = task.vendedor.split(" ")[0];

    const handleChangeLeadOwner = () => {
        console.log("Uga duga")
        alterLeadModalState();
        alterSelectedLead(task.id_card);
    }


    function handleOpenTask(task: taskProps["task"]) {
        navigate(`/leads/${task.id_card}?origem=gestoria`)
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
                    <p onClick={() => handleChangeLeadOwner()} className=' cursor-pointer m-0 text-xs font-semibold mt-3 flex gap-2 items-center'> <div className=' gap-1 whitespace-nowrap flex items-center customBorder rounded-md px-1 transition-all duration-300 hover:scale-105 hover:shadow-sm' >
                        <CgProfile  /><p className='m-0' > {firstName} </p>
                        </div> R$ {formatedPrice} <LuDot /> {formatedDate}</p>
                    </div>
                    <FaCirclePlus onClick={() => handleOpenTask(task)} size={20} className='cursor-pointer transition-all duration-300 hover:scale-125 hover:rotate-90 p-1' />
                </div>
                )
            }}
        </Draggable>
    )
}