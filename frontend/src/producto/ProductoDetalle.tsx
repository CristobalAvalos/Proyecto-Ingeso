import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// --- Interfaces ---
interface Genre {
    id: number;
    name: string;
}
interface Platform {
    id: number;
    name: string;
}
interface Cover {
    id: number;
    url: string;
}
interface Screenshot {
    id: number;
    url: string;
}
interface Company {
    company: {
        name: string;
    };
    developer: boolean;
    publisher: boolean;
}
interface GameMode {
    id: number;
    name: string;
}
interface GameDetails {
    id: number;
    name: string;
    cover?: Cover;
    genres?: Genre[];
    platforms?: Platform[];
    total_rating?: number;
    total_rating_count?: number;
    first_release_date?: number;
    summary?: string;
    storyline?: string;
    screenshots?: Screenshot[];
    artworks?: Screenshot[];
    involved_companies?: Company[];
    game_modes?: GameMode[];
    price?: number;
}

function ProductoDetalle() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [game, setGame] = useState<GameDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3000/catalogo/detalles/${id}`);
                
                if (!response.ok) {
                    throw new Error('Juego no encontrado');
                }
                
                const data = await response.json();
                
                // Generar precio basado en el ID
                const gameWithPrice = {
                    ...data,
                    price: data.price || ((data.id % 50) + 10.99)
                };
                
                setGame(gameWithPrice);
                
                // Establecer la imagen principal
                if (gameWithPrice.cover?.url) {
                    setSelectedImage(gameWithPrice.cover.url);
                }
                
                setLoading(false);
            } catch (err: any) {
                console.error('Error cargando detalles:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (id) {
            fetchGameDetails();
        }
    }, [id]);

    const getCoverUrl = (cover?: Cover) => {
        if (!cover?.url) return 'https://placehold.co/600x800/334155/ffffff?text=No+Image';
        return cover.url;
    };

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return 'Fecha desconocida';
        return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleAddToCart = () => {
        if (game) {
            addToCart(game);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    const handleImageClick = (url: string) => {
        setSelectedImage(url);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="w-16 h-16 border-4 border-t-white border-opacity-30 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl">Cargando detalles del juego...</p>
                </div>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center text-white bg-red-600 bg-opacity-20 p-8 rounded-xl max-w-md">
                    <h2 className="text-3xl font-bold mb-4">Error</h2>
                    <p className="mb-6">{error || 'Juego no encontrado'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Volver al Catálogo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                {/* Botón Volver */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Volver al catálogo
                </button>

                {/* Grid Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Columna Izquierda - Imágenes */}
                    <div className="space-y-4">
                        {/* Imagen Principal */}
                        <div className="relative rounded-2xl overflow-hidden bg-gray-800 shadow-2xl">
                            <img
                                src={selectedImage || getCoverUrl(game.cover)}
                                alt={game.name}
                                className="w-full h-[500px] object-contain"
                            />
                        </div>


                    </div>

                    {/* Columna Derecha - Info y Compra */}
                    <div className="space-y-6">
                        {/* Título */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{game.name}</h1>
                            
                            {/* Rating */}
                            {game.total_rating && (
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-indigo-600 px-4 py-2 rounded-lg font-bold text-lg">
                                        ⭐ {Math.round(game.total_rating)}/100
                                    </div>
                                    {game.total_rating_count && (
                                        <span className="text-gray-400 text-sm">
                                            ({game.total_rating_count.toLocaleString()} valoraciones)
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Fecha de lanzamiento */}
                            {game.first_release_date && (
                                <p className="text-gray-400">
                                    📅 Lanzamiento: {formatDate(game.first_release_date)}
                                </p>
                            )}
                        </div>

                        {/* Géneros */}
                        {game.genres && game.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {game.genres.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold text-sm"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Precio y Botón de Compra */}
                        <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700">
                            <div className="mb-4">
                                <span className="text-gray-400 text-sm uppercase font-bold block mb-1">Precio</span>
                                <span className="text-5xl font-extrabold text-green-400">
                                    US$ {game.price?.toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition transform active:scale-95 ${
                                    addedToCart
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                                } shadow-lg`}
                            >
                                {addedToCart ? '✓ Agregado al Carrito' : '🛒 Agregar al Carrito'}
                            </button>

                            <button
                                onClick={() => {
                                    handleAddToCart();
                                    navigate('/carrito');
                                }}
                                className="w-full mt-3 bg-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition border-2 border-gray-600"
                            >
                                Comprar Ahora
                            </button>
                        </div>


                    </div>
                </div>

                {/* Sección de Descripción */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Descripción */}
                        {game.summary && (
                            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                                <h2 className="text-2xl font-bold mb-4 text-indigo-400">📝 Descripción</h2>
                                <p className="text-gray-300 leading-relaxed text-lg">{game.summary}</p>
                            </div>
                        )}

                        {/* Historia */}
                        {game.storyline && (
                            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                                <h2 className="text-2xl font-bold mb-4 text-indigo-400">📖 Historia</h2>
                                <p className="text-gray-300 leading-relaxed text-lg">{game.storyline}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Info Adicional */}
                    <div className="space-y-6">
                        {/* Modos de Juego */}
                        {game.game_modes && game.game_modes.length > 0 && (
                            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                                <h3 className="text-xl font-bold mb-4 text-indigo-400">🎲 Modos de Juego</h3>
                                <div className="space-y-2">
                                    {game.game_modes.map((mode) => (
                                        <div
                                            key={mode.id}
                                            className="bg-gray-900 text-white p-3 rounded-lg text-sm font-medium border border-gray-700"
                                        >
                                            {mode.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ProductoDetalle;
