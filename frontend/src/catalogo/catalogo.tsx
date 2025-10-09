import { useEffect, useState } from "react";
// No import './catalogo.css'; needed, using Tailwind

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

interface Game {
    id: number;
    name: string;
    cover?: Cover;
    genres?: Genre[];
    platforms?: Platform[];
    total_rating?: number;
    total_rating_count?: number;
    first_release_date?: number;
}

function Catalogo() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string>('todos');

    const genres = [
        { id: 'todos', name: 'Todos los géneros' },
        { id: 'hack', name: 'Acción' },
        { id: 'rpg', name: 'RPG' },
        { id: 'shooter', name: 'Shooter' },
        { id: 'strategy', name: 'Estrategia' },
        { id: 'adventure', name: 'Aventura' },
        { id: 'racing', name: 'Carreras' },
        { id: 'sports', name: 'Deportes' },
        { id: 'puzzle', name: 'Puzzle' },
        { id: 'fighting', name: 'Lucha' },
        { id: 'indie', name: 'Indie' },
    ];

    const fetchGames = () => {
        setLoading(true);
        setError(null);

        // NOTE: These URLs point to a local server (http://localhost:3000)
        const url = selectedGenre === 'todos'
            ? 'http://localhost:3000/catalogo/top500'
            : `http://localhost:3000/catalogo/genero/${selectedGenre}`;

        console.log(`🔍 Cargando: ${url}`);

        // Simplified fetch with exponential backoff for robustness
        const attemptFetch = (retryCount = 0) => {
            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Error ${res.status}: Falló la carga del catálogo.`);
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log(`✅ ${data.length} juegos cargados`);
                    setGames(data);
                    setLoading(false);
                })
                .catch((err) => {
                    if (retryCount < 3) {
                        const delay = Math.pow(2, retryCount) * 1000;
                        console.warn(`⚠️ Intento ${retryCount + 1} fallido. Reintentando en ${delay / 1000}s...`);
                        setTimeout(() => attemptFetch(retryCount + 1), delay);
                    } else {
                        console.error('❌ Error fatal:', err);
                        setError(err.message);
                        setLoading(false);
                    }
                });
        };

        attemptFetch();
    };

    useEffect(() => {
        fetchGames();
    }, [selectedGenre]);

    const getCoverUrl = (cover?: Cover) => {
        // Fallback placeholder image for missing covers
        if (!cover?.url) return 'https://placehold.co/264x374/334155/ffffff?text=No+Image';
        // The covers from the IGDB API (often proxied via the server) usually don't need size modification here
        return cover.url;
    };

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return 'Fecha desconocida';
        // Convert seconds to milliseconds for Date constructor
        return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleGenreChange = (genreId: string) => {
        console.log(`🎮 Cambiando a género: ${genreId}`);
        setSelectedGenre(genreId);
    };

    // --- Tailwind Classes for Dark Theme ---
    const primaryButtonClasses = "bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-xl font-semibold cursor-pointer transition duration-300 ease-in-out hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/50 active:translate-y-0 shadow-md";
    // Updated secondary button for better contrast on bg-gray-800
    const secondaryButtonClasses = "bg-gray-700 text-white p-3 rounded-xl font-semibold cursor-pointer transition duration-300 ease-in-out border-2 border-gray-600 hover:bg-gray-600 hover:border-gray-500 shadow-sm";


    /* --- Loading State (Updated background) --- */
    if (loading) {
        return (
            <div className="min-h-screen p-8 w-full max-w-full overflow-x-hidden flex justify-center items-center bg-gray-800">
                <div className="flex flex-col items-center justify-center text-white">
                    <h2 className="text-3xl font-bold mb-4">🔄 Cargando catálogo...</h2>
                    <div className="w-12 h-12 border-4 border-t-white border-opacity-30 border-solid rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-300 text-lg text-center">
                        {selectedGenre !== 'todos'
                            ? `Filtrando por ${genres.find(g => g.id === selectedGenre)?.name}...`
                            : 'Cargando todos los juegos populares...'}
                    </p>
                </div>
            </div>
        );
    }

    /* --- Error State (Updated background) --- */
    if (error) {
        return (
            <div className="min-h-screen p-8 w-full max-w-full overflow-x-hidden flex justify-center items-center bg-gray-800">
                <div className="text-center text-white p-8 rounded-xl bg-red-600 bg-opacity-80 backdrop-blur-sm shadow-2xl">
                    <h2 className="text-3xl font-bold mb-4">❌ Error al cargar el catálogo</h2>
                    <p className="mb-6">{error}</p>
                    <button className={primaryButtonClasses.replace('p-3', 'p-2.5')} onClick={fetchGames}>
                        🔄 Reintentar
                    </button>
                </div>
            </div>
        );
    }

    /* --- Main Content (Updated background and header styles) --- */
    return (
        <div className="min-h-screen p-8 w-full max-w-full overflow-x-hidden bg-gray-800 font-sans">
            <header className="text-center mb-12 text-white max-w-full">
                <h1 className="text-5xl font-extrabold mb-2 text-shadow-md lg:text-6xl text-indigo-300">Catálogo de Juegos</h1>
                <p className="text-xl opacity-90 mb-4 text-gray-200">
                    {selectedGenre === 'todos'
                        ? 'Explora los juegos mejor valorados'
                        : `Juegos de ${genres.find(g => g.id === selectedGenre)?.name}`}
                </p>

                {/* Filtro de género - Updated for dark theme */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto p-4 bg-gray-900 bg-opacity-70 rounded-2xl shadow-2xl backdrop-blur-md max-w-xl border border-gray-700">
                    <label htmlFor="genre-select" className="text-lg font-semibold text-white">
                        Filtrar por género:
                    </label>
                    <select
                        id="genre-select"
                        // Updated classes for dark theme: bg-gray-900, text-white, border-gray-600
                        className="p-3 text-lg border-2 border-gray-600 rounded-xl bg-gray-900 text-white cursor-pointer transition duration-300 ease-in-out min-w-[200px] max-w-full font-medium appearance-none shadow-lg focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50 hover:shadow-xl"
                        value={selectedGenre}
                        onChange={(e) => handleGenreChange(e.target.value)}
                    >
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id} className="bg-gray-900 text-white">
                                {genre.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-4">
                    <span className="bg-gray-700 p-2 px-4 rounded-full font-semibold text-white text-sm shadow-md">
                        🔥 {games.length} juegos {selectedGenre !== 'todos' && `de ${genres.find(g => g.id === selectedGenre)?.name}`}
                    </span>
                    <button
                        className="bg-gray-700 p-2 px-4 rounded-full font-semibold text-white text-sm shadow-md cursor-pointer transition duration-300 ease-in-out hover:bg-gray-600 hover:-translate-y-0.5"
                        onClick={fetchGames}
                        title="Recargar catálogo"
                    >
                        🔄 Recargar
                    </button>
                </div>
            </header>

            {/* Game Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-7xl mx-auto w-full p-0">
                {games.map((game) => (
                    // Card color remains white for contrast, but adjusted shadow
                    <div key={game.id} className="bg-white rounded-2xl overflow-hidden shadow-2xl transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-indigo-500/50 flex flex-col w-full">
                        <div className="relative w-full h-80 overflow-hidden bg-gray-900">
                            <img
                                src={getCoverUrl(game.cover)}
                                alt={game.name}
                                className="w-full h-full object-cover transition duration-500 ease-in-out transform hover:scale-105"
                                loading="lazy"
                                onError={(e) => {
                                    // Fallback to placeholder on error
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://placehold.co/264x374/334155/ffffff?text=No+Image';
                                }}
                            />
                            {game.total_rating && (
                                <div className="absolute top-3 right-3 bg-indigo-600 text-white p-2 px-4 rounded-full font-bold text-sm shadow-lg">
                                    ⭐ {Math.round(game.total_rating)}/100
                                </div>
                            )}
                        </div>

                        <div className="p-4 flex flex-col gap-3 flex-grow">
                            <h3 className="text-xl font-extrabold text-gray-800 m-0 leading-tight line-clamp-2">{game.name}</h3>

                            {/* Genres */}
                            {game.genres && game.genres.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {game.genres.slice(0, 3).map((genre) => (
                                        <span key={genre.id} className="bg-purple-600 text-white p-1.5 px-3 rounded-xl text-xs font-semibold shadow-sm">
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Platforms */}
                            {game.platforms && game.platforms.length > 0 && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-gray-500 font-semibold uppercase">Plataformas:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {game.platforms.slice(0, 3).map((platform) => (
                                            <span key={platform.id} className="bg-gray-100 text-gray-700 p-1 px-2.5 rounded-lg text-xs font-medium border border-gray-200">
                                                {platform.name}
                                            </span>
                                        ))}
                                        {game.platforms.length > 3 && (
                                            <span className="bg-gray-200 text-gray-800 p-1 px-2.5 rounded-lg text-xs font-semibold">
                                                +{game.platforms.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Release Date */}
                            {game.first_release_date && (
                                <p className="text-sm text-gray-600 m-0">
                                    📅 {formatDate(game.first_release_date)}
                                </p>
                            )}

                            {/* Rating Count */}
                            {game.total_rating_count && game.total_rating_count > 0 && (
                                <p className="text-xs text-gray-400 m-0">
                                    👥 {game.total_rating_count.toLocaleString()} valoraciones
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 mt-auto pt-4">
                                <button className={`${primaryButtonClasses} flex-1 text-sm`}>
                                    Ver detalles
                                </button>
                                <button className={`${secondaryButtonClasses} flex-1 text-sm`}>
                                    🛒 Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- No Results State --- */}
            {games.length === 0 && (
                <div className="text-center text-white p-16">
                    <h2 className="text-3xl font-bold mb-4">🔍 No se encontraron juegos</h2>
                    <p className="text-xl mb-6">No hay juegos de {genres.find(g => g.id === selectedGenre)?.name}</p>
                    <button
                        className={primaryButtonClasses.replace('p-3', 'p-2.5')}
                        onClick={() => setSelectedGenre('todos')}
                    >
                        Ver todos los juegos
                    </button>
                </div>
            )}
        </div>
    );
}

export default Catalogo;
