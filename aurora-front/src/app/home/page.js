'use client'

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faClipboardList, faChartLine, faFileAlt, faUsers, faUtensils } from '@fortawesome/free-solid-svg-icons';
import Inventory from '../inventory/Inventory';
import Orders from '../orders/Orders';
import Sales from '../sales/page';
import Reports from '../reports/Reports';
import Employees from '../employees/Employees';
import Menu from '../menu/Menu';

export default function Home() {
    const [username, setUsername] = useState('');
    const [activeView, setActiveView] = useState('home'); // Estado para controlar la vista activa

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const renderView = () => {
        switch (activeView) {
            case 'inventory':
                return <Inventory onBackToMenu={() => setActiveView('home')} />;
            case 'orders':
                return <Orders onBackToMenu={() => setActiveView('home')} />;
            case 'sales':
                return <Sales onBackToMenu={() => setActiveView('home')} />;
            case 'reports':
                return <Reports onBackToMenu={() => setActiveView('home')} />;
            case 'employees':
                return <Employees onBackToMenu={() => setActiveView('home')} />;
            case 'menu':
                return <Menu onBackToMenu={() => setActiveView('home')} />;
            default:
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div
                            className="flex flex-col items-center p-4 bg-[#3B3F45] rounded-lg shadow-md cursor-pointer hover:bg-[#4F46E5]"
                            onClick={() => setActiveView('inventory')}
                        >
                            <FontAwesomeIcon icon={faBox} size="2x" className="text-[#E5E7EB] mb-2" />
                            <span className="text-[#E5E7EB]">Inventario</span>
                        </div>
                        <div
                            className="flex flex-col items-center p-4 bg-[#3B3F45] rounded-lg shadow-md cursor-pointer hover:bg-[#4F46E5]"
                            onClick={() => setActiveView('orders')}
                        >
                            <FontAwesomeIcon icon={faClipboardList} size="2x" className="text-[#E5E7EB] mb-2" />
                            <span className="text-[#E5E7EB]">Pedidos</span>
                        </div>
                        <div
                            className="flex flex-col items-center p-4 bg-[#3B3F45] rounded-lg shadow-md cursor-pointer hover:bg-[#4F46E5]"
                            onClick={() => setActiveView('sales')}
                        >
                            <FontAwesomeIcon icon={faChartLine} size="2x" className="text-[#E5E7EB] mb-2" />
                            <span className="text-[#E5E7EB]">Ventas</span>
                        </div>
                        <div
                            className="flex flex-col items-center p-4 bg-[#3B3F45] rounded-lg shadow-md cursor-pointer hover:bg-[#4F46E5]"
                            onClick={() => setActiveView('reports')}
                        >
                            <FontAwesomeIcon icon={faFileAlt} size="2x" className="text-[#E5E7EB] mb-2" />
                            <span className="text-[#E5E7EB]">Reportes</span>
                        </div>
                        <div
                            className="flex flex-col items-center p-4 bg-[#3B3F45] rounded-lg shadow-md cursor-pointer hover:bg-[#4F46E5]"
                            onClick={() => setActiveView('employees')}
                        >
                            <FontAwesomeIcon icon={faUsers} size="2x" className="text-[#E5E7EB] mb-2" />
                            <span className="text-[#E5E7EB]">Empleados</span>
                        </div>
                        <div
                            className="flex flex-col items-center p-4 bg-[#3B3F45] rounded-lg shadow-md cursor-pointer hover:bg-[#4F46E5]"
                            onClick={() => setActiveView('menu')}
                        >
                            <FontAwesomeIcon icon={faUtensils} size="2x" className="text-[#E5E7EB] mb-2" />
                            <span className="text-[#E5E7EB]">Menú</span>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col w-full md:w-3/4 xl:w-2/3 mx-auto mt-6 p-8 bg-[#2C2F33] rounded-2xl shadow-xl">
            <h1 className="text-3xl font-bold text-[#ffffff] mb-6">Bienvenido a AURORA - {username}</h1>
            <p className="text-sm font-light text-[#6B7280] mb-8">Has iniciado sesión exitosamente.</p>
            {renderView()}
        </div>
    );
}
