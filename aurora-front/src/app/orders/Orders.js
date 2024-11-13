'use client'

import { useState, useEffect } from 'react';
import OrderModal from './OrderModal';
import WarningModal from './WarningModal';
import EditOrderModal from './EditOrderModal';
import NewOrderModal from './NewOrderModal';
import AlertModal from './AlertModal';

export default function Orders({ onBackToMenu }) {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [showEditOrderModal, setShowEditOrderModal] = useState(false);
    const [showNewOrderModal, setShowNewOrderModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlertModal, setShowAlertModal] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/orders');
                if (!response.ok) {
                    throw new Error('Error al cargar los pedidos');
                }
                const data = await response.json();
                setOrders(data.filter(order => order.paymentStatus === 'pending'));
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setShowEditOrderModal(true);
    };

    const handleSaveOrderChanges = (updatedItems) => {
        console.log('Guardar cambios en el pedido:', updatedItems);
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el pedido');
            }
            setOrders(orders.filter(order => order.id !== orderId));
            setAlertMessage('Pedido eliminado exitosamente');
            setShowAlertModal(true);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el pedido');
        }
    };

    const confirmDeleteOrder = (orderId) => {
        setOrderToDelete(orderId);
        setShowWarningModal(true);
    };

    const handleSaveNewOrder = async (newOrder) => {
        const isTableOccupied = orders.some(order => order.tableNumber === newOrder.tableNumber && order.paymentStatus === 'pending');
        if (isTableOccupied) {
            alert('La mesa ya está ocupada. No se puede tomar un nuevo pedido.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });
            if (!response.ok) {
                throw new Error('Error al crear el nuevo pedido');
            }
            const createdOrder = await response.json();
            setOrders([...orders, createdOrder]);
            alert('Nuevo pedido creado exitosamente');
            setShowNewOrderModal(false);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear el nuevo pedido');
            setShowNewOrderModal(false);
        }
    };

    return (
        <div className="flex flex-col w-full p-8 bg-[#2C2F33] rounded-2xl shadow-xl">
            <button
                onClick={onBackToMenu}
                className="mt-4 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]"
            >
                Volver al Menú
            </button>
            <h2 className="text-2xl font-bold text-[#ffffff] mb-4">Pedidos Pendientes</h2>
            <button
                onClick={() => setShowNewOrderModal(true)}
                className="mb-4 px-4 py-2 bg-green-500 text-[#ffffff] rounded-lg hover:bg-green-700"
            >
                Tomar Nuevo Pedido
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-[#3B3F45] p-4 rounded-lg shadow-md">
                        <h4 className="text-lg font-bold text-[#ffffff]">Mesa: {order.tableNumber}</h4>
                        <p className="text-[#E5E7EB]">Cliente: {order.customerName}</p>
                        <p className="text-[#E5E7EB]">
                            Total: ${typeof order.total === 'number' ? order.total.toFixed(2) : 'N/A'}
                        </p>
                        <button
                            onClick={() => handleOrderClick(order)}
                            className="mt-2 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]"
                        >
                            Ver Detalles
                        </button>
                        <button
                            onClick={() => handleEditOrder(order)}
                            className="mt-2 px-4 py-2 bg-yellow-500 text-[#ffffff] rounded-lg hover:bg-yellow-700"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => confirmDeleteOrder(order.id)}
                            className="mt-2 px-4 py-2 bg-red-500 text-[#ffffff] rounded-lg hover:bg-red-700"
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>

            {showOrderModal && selectedOrder && (
                <OrderModal order={selectedOrder} onClose={() => setShowOrderModal(false)} />
            )}

            {showWarningModal && (
                <WarningModal
                    onConfirm={() => {
                        handleDeleteOrder(orderToDelete);
                        setShowWarningModal(false);
                    }}
                    onCancel={() => setShowWarningModal(false)}
                />
            )}

            {showEditOrderModal && selectedOrder && (
                <EditOrderModal
                    order={selectedOrder}
                    onClose={() => setShowEditOrderModal(false)}
                    onSave={handleSaveOrderChanges}
                />
            )}

            {showNewOrderModal && (
                <NewOrderModal
                    onClose={() => setShowNewOrderModal(false)}
                    onSave={handleSaveNewOrder}
                />
            )}

            {showAlertModal && (
                <AlertModal
                    message={alertMessage}
                    onClose={() => setShowAlertModal(false)}
                />
            )}

            
        </div>
    );
} 