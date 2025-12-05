import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface DetalleBoleta {
    id: number;
    nombre_producto: string;
    precio_unitario: number;
    cantidad: number;
    subtotal: number;
}

interface Usuario {
    id: number;
    nombre: string;
    email: string;
}

interface Boleta {
    id: number;
    total: number;
    estado: string;
    fecha_creacion: string;
    fecha_pago: string | null;
    metodo_pago: string | null;
    detalles: DetalleBoleta[];
    usuario: Usuario;
}

function DetallesBoleta() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [boleta, setBoleta] = useState<Boleta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchBoleta();
        }
    }, [id]);

    const fetchBoleta = async () => {
        if (!id) return;
        
        try {
            setLoading(true);
            console.log('📄 Cargando boleta:', id);
            const response = await fetch(`http://localhost:3000/boletas/${id}`);
            
            if (!response.ok) {
                throw new Error('Boleta no encontrada');
            }

            const data = await response.json();
            console.log('✅ Boleta cargada:', data);
            setBoleta(data);
            setLoading(false);
        } catch (err: any) {
            console.error('❌ Error:', err);
            setError(err.message);
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

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="w-16 h-16 border-4 border-t-white border-opacity-30 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl">Cargando boleta...</p>
                </div>
            </div>
        );
    }

    if (error || !boleta) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center text-white bg-red-600 bg-opacity-20 p-8 rounded-xl max-w-md">
                    <h2 className="text-3xl font-bold mb-4">Error</h2>
                    <p className="mb-6">{error || 'Boleta no encontrada'}</p>
                    <button
                        onClick={() => navigate('/mis-boletas')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Volver a Mis Boletas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-4 md:p-6 text-gray-100">
            <div className="max-w-3xl mx-auto">
                {/* Botones - ocultos al imprimir */}
                <div className="mb-4 flex justify-between print:hidden">
                    <button
                        onClick={() => navigate('/mis-boletas')}
                        className="text-gray-400 hover:text-white hover:underline flex items-center gap-1"
                    >
                        ← Volver
                    </button>
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 transition"
                    >
                        🖨️ Imprimir
                    </button>
                </div>

                {/* Boleta - Fondo gris 800 en pantalla, blanco en impresión */}
                <div className="bg-gray-800 border border-gray-700 p-6 shadow-xl rounded-lg print:bg-white print:text-black print:border-black print:shadow-none">
                    
                    {/* Header */}
                    <div className="text-center mb-6 pb-4 border-b border-gray-700 print:border-black">
                        <h1 className="text-2xl font-bold text-white print:text-black">BOLETA DE VENTA</h1>
                        <p className="text-xl font-bold mt-1 text-gray-300 print:text-black">Nº {boleta.id}</p>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div>
                            <p className="font-bold text-gray-400 uppercase print:text-black">CLIENTE:</p>
                            <p className="text-lg font-semibold text-white print:text-black">{boleta.usuario.nombre}</p>
                            <p className="text-gray-300 print:text-black">{boleta.usuario.email}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-400 uppercase print:text-black">FECHA:</p>
                            <p className="text-white print:text-black">{formatDate(boleta.fecha_creacion)}</p>
                            <p className="mt-2 text-white print:text-black">
                                <span className="font-bold text-gray-400 uppercase print:text-black">ESTADO: </span> 
                                {boleta.estado.toUpperCase()}
                            </p>
                            {boleta.fecha_pago && (
                                <p className="text-xs mt-1 text-green-400 print:text-black">Pagada: {formatDate(boleta.fecha_pago)}</p>
                            )}
                        </div>
                    </div>

                    {/* Tabla de productos */}
                    <div className="mb-8 overflow-hidden rounded-lg border border-gray-700 print:border-black">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-700 text-white print:bg-gray-200 print:text-black">
                                    <th className="text-left p-3 font-bold">PRODUCTO</th>
                                    <th className="text-center p-3 font-bold">CANT.</th>
                                    <th className="text-right p-3 font-bold">PRECIO</th>
                                    <th className="text-right p-3 font-bold">SUBTOTAL</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700 print:divide-black">
                                {boleta.detalles.map((detalle, index) => (
                                    <tr key={detalle.id} className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} hover:bg-gray-700 transition-colors print:bg-white`}>
                                        <td className="p-3 text-gray-200 print:text-black">{detalle.nombre_producto}</td>
                                        <td className="text-center p-3 text-gray-300 print:text-black">{detalle.cantidad}</td>
                                        <td className="text-right p-3 text-gray-300 print:text-black">US$ {Number(detalle.precio_unitario).toFixed(2)}</td>
                                        <td className="text-right p-3 font-semibold text-white print:text-black">US$ {Number(detalle.subtotal).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Total */}
                    <div className="flex justify-end mb-6">
                        <div className="bg-gray-900 border border-gray-700 text-white p-4 w-full md:w-1/2 rounded print:bg-gray-100 print:text-black print:border-black">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-400 print:text-black">TOTAL:</span>
                                <span className="text-2xl font-bold text-white print:text-black">${Number(boleta.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-4 border-t border-gray-700 print:border-black text-xs text-gray-400 print:text-black">
                        <p className="font-bold text-white print:text-black">Gracias por su compra</p>
                        <p>Los Silson - Tienda de Videojuegos</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetallesBoleta;