import { useEffect, useState } from "react";
import './catalogo.css';

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

function Catalogo(){
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
          
          const url = selectedGenre === 'todos'
              ? 'http://localhost:3000/catalogo/top500'
              : `http://localhost:3000/catalogo/genero/${selectedGenre}`;

          console.log(`🔍 Cargando: ${url}`);

          fetch(url)
              .then((res) => {
                  if (!res.ok) {
                      throw new Error('Error al obtener el catálogo');
                  }
                  return res.json();
              })
              .then((data) => {
                  console.log(`✅ ${data.length} juegos cargados`);
                  setGames(data);
                  setLoading(false);
              })
              .catch((err) => {
                  console.error('❌ Error:', err);
                  setError(err.message);
                  setLoading(false);
              });
        };

        useEffect(() => {
        fetchGames();
    }, [selectedGenre]);
            
        const getCoverUrl = (cover?: Cover) => {
        if (!cover?.url) return 'https://via.placeholder.com/264x374?text=No+Image';
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
        const handleGenreChange = (genreId: string) => {
        console.log(`🎮 Cambiando a género: ${genreId}`);
        setSelectedGenre(genreId);
    };

    if (loading) {
        return (
            <div className="catalogo-container">
                <div className="loading">
                    <h2>🔄 Cargando catálogo...</h2>
                    <div className="spinner"></div>
                    <p style={{ marginTop: '1rem', color: '#666' }}>
                        {selectedGenre !== 'todos' 
                            ? `Filtrando por ${genres.find(g => g.id === selectedGenre)?.name}...`
                            : 'Cargando todos los juegos populares...'}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="catalogo-container">
                <div className="error">
                    <h2>❌ Error al cargar el catálogo</h2>
                    <p>{error}</p>
                    <button className="btn-primary" onClick={fetchGames}>
                        🔄 Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="catalogo-container">
            <header className="catalogo-header">
                <h1>Catálogo de Juegos</h1>
                <p className="subtitle">
                    {selectedGenre === 'todos' 
                        ? 'Todos'
                        : `Juegos de ${genres.find(g => g.id === selectedGenre)?.name}`}
                </p>

                {/* Filtro de género */}
                <div className="genre-filter">
                    <label htmlFor="genre-select" className="filter-label">
                        Filtrar por género:
                    </label>
                    <select 
                        id="genre-select"
                        className="genre-select"
                        value={selectedGenre}
                        onChange={(e) => handleGenreChange(e.target.value)}
                    >
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="stats">
                    <span className="stat-badge">
                        🔥 {games.length} juegos {selectedGenre !== 'todos' && `de ${genres.find(g => g.id === selectedGenre)?.name}`}
                    </span>
                    <button 
                        className="stat-badge clickable" 
                        onClick={fetchGames}
                        title="Recargar catálogo"
                    >
                        🔄 Recargar
                    </button>
                </div>
            </header>

            <div className="games-grid">
                {games.map((game) => (
                    <div key={game.id} className="game-card">
                        <div className="game-image-container">
                            <img 
                                src={getCoverUrl(game.cover)} 
                                alt={game.name}
                                className="game-image"
                                loading="lazy"
                            />
                            {game.total_rating && (
                                <div className="rating-badge">
                                    ⭐ {Math.round(game.total_rating)}/100
                                </div>
                            )}
                        </div>

                        <div className="game-info">
                            <h3 className="game-title">{game.name}</h3>

                            {game.genres && game.genres.length > 0 && (
                                <div className="genres">
                                    {game.genres.slice(0, 3).map((genre) => (
                                        <span key={genre.id} className="genre-tag">
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {game.platforms && game.platforms.length > 0 && (
                                <div className="platforms">
                                    <span className="platform-label">Plataformas:</span>
                                    <div className="platform-list">
                                        {game.platforms.slice(0, 3).map((platform) => (
                                            <span key={platform.id} className="platform-tag">
                                                {platform.name}
                                            </span>
                                        ))}
                                        {game.platforms.length > 3 && (
                                            <span className="platform-tag more">
                                                +{game.platforms.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {game.first_release_date && (
                                <p className="release-date">
                                    📅 {formatDate(game.first_release_date)}
                                </p>
                            )}

                            {game.total_rating_count && game.total_rating_count > 0 && (
                                <p className="rating-count">
                                    👥 {game.total_rating_count.toLocaleString()} valoraciones
                                </p>
                            )}

                            <div className="card-actions">
                                <button className="btn-primary">
                                    Ver detalles
                                </button>
                                <button className="btn-secondary">
                                    🛒 Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {games.length === 0 && (
                <div className="no-results">
                    <h2>🔍 No se encontraron juegos</h2>
                    <p>No hay juegos de {genres.find(g => g.id === selectedGenre)?.name}</p>
                    <button 
                        className="btn-primary" 
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