'use client'

import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Sales({ onBackToMenu }) {
    const [productSales, setProductSales] = useState({});
    const [salesData, setSalesData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/sales');
                if (!response.ok) {
                    throw new Error('Error al cargar las ventas');
                }
                const data = await response.json();
                
                const salesCount = {};
                let revenue = 0;
                data.forEach(item => {
                    salesCount[item.name] = item.totalSold;
                    revenue += item.totalRevenue;
                });
                
                setProductSales(salesCount);
                setSalesData(data);
                setTotalRevenue(revenue);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchSales();
    }, []);

    const productNames = Object.keys(productSales);
    const productQuantities = Object.values(productSales);

    const pieData = {
        labels: productNames,
        datasets: [
            {
                label: 'Cantidad Vendida',
                data: productQuantities,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="flex flex-col w-full p-8 bg-[#2C2F33] rounded-2xl shadow-xl">
            <button
                onClick={onBackToMenu}
                className="mt-4 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]"
            >
                Volver al Menú
            </button>
            <h2 className="text-2xl font-bold text-[#ffffff] mb-4">Gestión de Ventas</h2>
            <p className="text-sm font-light text-[#6B7280] mb-4">Aquí puedes gestionar las ventas del restaurante.</p>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#ffffff] mb-2">Registro de Ventas</h3>
                    <table className="w-full text-left text-[#E5E7EB]">
                        <thead>
                            <tr>
                                <th className="border-b border-[#4F46E5] p-2">Producto</th>
                                <th className="border-b border-[#4F46E5] p-2">Cantidad Vendida</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesData.map((item, index) => (
                                <tr key={index}>
                                    <td className="border-b border-[#4F46E5] p-2">{item.name}</td>
                                    <td className="border-b border-[#4F46E5] p-2">{item.totalSold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 text-[#E5E7EB]">
                        <p><strong>Total de Ganancias:</strong> ${totalRevenue.toFixed(2)}</p>
                        {/* Puedes agregar más valores aquí si es necesario */}
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#ffffff] mb-2">Distribución de Ventas</h3>
                    {productNames.length > 0 ? (
                        <div className="w-48 h-48 mx-auto">
                            <Pie data={pieData} />
                        </div>
                    ) : (
                        <p className="text-[#E5E7EB]">No hay datos de ventas para mostrar.</p>
                    )}
                </div>
            </div>

            
        </div>
    );
} 