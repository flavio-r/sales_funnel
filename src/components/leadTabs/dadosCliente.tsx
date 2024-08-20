import {task} from "../../pages/leads"
import { useState } from "react"
import { FindCompany } from "../modalFindCompany";
import { InputDados } from "../inputDados";
import { SelectDados } from "../selectDados";
import { GrnBtn } from "../greenBtn";
import { IoIosSave } from "react-icons/io";
import {useForm} from 'react-hook-form';
import { ajax } from "../../ajax/ajax";
import { useEffect } from 'react';
import toast, {Toaster} from 'react-hot-toast';
import { useParams } from "react-router-dom";
import { Tooltip } from 'react-tooltip'
import { municipio, estado } from "../../pages/leads";
interface propsDadosClientes {
    task?: task;
    errorsRegister: any;
    estados: estado[];
    municipios: municipio[];
    selecionaEstado: (CodEstado: string) => void;
}

export function DadosCliente({task, errorsRegister, estados, municipios, selecionaEstado}: propsDadosClientes) {   
    const [open, setOpen] = useState<boolean>(false);
    const [selectedData, setSelectedData] = useState<any>({});
    const [errors, setErrors] = useState<any>(errorsRegister);
    const [clientType, setClientType] = useState<string>("cpf");


    const { id } = useParams<{id: string}>();


    const { register, handleSubmit, reset } = useForm({});

    useEffect(() => {
        reset({
            
        });
    }, [selectedData, reset]);

    useEffect(() => {
        handlePreValue();
    }, []);


    function handleData(empresa: any) {
        setSelectedData(empresa);    
    }

    function onSubmit() {
    }

    const  onSubmitSavePotential = async (data: any) => {
        setErrors({})
        toast.dismiss()
        toast.loading("Salvando potencial")
        var response;
        data.id = id;
        
        if ( clientType == 'cpf' ) {
            data.tipoCliente = 'cpf';    
        }
        if (clientType == 'cnpj') {
            data.tipoCliente = 'cnpj';
        }

        try {
            response = await ajax({method: "PATCH", endpoint: "/leads/atualizar", data: data});
        } catch (error) {
            toast.dismiss();
            toast.error("Erro ao salvar potencial")
            return;
        }

        if (!response) {
            toast.dismiss();
            toast.error("Erro ao salvar potencial");
            return;
        }

        if (response.status == 'error') {
            toast.dismiss();
            toast.error("Erro ao salvar potencial");
            return;
        }
        if (response.status === 'validation_error') {
            toast.dismiss();
            setErrors({...errors, [response.field]: response.message});
            toast.error("Erro ao salvar potencial");
            return;
        }
        if (response.status === 'success') {
            toast.dismiss();
            toast.success("Potencial salvo com sucesso");
            setTimeout( () => {
                window.location.reload();    
            } , 500 ) 
            return;
        }

        toast.dismiss();
        toast.error("Erro Inesperado");


    };

    const handleFieldChanged = (nome: string) => {
        setClientType(nome)
    }


    const handlePreValue = () => {
        
        if (task?.informacoes[0].tipoCliente == "cpf") {
            setClientType("cpf");
        }
        if (task?.informacoes[0].tipoCliente == "cnpj") {
            setClientType("cnpj");
        }
    }
    
    return (
        <>
        <Toaster></Toaster>
        {open ?  <FindCompany onSelectedData={handleData} onClose={() => setOpen(!open)}/> :  
        <form id="addLead" action="" onSubmit={handleSubmit(onSubmit)}  >
        <div className="m-0 w-full h-full p-4 box-border flex gap-12 items-center">
            <div className="w-4/6 flex flex-col gap-2">
                <div className="flex w-full gap-4">
                    <div className="w-1/2" ><SelectDados preValue={task?.informacoes[0].municipio ? task?.informacoes[0].municipio : "" } register={register} name="municipio" error={ errors.municipio }  placeholder="Município" tipo="municipios" municipios={municipios} /></div>
                    <div className="w-1/2" ><InputDados editable={true} register={register} preValue={ Object.keys(selectedData).length === 0 ?    task?.informacoes[0].bairro : selectedData.Bairro} name="bairro" error={ errors.bairro }  placeholder="Bairro" /></div>
                </div>
                <div className="flex w-full gap-4">
                    <div className="w-1/2" ><InputDados editable={true} register={register} preValue={  Object.keys(selectedData).length === 0 ?  task?.informacoes[0].cidade : selectedData.cidade }  name="cidade" error={errors.cidade}  placeholder="Cidade" /></div>
                    <div className="w-1/2" ><SelectDados funcaoAoMudar={(e) => selecionaEstado(e.target.value)} preValue={task?.informacoes[0].estado ? task?.informacoes[0].estado : "" } register={register} name="estado" error={ errors.estado }  placeholder="Estado" tipo="estados" estados={estados} /></div>
                </div>
                <div className="flex w-full gap-4">
                    <div className="w-1/2" ><InputDados editable={true} register={register } preValue={  Object.keys(selectedData).length === 0 ?  task?.informacoes[0].cep :  selectedData.Cep }  name="cep" error={errors.cep}  placeholder="Cep" /></div>
                    <div className="w-1/2" ><InputDados editable={true} register={register } preValue={  task?.informacoes[0].regiao } name="regiao" error={ errors.regiao }  placeholder="Região" /></div>
                </div>
                    <div className="w-full mt-8"> <SelectDados preValue={task?.informacoes[0].segmento ? task?.informacoes[0].segmento : "" } register={register} name="segmento" error={ errors.segmento }  placeholder="Segmento" tipo="segmento" /> </div>
                <div className="flex mt-8 w-full gap-4">
                    <div className="w-1/2" ><InputDados editable={true} register={ register } preValue={  Object.keys(selectedData).length === 0 ?  task?.informacoes[0].razao_social : selectedData['Razao social'] } name="razaoSocial" error={ errors.razao_social }  placeholder="Razão Social" /></div>
                    <div className="w-1/2" ><InputDados editable={true} register={ register } preValue={  Object.keys(selectedData).length === 0 ?   task?.informacoes[0].razao_fantasia : selectedData['Nome comercial'] } name="razaoFantasia" error={ errors.razao_fantasia }  placeholder="Razão Fantasia" /></div>
                </div>
                <div className="flex mt-2 w-full gap-4">
                    <div className="w-1/2" ><InputDados editable={true} register={ register } preValue={  Object.keys(selectedData).length === 0 ?  task?.informacoes[0].rua : selectedData.Endereco} name="rua" error={ errors.rua }  placeholder="Rua" /></div>
                    <div className="w-1/2" ><InputDados editable={true} register={ register } preValue={  Object.keys(selectedData).length === 0 ?  task?.informacoes[0].numero : selectedData.Numero} name="numero" error={ errors.numero }  placeholder="Número" /></div>
                </div>
                <div className="flex w-full gap-4 mt-12">
                    <div className="w-1/2 relative" >
                    <input type="radio" className="absolute top-4 right-2 z-50" checked={ clientType == "cnpj" ? true : false } onChange={() => setClientType("cnpj")} />
                    <div className="w-full" ><InputDados  wasChanged={handleFieldChanged} editable={true} register={ register } preValue={ Object.keys(selectedData).length === 0 ? task?.informacoes[0].cnpj : selectedData.CNPJ }   name="cnpj" error={errors.cnpj}  placeholder="Cnpj" /></div>                                
                    </div>
                    <div className="w-1/2 relative " >
                    <input type="radio" className="absolute top-4 right-2 z-50" checked={ clientType == "cpf" ? true : false } onChange={() => setClientType("cpf")} />
                    <div className="w-full" ><InputDados wasChanged={handleFieldChanged} editable={true} register={ register } preValue={ Object.keys(selectedData).length === 0 ? task?.informacoes[0].cpf  :selectedData.cpf }   name="cpf" error={errors.cpf} placeholder="CPF" /></div>
                    </div>
                </div>
                <div className="flex w-full gap-4 mt-12">
                    <div className="w-1/2" ><InputDados editable={true} register={ register } preValue={  Object.keys(selectedData).length === 0 ?  task?.informacoes[0].telefone : selectedData.telefone} name="telefone" error={ errors.telefone }  placeholder="Telefone" /></div>
                    <div className="w-1/2" ><InputDados editable={true} register={ register } preValue={ Object.keys(selectedData).length === 0 ? task?.informacoes[0].email:selectedData.email   }  name="email" error={errors.email}  placeholder="Email" /></div>                                
                </div>
            </div>
            <div className="w-1/2 ">
                <div className="flex flex-col w-full items-center">
                    <div className="mt-40" ><GrnBtn form="addLead" type="submit" big={true} nomeBtn="Salvar Dados Cliente" icon={<IoIosSave size={30} />} onClick={handleSubmit(onSubmitSavePotential)}  /></div>
                </div>
            </div>
            
          { true ? "" : <button onClick={() => setOpen(!open)} className="py-2 px-4 rounded-md border-none bg-blue-500 text-white font-semibold cursor-pointer hover:shadow-lg transition-all duration-500">Buscar empresa</button>}     
        </div>
        <Tooltip id="tooltip-4" />

        </form>
        }
        </>
    )
}