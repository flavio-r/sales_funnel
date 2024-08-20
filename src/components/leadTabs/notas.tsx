import { GrnBtn } from "../greenBtn"
import { IoIosSave } from "react-icons/io";
import { useState } from "react";
import { task } from "../../pages/leads"
import { ajax } from "../../ajax/ajax";
import toast from 'react-hot-toast';

export function NotesLead({task}: {task?: task}) {
    const [quillValue, setquillValue] = useState<string | undefined>(task?.card[0].anotacoes); 
    

    const handleSubmit = async () => {
        toast.dismiss();
        const response = await ajax({method: "PATCH", endpoint: "/leads/atualizarNotas", data: {taskId: task?.card[0].id_card, notas: quillValue}})
        if (!response) {
            toast.dismiss();
            toast.error("Erro ao salvar notas")
            return;
        }
        if (response.status == 'error') {
            toast.dismiss();
            toast.error(response.message)
            return;
        }

        if (response.status == 'success') {
            toast.dismiss();
            toast.success("Notas salvas com sucesso")
            return;
        }

        toast.dismiss();
        toast.error("Erro inesperado")
    }

    return (
        <div className="w-full h-full flex flex-col" >
            <div className="flex w-full justify-between mt-2" >
                <h1 className="m-0" >Anotações</h1>
                <GrnBtn onClick={ () => handleSubmit() } nomeBtn="Salvar" customCss="text-xl" icon={<IoIosSave size={20} />} />
            </div>
            <div className="flex w-full mt-6" >
                <textarea value={quillValue} onChange={(e) => setquillValue(e.target.value)}  className={` rounded-md myQuillBig shadow-md custom-border p-2 focus:outline-none `}  />
            </div>
        </div>
    )
}