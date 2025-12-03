import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Protección simple: Si no es admin, no debería ver esto
    if (!user || user.rol !== 'admin') {
        return <div className="p-10 text-white">Acceso Denegado. Solo admins.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <header className="flex justify-between items-center mb-10 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold text-indigo-500">Panel de Administración</h1>
                <div className="flex items-center gap-4">
                    <span>Hola, Admin {user.nombre}</span>
                    
                </div>
            </header>

            {/* Grid de Estadísticas (Mockup) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm uppercase">Ventas Totales</h3>
                    <p className="text-3xl font-bold mt-2 text-emerald-400">$1,250,900</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm uppercase">Usuarios Registrados</h3>
                    <p className="text-3xl font-bold mt-2 text-blue-400">1,402</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm uppercase">Juego Más Vendido</h3>
                    <p className="text-2xl font-bold mt-2 text-purple-400">Escape from Tarkov</p>
                </div>
            </div>

            {/* Aquí irían tus gráficas reales luego */}
            <div className="bg-gray-800 p-6 rounded-xl h-64 flex items-center justify-center border border-gray-700 border-dashed">
                <p className="text-gray-500">Aquí irá el gráfico de ventas mensuales...</p>
            </div>
        </div>
    );
};

export default AdminDashboard;