import { useState, useEffect } from 'react';
import { WhiteBtn } from '../whiteBtn';
import { MdCancel } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import { useForm } from 'react-hook-form';
import { SelectDadosGestoria } from './selectDadosGestoria';
import { ajax } from '../../ajax/ajax';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import SearchContext from './layoutGestoria';

interface ModalChangeLeadOwnerProps {
    atualizaEstadoModal: () => void;
    mostrarModal: boolean;
    idLead: string;
    currentOwner: string;
}

export function ModalChangeLeadOwner({ atualizaEstadoModal, mostrarModal, idLead, currentOwner }: ModalChangeLeadOwnerProps) {
    const [isOpen, setIsOpen] = useState<boolean>(mostrarModal);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { allGerenciados } = useContext(SearchContext);

    const { register, handleSubmit } = useForm({
        mode: "onSubmit"
    });

    const onSubmit = async (data: any) => {
        toast.dismiss();
        toast.loading("Alterando responsável");
        setIsLoading(true);

        const response = await ajax({method: "POST", endpoint: "/gestoriaInterna/alterarResponsavelLead", data: {NomeVendedor: data.owner, IdLead: idLead}});
        toast.dismiss();
        setIsLoading(false);
        if (response.status === "success") {
            toast.success("Responsável alterado com sucesso!");
            atualizaEstadoModal();
            return;
        }
        if (response.status === "error") {
            toast.error("Erro ao alterar responsável!");
            return;
        }
        toast.error("Erro ao alterar responsável!");
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        setIsOpen(mostrarModal);
    }, [mostrarModal]);

    return (
        <div id="modalChangeLeadOwner" className={`${isOpen ? "" : "hidden"} modalAdd fixed top-0 left-0 w-full h-full bg-opacity-50 bg-black overflow-auto z-50 flex items-center justify-center box-border`}>
            <div className={`bg-white ${isOpen ? "slide-up" : "slide-down"} w-3/6 rounded-md shadow-md flex flex-col`}>
                <div className="w-full h-20 flex items-center justify-between bg-white rounded-md">
                    <p className="font-bold text-xl ml-6">Alterar responsável do Potencial</p>
                    <div className="mr-6" onClick={() => atualizaEstadoModal()}><WhiteBtn nomeBtn="Fechar" icon={<MdCancel />}/></div>
                </div>
                <hr className="m-0 bg-custom-gray border-custom-gray" />
                <form id="alterLeadOwner" onSubmit={handleSubmit(onSubmit)} className="flex h-9/12 w-full px-8 py-4 box-border mb-4 justify-between gap-4">
                    <SelectDadosGestoria preOwner={currentOwner} tipo="leadOwner" gerenciados={allGerenciados} placeholder="Responsável" name="owner" register={register} />
                </form>
                <hr className="m-0 border-custom-gray" />
                <div className="flex items-center justify-between h-20 w-full"> 
                    <button onClick={() => atualizaEstadoModal()} className="hover:scale-105 ml-12 h-10 w-28 customRedBorder outline-none bg-white rounded-md font-semibold text-red-500 cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300">Cancelar</button>
                    <button form="alterLeadOwner" type="submit" className="hover:scale-105 mr-12 h-10 w-28 rounded-md border-none bg-green-500 text-white font-semibold text-lg cursor-pointer hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg flex gap-4 items-center justify-center">
                        Alterar
                        <ImSpinner8 className={`animate-spin ${isLoading ? "" : "hidden"}`} size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
