import { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface InputProps {
    placeholder?: string;
    name: string;
    icon?: any;
    error?: string;
    rules?: RegisterOptions;
    insidePlaceholder?: string;
    type?: string;
    preValue?: string | null ;
    register: UseFormRegister<any>;
    wasChanged?: (name: string) => void;
    customCss?: string;
    requiredDefault?: boolean;
    editable: boolean;
    isChanged?: boolean;
    tirarTopo?: boolean;
    handleCpfOrCnpj?: (nome: string, valor: string) => void;
    }

export function InputDados({ tirarTopo = false, editable = false, isChanged, wasChanged, requiredDefault, register, preValue, type, placeholder, name, icon, error, insidePlaceholder, customCss }: InputProps) {
    let formattedPreValue = preValue;
    
    
    if (type === "date" && preValue && preValue.includes("/")) {
        const [day, month, year] = preValue.split("/");
        formattedPreValue = `${year}-${month}-${day}`;
    } else if (type == "date" && preValue && preValue.includes("-")) {
        const [year, month, day] = preValue.split("-");
        formattedPreValue = `${year}-${month}-${day}`;
    } else if (type === "time" && preValue) {
        formattedPreValue = preValue;
    } else if (type == "numero" && preValue) {
        formattedPreValue = preValue.replace(/[^0-9]/g, "");
    }

    console.log(formattedPreValue);

    const handleInputChange = (event: any) => {
        if (wasChanged) wasChanged(name); 
        


        if (type === "numero") {
            const inputValue = event.target.value;
            const numericValue = inputValue.replace(/\D/g, "");
            event.target.value = numericValue;
        }
    }

    return (
        <div className={`relative ${ tirarTopo ? "" : "mt-4" } `}>
            <p className="m-0 font-semibold text-sm">{placeholder}</p>
            <div className="absolute ml-2 mt-3 flex items-center justify-center">{icon}</div>
            <div className='flex items-center'>
                <input disabled={!editable}  {...(requiredDefault ? { required: true } : {})} { ...register(name, { value: formattedPreValue ? formattedPreValue : "", onChange: (e) => handleInputChange(e) } )}  type={type ? type : "text"} placeholder={insidePlaceholder ? insidePlaceholder : ""} className={` ${customCss} ${isChanged ? "bordaSelecionado" : ""} corPlaceholder customBorderInput transition-all duration-500  text-black fontePadrao font-semibold w-full h-10 rounded-md text-lg ${icon ? 'pl-9' : 'pr-6 pl-2'} focus:outline-none focus:border-2  `} />
                {/*
                {editableValue ?
                    <div onClick={() => setEditable(!editable)} className={`ml-2 w-10 h-10 ${editable ? "bg-red-500" : "bg-black"} rounded-md flex items-center justify-center cursor-pointer`}>
                        {editable ? <IoMdClose color="white" /> : <FaPencilAlt color='white' />}
                    </div>
                    :
                    ""
                */}
            </div>
            <p className='text-red-600 m-0 font-semibold text-sm'>{error ? error : ''}</p>
        </div>
    )
}
