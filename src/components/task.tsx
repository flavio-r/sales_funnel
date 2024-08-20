import { Draggable } from 'react-beautiful-dnd';
import { CgProfile } from "react-icons/cg";
import { LuDot } from "react-icons/lu";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { TaskContext } from './board';
import { ImSpinner8 } from "react-icons/im";
import { BsExclamationCircleFill } from "react-icons/bs";
import { Tooltip } from 'react-tooltip'



interface taskProps {
    task: {
        Id: number;
        CardCode: string;
        CustomerName: string;
        StartDate: string;
        OpportunityName: string;
        MaxLocalTotal: number;
        StageId: number;
        PredDate: string;
        DestacadoGerente: string; 
    }
    index: string;
}


export function Task({task, index}: taskProps) {
    const [isInDrag, setIsInDrag] = useState<boolean>(false);
    const [isHighlighted, setIsHighlighted] = useState<boolean>(false);

    const navigate = useNavigate();
    const { selectedTasks } = useContext(TaskContext);
    

    useEffect(() => {
        if (selectedTasks.includes(task.Id.toString())) {
            setIsInDrag( true );
        } 
        if (!selectedTasks.includes(task.Id.toString())) {
            setIsInDrag( false );
        }
    }, [selectedTasks])


    function handleOpenTask(task: taskProps["task"]) {
        navigate(`/opportunity/${task.Id}`)
    }

    const diffInDays = () => {
        const predDate = new Date(task.PredDate);
        const currentDate = new Date();
        const differenceInTime = predDate.getTime() - currentDate.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        return differenceInDays
    }

    useEffect(() => {
        if (task.DestacadoGerente == "S") {
            setIsHighlighted(true);
        }
    }, [])
          

    const formatedDate = new Date(task.PredDate).toLocaleDateString();
    const daysToDate = diffInDays();
    const dateColor =
    daysToDate > 5 ? "text-green-700" :
    daysToDate < 0 ? "text-red-700" :
    "text-yellow-600";
  

    const formatedPrice = task.MaxLocalTotal.toLocaleString('pt-BR');
    return (
        <>
        <Tooltip id="tooltip-12" />
        <Draggable draggableId={task.Id.toString()} key={task.Id} index={index}>
            {(provided: any, snapshot: any) => {
            return (
                <div className={` w-full h-auto px-2 scaleCustom py-2 rounded-md ${isInDrag ? "bg-slate-200" : "bg-white"} items-center flex flex-row border border-black shadow-custom-shadow`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} isdragging={snapshot.isdragging}>
                    <div className='w-11/12'>
                    <h3 className='p-0 m-0'>{task.OpportunityName}</h3>
                    <p className='m-0 mr-2 text-sm'>{task.CustomerName}</p>  
                    <p className='m-0 text-xs font-semibold mt-3 flex gap-2 items-center'> <CgProfile /> R$ {formatedPrice} <LuDot /> <span className={dateColor} > {formatedDate} </span> </p>
                    </div>
                    <div className={`flex flex-col h-full ${isHighlighted ? "justify-between" : "justify-center"}`} >
                        <BsExclamationCircleFill data-tooltip-id="tooltip-12" data-tooltip-content="Essa oportunidade foi destacada pelo seu gestor!"  size={22} className={` ${!isHighlighted ? "opacity-0 fixed h-0 w-0 " : "opacity-100 scale-105"} z-50 corDestaque transition-all duration-300 p-1 `} />
                        {isInDrag ? <ImSpinner8 className='animate-spin' size={20} /> : <FaCirclePlus onClick={() => handleOpenTask(task)} size={22} className=' hover:rotate-90 cursor-pointer transition-all duration-300 hover:scale-125 p-1  '  /> }  
                    </div>
                </div>
                )
            }}
        </Draggable>
        </>
    )
}
