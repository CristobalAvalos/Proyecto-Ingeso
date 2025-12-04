import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface DetalleBoleta {
    id: number;
    nombre_producto: string;
    precio_unitario: number;
    cantidad: number;
    subtotal: number;
}

interface Boleta {
    id: number;
    total: number;
    estado: string;
    fecha_creacion: string;
    fecha_pago: string | null;
    metodo_pago: string | null;
    detalles: DetalleBoleta[];
}

function MisBoletas() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [boletas, setBoletas] = useState<Boleta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    console.log('🔍 MisBoletas renderizado - Usuario:', user);

    useEffect(() => {
        console.log('🔄 useEffect - Verificando usuario');
        
        if (!user) {
            console.log('❌ No hay usuario');
            setLoading(false);
            setError('Debes iniciar sesión para ver tus boletas');
            return;
        }

        console.log('✅ Usuario encontrado, ID:', user.id);
        fetchBoletas();
    }, [user]);

    const fetchBoletas = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            setError(null);
            console.log('📄 Fetching boletas para usuario:', user.id);
            
            const url = `http://localhost:3000/boletas/usuario/${user.id}`;
            console.log('🌐 URL:', url);
            
            const response = await fetch(url);
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Boletas recibidas:', data);
            
            setBoletas(data);
            setLoading(false);
        } catch (err: any) {
            console.error('❌ Error completo:', err);
            setError(err.message || 'Error al cargar las boletas');
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEstadoBadge = (estado: string) => {
        const styles = {
            pendiente: 'bg-yellow-200 text-yellow-800',
            pagada: 'bg-green-200 text-green-800',
            cancelada: 'bg-red-200 text-red-800'
        };

        return (
            <span className={`${styles[estado as keyof typeof styles] || 'bg-gray-200 text-gray-800'} px-2 py-1 text-xs font-bold uppercase`}>
                {estado}
            </span>
        );
    };

    if (loading) {
        console.log('⏳ Mostrando estado de carga');
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="w-16 h-16 border-4 border-t-white border-opacity-30 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl">Cargando boletas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        console.log('❌ Mostrando error:', error);
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center text-white bg-red-600 bg-opacity-20 p-8 rounded-xl max-w-md">
                    <h2 className="text-3xl font-bold mb-4">Error</h2>
                    <p className="mb-6">{error}</p>
                    {!user ? (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                            Ir a Login
                        </button>
                    ) : (
                        <button
                            onClick={fetchBoletas}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                            Reintentar
                        </button>
                    )}
                </div>
            </div>
        );
    }

    console.log('✅ Mostrando contenido principal, boletas:', boletas.length);
    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="mb-4 flex items-center gap-2 text-gray-300 hover:text-white transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Volver
                    </button>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Mis Boletas</h1>
                    <p className="text-gray-400">Historial de todas tus compras</p>
                </div>

                {/* Lista de Boletas */}
                {boletas.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-gray-300 rounded">
                        <p className="text-xl mb-4">No hay boletas</p>
                        <button
                            onClick={() => navigate('/catalogo')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Ir al Catálogo
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {boletas.map((boleta) => (
                            <div key={boleta.id} className="bg-white border border-gray-300 p-4">
                                {/* Header de la boleta */}
                                <div className="flex justify-between items-start mb-3 pb-3 border-b">
                                    <div>
                                        <h3 className="text-lg font-bold">Boleta #{boleta.id}</h3>
                                        <p className="text-sm text-gray-600">
                                            {formatDate(boleta.fecha_creacion)}
                                        </p>
                                        {boleta.fecha_pago && (
                                            <p className="text-xs text-green-700 mt-1">
                                                Pagada: {formatDate(boleta.fecha_pago)}
                                                {boleta.metodo_pago && ` - ${boleta.metodo_pago}`}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        {getEstadoBadge(boleta.estado)}
                                    </div>
                                </div>

                                {/* Productos */}
                                <div className="mb-3">
                                    {boleta.detalles.map((detalle) => (
                                        <div key={detalle.id} className="flex justify-between py-2 border-b border-gray-200">
                                            <div>
                                                <p className="font-medium text-gray-900">{detalle.nombre_producto}</p>
                                                <p className="text-xs text-gray-500">
                                                    Cantidad: {detalle.cantidad} × ${Number(detalle.precio_unitario).toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-gray-900">${Number(detalle.subtotal).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div className="flex justify-between pt-2 border-t font-bold text-gray-900">
                                    <span>TOTAL:</span>
                                    <span>${Number(boleta.total).toFixed(2)}</span>
                                </div>
                                
                                <button
                                    onClick={() => navigate(`/boleta/${boleta.id}`)}
                                    className="mt-3 w-full bg-blue-500 text-white py-2 text-sm hover:bg-blue-600"
                                >
                                    Ver Detalle
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MisBoletas;
