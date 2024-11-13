'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
          // Código que depende del cliente
          console.log('Esto se ejecuta solo en el cliente');
        }
      }, []);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                localStorage.setItem('username', data.username); // Guardar el nombre de usuario
                router.push('/home'); // Redirigir a la vista Home
            } else {
                alert(data.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al iniciar sesión');
        }
    };

    return (
        <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto mt-6 p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#2C2F33] rounded-2xl shadow-xl">
            <div className="flex flex-row gap-3 pb-4">
                <h1 className="text-3xl font-bold text-[#ffffff] my-auto">Login</h1>
            </div>
            <div className="text-sm font-light text-[#6B7280] pb-8">Ingresa para usar las funciones de AURORA</div>

            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="pb-2">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#ffffff]">Email</label>
                    <div className="relative text-gray-400">
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="pl-12 mb-2 bg-[#3B3F45] text-[#E5E7EB] border focus:border-transparent border-gray-600 sm:text-sm rounded-lg focus:ring-1 focus:outline-none focus:ring-gray-500 block w-full p-2.5" placeholder="name@company.com" autoComplete="off" />
                    </div>
                </div>

                <div className="pb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-[#ffffff]">Password</label>
                    <div className="relative text-gray-400">
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} placeholder="••••••••••" className="pl-12 mb-2 bg-[#3B3F45] text-[#E5E7EB] border focus:border-transparent border-gray-600 sm:text-sm rounded-lg focus:ring-1 focus:outline-none focus:ring-gray-500 block w-full p-2.5" autoComplete="new-password" />
                    </div>
                </div>

                <button type="submit" className="w-full text-[#FFFFFF] bg-[#4F46E5] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6">Login</button>
                <div className="text-sm font-light text-[#6B7280]">Aún no tienes cuenta?
                    <Link href="/register" className="font-medium text-[#4F46E5] hover:underline">Sign Up</Link>
                </div>
            </form>

            <div className="relative flex py-8 items-center">
                <div className="flex-grow border-t border-[1px] border-gray-200"></div>
                <span className="flex-shrink mx-4 font-medium text-gray-500"></span>
                <div className="flex-grow border-t border-[1px] border-gray-200"></div>
            </div>
        </div>
    );
}
