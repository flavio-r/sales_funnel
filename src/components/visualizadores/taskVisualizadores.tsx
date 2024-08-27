import { Draggable } from 'react-beautiful-dnd';
import { CgProfile } from "react-icons/cg";
import { LuDot } from "react-icons/lu";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { TaskContextGestoria } from './boardVisualizadores';
import { useState, useEffect } from 'react';
import { ImSpinner8 } from "react-icons/im";
import { BsExclamationCircle } from "react-icons/bs";
import { BsExclamationCircleFill } from "react-icons/bs";
import { ajax } from '../../ajax/ajax';
import toast from 'react-hot-toast';
import { FaFireAlt } from "react-icons/fa";

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
        firstName: string;
        lastName: string;
        DestacadoGerente: string;
        IntRate: number;
    }
    index: string;
}


export function TaskVisualizadores({ task, index }: taskProps) {
    const [isInDrag, setIsInDrag] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
    const [heatColor, setHeatColor] = useState<string>('');
    const [showHeatModal, setShowHeatModal] = useState<boolean>(false);

    const navigate = useNavigate();
    const { selectedTasks, alterModalState, alterSelectedTask, alterCurrentOwner } = useContext(TaskContextGestoria);


    const handleOpenTask = (task: taskProps["task"]) => {
        navigate(`/opportunity/${task.Id}?origem=visualizador`)
    }

    const diffInDays = () => {
        const predDate = new Date(task.PredDate);
        const currentDate = new Date();
        const differenceInTime = predDate.getTime() - currentDate.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        return differenceInDays
    }

    const handleChangeTaskOwner = () => {
        alterSelectedTask(task.Id.toString());
        alterCurrentOwner(task.firstName + " " + task.lastName);
        alterModalState();
    }

    const handleHighlightTask = async () => {
        if (!isHighlighted) {
            setIsHighlighted(true);
            const response = await ajax({ method: "POST", endpoint: "/gestoria/highlightTask", data: { taskId: task.Id } })
            if (response.status == "error") {
                toast.error("Erro ao destacar oportunidade");
                setIsHighlighted(false);
            }
            if (response.status == "success") {
                toast.success("Oportunidade destacada com sucesso!");
            }
            return;
        }
        if (isHighlighted) {
            setIsHighlighted(false);
            const response = await ajax({ method: "POST", endpoint: "/gestoria/unhighlightTask", data: { taskId: task.Id } })
            if (response.status == "error") {
                toast.error("Erro ao remover destaque da oportunidade");
                setIsHighlighted(true);
            }
            if (response.status == "success") {
                toast.success("Destaque removido com sucesso!");

            }
        }
    }

    const formatedDate = new Date(task.PredDate).toLocaleDateString();
    const daysToDate = diffInDays();
    const dateColor =
        daysToDate > 5 ? "text-green-700" :
            daysToDate < 0 ? "text-red-700" :
                "text-yellow-600";

    const formatedPrice = task.MaxLocalTotal.toLocaleString('pt-BR');

    useEffect(() => {
        if (selectedTasks) {
            if (selectedTasks.includes(task.Id.toString())) {
                setIsInDrag(true);
            }
            if (!selectedTasks.includes(task.Id.toString())) {
                setIsInDrag(false);
            }
        }
    }, [selectedTasks])

    const getHeatColor = (HeatLevel: number) => {
        console.log(HeatLevel)
        if (HeatLevel == 1) {
            return "bg-blue-500";
        } else if (HeatLevel == 2) {
            return "bg-yellow-500";
        } else if (HeatLevel == 3) {
            return "bg-red-500";
        } else if (HeatLevel == 4) {
            return "fireIcon";
        } else {
            return "bg-black";
        }
    }

    const updateHeatColor = () => {
        const intRate = task.IntRate;
        const color = getHeatColor(intRate);
        if (!color) {
            console.log("Cor do nível de calor não encontrada.");
            return;
        }
        setHeatColor(color);
    }

    const handleHeatLevel = async () => {
        setShowHeatModal(!showHeatModal);
    }

    const changeHeatLevel = async (e: any) => {
        let heatLevel = e.target.dataset.heatlevel;
        if (!heatLevel) {
            heatLevel = e.target.parentElement.dataset.heatlevel;
        }
        const taskId = task.Id;

        setHeatColor(getHeatColor(heatLevel));
        const response = await ajax({ method: "POST", endpoint: "/task/updateHeatLevel", data: { taskId, heatLevel: heatLevel } });
        if (response.status == "success") {
            //
        } else {
            toast.error("Erro ao alterar interesse da oportunidade");
        }

    }


    useEffect(() => {
        if (task.DestacadoGerente == "S") {
            setIsHighlighted(true);
        }
    }, [])

    useEffect(() => {
        updateHeatColor();
    }, [task.IntRate])


    useEffect(() => {
        if (task.DestacadoGerente == "S") {
            setIsHighlighted(true);
        }
    }, [])

    return (
        <>
            <Draggable draggableId={task.Id.toString()} key={task.Id} index={index}>
                {(provided: any, snapshot: any) => {
                    return (
                        <div className={`z-40 hover:z-50 w-full h-auto px-2 scaleCustom py-2 rounded-md ${isInDrag ? "bg-slate-200" : "bg-white"} items-center flex flex-row border border-black shadow-custom-shadow`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} isdragging={snapshot.isdragging}>
                            <div className='w-11/12'>
                                <h3 className='p-0 m-0'>{task.OpportunityName}</h3>
                                <p className='m-0 mr-2 text-sm'>{task.CustomerName}</p>
                                <div className='flex items-center gap-2 mt-3'>
                                    <div onClick={() => handleChangeTaskOwner()} className=' gap-1 whitespace-nowrap flex items-center customBorder rounded-md px-1 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-sm' >
                                        <CgProfile /><p className='m-0' > {task.firstName} </p>
                                    </div>
                                    <div className='m-0 text-xs font-semibold flex gap-1 items-center' >
                                        <p className='m-0' > R$ {formatedPrice} </p> <LuDot /> <span className={dateColor} > {formatedDate} </span> </div>
                                </div>

                            </div>
                            <div className='h-full flex flex-col justify-between ml-3'>
                                <div className="flex items-center justify-center p-1"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    onClick={() => handleHighlightTask()}
                                >
                                    <BsExclamationCircleFill size={22} className={` ${!isHovered && !isHighlighted ? "opacity-0 absolute " : "opacity-100 scale-105"} corDestaque  cursor-pointer transition-all duration-300 `} /> <BsExclamationCircle size={22} className={` ${isHovered || isHighlighted ? "opacity-0 absolute" : "opacity-100"} corDestaque cursor-pointer transition-all duration:300 `} /> </div>
                                {isInDrag ? <ImSpinner8 className='animate-spin' size={22} /> : <FaCirclePlus onClick={() => handleOpenTask(task)} size={22} className=' hover:rotate-90 cursor-pointer transition-all duration-300 hover:scale-125 p-1  ' />}
                                <div className='p-1 py-2 border flex items-center justify-center cursor-pointer' onClick={() => handleHeatLevel()} >
                                    {heatColor === "fireIcon" ? (
                                        <FaFireAlt color='#c70404' size={22} />
                                    ) : (
                                        <div className={`circuloCalor relative ${heatColor}`}></div>
                                    )}
                                    <div
                                        onClick={(e) => changeHeatLevel(e)}
                                        className={`${showHeatModal ? "absolute" : "hidden"} z-custom py-2 flex transition-all duration-300 flex-col encaixarModalHeat w-44 h-40 bg-white rounded-md borderCustom shadow-md`}
                                    >
                                        <div data-heatlevel={-1} className='flex h-16 items-center justify-between px-2 cursor-pointer hover:bg-slate-200'>
                                            <div className={`circulo bg-black`}></div>
                                            <p className='font-semibold m-0'>Sem interesse</p>
                                        </div>
                                        <div data-heatlevel={1} className='flex h-16 items-center justify-between px-2 hover:bg-slate-200'>
                                            <div className={`circulo bg-blue-600`}></div>
                                            <p className='font-semibold m-0'>Baixo interesse</p>
                                        </div>
                                        <div data-heatlevel={2} className='flex h-16 items-center justify-between px-2 hover:bg-slate-200'>
                                            <div className={`circulo bg-yellow-500`}></div>
                                            <p className='font-semibold m-0'>Médio interesse</p>
                                        </div>
                                        <div data-heatlevel={3} className='flex h-16 items-center justify-between px-2 hover:bg-slate-200'>
                                            <div className={`circulo bg-red-500`}></div>
                                            <p className='font-semibold m-0'>Alto interesse</p>
                                        </div>
                                        <div data-heatlevel={4} className='flex h-16 items-center justify-between px-2 hover:bg-slate-200'>
                                            <div>
                                                <FaFireAlt color='#c70404' />
                                            </div>
                                            <p className='font-semibold m-0'>Extremo interesse</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )
                }}
            </Draggable>
        </>
    )
}
