import { useNavigate } from 'react-router-dom';
import { Input } from '../components/input';
import { CgProfile } from "react-icons/cg";
import { FaLock } from "react-icons/fa";
import { useState, useEffect, useContext } from 'react';
import {useForm} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ajax } from '../ajax/ajax';
import { ImSpinner8 } from "react-icons/im";
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/authProvider';
const schema = z.object({
    username: z.string().min(1, "Usuário é obrigatório"),
    password: z.string().min(1, "Senha é obrigatória")
})

type FormData = z.infer<typeof schema>



export function Login() {

    const { user } = useContext(AuthContext);


    const [loginErrors, setLoginErrors] = useState<string | null>(null);
    const [loginLoading, setloginLoading] = useState<boolean>(false);
    const [isWaiting, setIsWaiting] = useState(false);

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onSubmit"
    })  

    
    
    async function onSubmit(data: FormData) {
        setloginLoading(true);
        setLoginErrors("");
        const username = data.username;
        const password = data.password;
        const dataLogin = {email: username, senha: password}
        const response = await ajax({method: 'POST',endpoint: '/login', data: dataLogin});
        
        if (response.status == 'error') {
            if (response.message == "Erro de validação") {
                const erros = response.errors
                var msg = ''
                erros.forEach((e: any) => {
                    msg += e.msg + '\n';
                });
                setLoginErrors(msg);
                setloginLoading(false);
                return;
            }
            setLoginErrors(response.message);
            setloginLoading(false)
            return;
        }

        if (response.status == 'success') {
            setloginLoading(false);    
            navigate('/');
            toast.success("Usuário logado com sucesso")
            return;
        }

        toast.error("Erro Inesperado");
        setloginLoading(false);
    }

    const handleDebouncedClick = (e: any) => {
        if (isWaiting) {
            e.preventDefault();
            return;
        }
        setIsWaiting(true);
        setTimeout(() => {
            setIsWaiting(false);
        }, 500);

    }


    const handleNoAccess = (e: any) => {
        e.preventDefault();
        toast('Contate o Henrique - Suporte TI para acesso!', {
            icon: '👨‍💻',
        });
    }

    useEffect(() => {
        //replaced cons log
        if (user) {
            navigate("/");
        }
    }, [])
    

    return (
        
        <div className='w-screen h-screen bg-white flex items-center justify-center'>   
            <div className=' px-8 h-5/12 bg-custom-gray py-12 shadow-lg rounded-md flex flex-col items-center border   '>
                <form action="" className='flex flex-col  items-center' onSubmit={handleSubmit(onSubmit)}>
                    <h1 className='m-0 font-semibold'>Bem vindo(a) de volta! </h1>
                    <p className='m-0 font-semibold text-slate-600'>Informe seus dados para entrar</p>
                    <Input  placeholder="Usuário" icon={<CgProfile />} error={errors.username?.message} name="username" register={register}  />
                    <Input type="password"  placeholder="Senha" icon={<FaLock />} error={errors.password?.message} name="password" register={register} />
                        <button onClick={handleDebouncedClick} className={`h-12 w-full rounded-md border-none bg-green-500 text-white font-semibold text-lg mt-6 cursor-pointer hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg flex gap-4 items-center justify-center ${loginLoading ? "disabled:opacity-75 cursor-default" : ""} `}>{loginLoading ? "Entrando" : "Entrar"}{loginLoading ? <ImSpinner8 className='animate-spin' size={20} /> : ""}</button>
                    <p className=' text-red-600 m-0 font-semibold mt-2 '> {loginErrors}</p>
                </form> 
                <a href="" className=' no-underline text-black hover:text-blue-600 transition-all duration-300 mt-6' onClick={(e) => handleNoAccess(e)}>Não tenho acesso</a>
                <Toaster/>
            </div>
        </div>
    )
}