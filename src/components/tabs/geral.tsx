import { task } from "../../pages/opportunity"
import { IoBusiness } from "react-icons/io5";
import { InputDados } from "../inputDados";
import { MdAttachMoney } from "react-icons/md";
import { IoIosPerson } from "react-icons/io";
import { BsFillTelephoneFill } from "react-icons/bs";
import { CgMail } from "react-icons/cg";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { GrnBtn } from "../greenBtn";
import { IoIosSave } from "react-icons/io";
import { ajax } from "../../ajax/ajax";
import toast, { Toaster } from 'react-hot-toast';

export function Geral({task}: {task?: task}) {
    const { register, handleSubmit } = useForm();
    const [startDateFormatted, setStartDateFormatted] = useState<string>('');
    const [formattingData, setFormattingData] = useState<boolean>(true);
    const [predictedDateFormatted, setPredictedDateFormatted] = useState<string>('');
    const [changedFields, setChangedFields] = useState<any>([]);
    
    const onSubmit = async (data: any) => {
        if (changedFields.length <= 0) {
            toast.error("Nenhum campo foi alterado!");
            return;
        }

        toast.dismiss();
        toast.loading("Atualizando Oportunidade");

        const objAtt : { [key: string]: any } = {
            id_task: task?.SequentialNo,
            cardcode: task?.CardCode,
        }
        
        for (const chave in changedFields) {
            objAtt[changedFields[chave]] = data[changedFields[chave]];
        }           

        const response = await ajax({method: "PATCH", endpoint: "/task/atualizarOp", data: objAtt});
        
        if (!response) {
            toast.dismiss();
            toast.error("Erro inesperado")
            return;
        }
        if (response.status == 'error') {
            toast.dismiss();
            if (typeof response.message == "string") {
                toast.error(response.message);
                return;
            }
            toast.error("Erro inesperado");
            return;
        }

        if (response.status == 'success') {
            toast.dismiss();
            if ( typeof response.message == "string") {
                toast.success(response.message);
            }
            setTimeout(() => {
                //tempinho chique 
            }, 500)
            window.location.reload();
            return;
        }

        toast.dismiss();
        toast.error("Erro inesperado");
        return;
    }

    const handleFieldChanged = (nome: string) => {
        setChangedFields((prevFields: any) => {
            if (!prevFields.includes(nome)) {
                return [...prevFields, nome ]; 
            }
            return prevFields; 
        });
    }

    

   

    useEffect(() => {
        const startDate: Date = task?.StartDate ? new Date(task.StartDate) : new Date();
        const predictedDate: Date = task?.PredictedClosingDate ? new Date(task?.PredictedClosingDate) : new Date();
        const month = String(startDate.getMonth() + 1).padStart(2, '0');
        const dia = String(startDate.getDate()).padStart(2, '0');
        const ano = String(startDate.getFullYear()).padStart(2, '0');
        
        const startDateFormatted: string = `${dia}/${month}/${ano}`;

        var predictedDateFormatted2 = predictedDate 
        ? `${predictedDate.getDate().toString().padStart(2, '0')}/${(predictedDate.getMonth() + 1).toString().padStart(2, '0')}/${predictedDate.getFullYear()}`
        : '';


        setStartDateFormatted(startDateFormatted);
        setFormattingData(false);
        setPredictedDateFormatted(predictedDateFormatted2);
    }, [])

    if (formattingData) {
        return (
            <></>
        )
    }

    return (
        <form action=""  id="formAttOp" onSubmit={handleSubmit(onSubmit)} >
        <div className="flex w-full h-full">
            <div className="w-1/2 flex flex-col ">
                <div className="ml-4 w-10/12 gap-6 self-center h-28 shadow-lg flex items-center justify-center rounded-md customBorder">
                    <IoBusiness className="px-5" size={60} />
                    <InputDados isChanged={changedFields.includes("nomeEmpresa")} wasChanged={handleFieldChanged} register={register} editable={true} preValue={`${task?.CustomerName == null ? "Sem Informação" : task?.CustomerName}`} customCss="widthCustom"  name="nomeEmpresa" />
                </div>
                <div className="flex flex-col w-10/12 mt-6 self-center gap-4">
                    <InputDados isChanged={changedFields.includes("titulo")} wasChanged={handleFieldChanged} register={register} editable={true} preValue={`${task?.OpportunityName}`} placeholder="Título"  name="titulo"  />
                    <InputDados isChanged={changedFields.includes("valor")} wasChanged={handleFieldChanged} register={register} type="numero" editable={true} icon={<MdAttachMoney size={20} />} preValue={`${task?.MaxLocalTotal}`} placeholder="Valor Estimado" name="valor" />
                    <InputDados isChanged={changedFields.includes("data")} wasChanged={handleFieldChanged} register={register} editable={false} preValue={`${startDateFormatted}`} placeholder="Data de início da oportunidade" name="data" />
                    <InputDados isChanged={changedFields.includes("codigoCliente")} wasChanged={handleFieldChanged} register={register} editable={false} preValue={`${task?.CardCode}`} placeholder="Código do Cliente" name="codigoCliente"/>
                    <InputDados isChanged={changedFields.includes("diasEtapaAtual")} wasChanged={handleFieldChanged} register={register} editable={false} preValue={`${0}`} placeholder="Dias na etapa atual" name="diasEtapaAtual"/>
                    <InputDados isChanged={changedFields.includes("diaVisita")} wasChanged={handleFieldChanged} register={register} type="date" editable={true} preValue={`${predictedDateFormatted != null ? predictedDateFormatted : ""}`} placeholder="Data prevista de conclusão da etapa" name="diaVisita"/>
                    <InputDados register={register} type="text" editable={false} preValue={task?.Criador.nomeCriador} placeholder="Criador da oportunidade" name="criador"/>

                </div>
            </div>
            <div className="verticalRule"></div>
            <div className="w-1/2 flex flex-col" >
                <div className=" ml-4 w-10/12 gap-6 self-center h-28 shadow-lg flex items-center justify-center rounded-md customBorder">
                    <IoIosPerson className="px-5" size={40} />
                    <InputDados wasChanged={handleFieldChanged} register={register} editable={true} preValue={`${task?.ContactPerson == null ? "Sem Informação" : task?.ContactPerson}`} isChanged={changedFields.includes("pessoaContato")} customCss="widthCustom"  name="pessoaContato" />
                </div>
                <div className=" ml-4 self-center w-10/12 mt-6 flex flex-col" >
                    <div className="flex flex-col gap-3"> 
                    <InputDados wasChanged={handleFieldChanged} register={register} icon={<BsFillTelephoneFill size={20} />} editable={true} preValue={`${task?.Phone1}`} isChanged={changedFields.includes("telefone")} placeholder="Telefone de contato"  name="telefone" />
                    <InputDados wasChanged={handleFieldChanged} register={register} icon={<CgMail size={20} />}editable={true} preValue={`${task?.EmailAddress}`} placeholder="Email de contato"  name="email" isChanged={changedFields.includes("email")} />
                    </div>
                    <div className="flex flex-col gap-3 mt-28">
                    <InputDados isChanged={changedFields.includes("rua")} wasChanged={handleFieldChanged} register={register} editable={false}  preValue={task?.BPAddress.Street} placeholder="Rua"  name="rua" />
                    <InputDados isChanged={changedFields.includes("bairro")} wasChanged={handleFieldChanged} register={register} editable={false}  preValue={task?.BPAddress.Block} placeholder="Bairro"  name="bairro" />
                    <InputDados isChanged={changedFields.includes("cidade")} wasChanged={handleFieldChanged} register={register} editable={false}  preValue={task?.BPAddress.City} placeholder="Cidade"  name="cidade" />

                    </div>
                </div>
            </div>
        </div>
        <div className="mt-10 flex w-full justify-end">
            <div ><GrnBtn  form="formAttOp" type="submit" nomeBtn="Atualizar Oportunidade" icon={ <IoIosSave size={30}/> } /></div>
        </div>
        <Toaster></Toaster>
        </form>
    )
}