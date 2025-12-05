import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Estadisticas {
    totalVentas: number;
    cantidadBoletas: number;
    ventasPorMes: { mes: string; total: number }[];
    topJuegos: { nombre: string; cantidad: number; ingresos: number }[];
}

const AdminDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Protección simple: Si no es admin, no debería ver esto
    if (!user || user.rol !== 'admin') {
        return <div className="p-10 text-white">Acceso Denegado. Solo admins.</div>;
    }

    useEffect(() => {
        fetchEstadisticas();
    }, []);

    const fetchEstadisticas = async () => {
        try {
            const response = await fetch('http://localhost:3000/boletas/estadisticas');
            const data = await response.json();
            setEstadisticas(data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-xl">Cargando estadísticas...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <header className="flex justify-between items-center mb-10 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold text-indigo-500">Panel de Administración</h1>
                <div className="flex items-center gap-4">
                    <span>Hola, Admin {user.nombre}</span>
                </div>
            </header>

            {/* Grid de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm uppercase">Ventas Totales</h3>
                    <p className="text-3xl font-bold mt-2 text-emerald-400">
                        ${estadisticas?.totalVentas.toFixed(2) || '0.00'}
                    </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm uppercase">Boletas Pagadas</h3>
                    <p className="text-3xl font-bold mt-2 text-blue-400">
                        {estadisticas?.cantidadBoletas || 0}
                    </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm uppercase">Juego Más Vendido</h3>
                    <p className="text-xl font-bold mt-2 text-purple-400">
                        {estadisticas?.topJuegos[0]?.nombre || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        {estadisticas?.topJuegos[0]?.cantidad || 0} unidades
                    </p>
                </div>
            </div>

            {/* Gráfico de Ventas por Mes */}
            <div className="bg-gray-800 p-6 rounded-xl mb-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-indigo-400">Ventas por Mes (Últimos 6 meses)</h2>
                <div className="h-64 flex items-end justify-between gap-2">
                    {estadisticas?.ventasPorMes.map((mes, index) => {
                        const maxVenta = Math.max(...(estadisticas?.ventasPorMes.map(m => m.total) || [1]));
                        const altura = (mes.total / maxVenta) * 100;
                        return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div className="w-full flex flex-col items-center">
                                    <span className="text-xs text-emerald-400 mb-1 font-bold">
                                        ${mes.total.toFixed(0)}
                                    </span>
                                    <div 
                                        className="w-full bg-indigo-600 rounded-t hover:bg-indigo-500 transition"
                                        style={{ height: `${altura}%`, minHeight: mes.total > 0 ? '20px' : '2px' }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-400 mt-2">{mes.mes}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top 5 Juegos Más Vendidos */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-indigo-400">Top 5 Juegos Más Vendidos</h2>
                <div className="space-y-4">
                    {estadisticas?.topJuegos.map((juego, index) => {
                        const maxCantidad = estadisticas?.topJuegos[0]?.cantidad || 1;
                        const porcentaje = (juego.cantidad / maxCantidad) * 100;
                        return (
                            <div key={index}>
                                <div className="flex justify-between mb-1">
                                    <span className="font-semibold">{index + 1}. {juego.nombre}</span>
                                    <span className="text-emerald-400 font-bold">
                                        {juego.cantidad} unidades | ${juego.ingresos.toFixed(2)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                    <div 
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all"
                                        style={{ width: `${porcentaje}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {(!estadisticas?.topJuegos || estadisticas.topJuegos.length === 0) && (
                    <p className="text-gray-500 text-center py-8">No hay datos de ventas aún</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;