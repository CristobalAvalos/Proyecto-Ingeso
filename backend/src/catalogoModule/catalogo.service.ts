import { Injectable} from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CatalogoService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    private getHeaders() {
        return {
            'Accept': 'application/json',
            'Client-ID': this.configService.get<string>('IGDB_CLIENT_ID'),
            'Authorization': `Bearer ${this.configService.get<string>('IGDB_ACCESS_TOKEN')}`,
        };
    }

    async obtenerCatalogo() {

        try {

            const yearsAcces = Math.floor(new Date().setFullYear(new Date().getFullYear() - 15)/ 1000);
            const response = await firstValueFrom(
                this.httpService.post("https://api.igdb.com/v4/games",
                    `fields name, game_type, genres.name, platforms.name, total_rating, total_rating_count, screenshots.url, artworks.url, cover.url, first_release_date, aggregated_rating, aggregated_rating_count;
                    where category = (0,8,9,10)
                    & cover != null
                    & platforms = [130];
                    limit 500;`,
                    {
                        headers: this.getHeaders(),
                        
                    }
                )
            );

            const juegosConImagenes = response.data.map(juego => {

                return {
                    ...juego,

                    cover: juego.cover ? {
                        ...juego.cover,
                        url: `https:${juego.cover.url.replace('t_thumb', 't_cover_big')}`
                    }: null,

                    screenshots: juego.screenshots?.map(screenshot => ({
                        ...screenshot,
                        url: `https:${screenshot.url.replace('t_thumb', 't_screenshot_big')}`
                    })) || [],

                    artworks: juego.artworks?.map(artwork => ({
                        ...artwork,
                        url: `https:${artwork.url.replace('t_thumb', 't_1080p')}`
                    })) || []
                };
            });


            return juegosConImagenes;
        }catch (error) {
            console.error("Error obteniendo juegos y catalogo")
            throw new Error(`Error: ${error.message}`);
        }
    }

    async obtenerTop500() {
        try {
            console.log('=== Iniciando Top 500 Más Populares con Popularity Primitives ===');
            
            const popularityResponse = await firstValueFrom(
                this.httpService.post("https://api.igdb.com/v4/popularity_primitives",
                    `fields game_id, value, popularity_type, external_popularity_source;
                    sort value desc;
                    limit 500;`,
                    {
                        headers: this.getHeaders(),
                    }
                )
            );

            console.log(`Popularity primitives obtenidos: ${popularityResponse.data.length}`);

            // Paso 2: Agrupar por game_id y sumar valores de popularidad
            const popularityMap = new Map();
            popularityResponse.data.forEach(primitive => {
                const currentValue = popularityMap.get(primitive.game_id) || 0;
                popularityMap.set(primitive.game_id, currentValue + (primitive.value || 0));
            });

            // Ordenar juegos por popularidad total y tomar top 500 game IDs
            const topGameIds = Array.from(popularityMap.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 500)
                .map(entry => entry[0]);

            console.log(`Top 500 game IDs por popularidad: ${topGameIds.length}`);

            // Paso 3: Obtener los datos completos de esos juegos específicos (query simplificada)
            const gamesResponse = await firstValueFrom(
                this.httpService.post("https://api.igdb.com/v4/games",
                    `fields name, genres.name, platforms.name, total_rating, total_rating_count, cover.url, first_release_date, aggregated_rating, aggregated_rating_count;
                    where id = (${topGameIds.join(',')});
                    limit 500;`,
                    {
                        headers: this.getHeaders(),
                    }
                )
            );

            console.log(`Juegos encontrados: ${gamesResponse.data.length}`);

            // Paso 4: Agregar el popularityScore y procesar imágenes
            const juegosConScore = gamesResponse.data.map(juego => {
                const popularityScore = popularityMap.get(juego.id) || 0;

                return {
                    ...juego,
                    popularityScore,
                    cover: juego.cover ? {
                        ...juego.cover,
                        url: `https:${juego.cover.url.replace('t_thumb', 't_cover_big')}`
                    }: null,
                };
            });

            // Paso 5: Ordenar por popularityScore (mantener el orden del ranking)
            const top500 = juegosConScore
                .sort((a, b) => b.popularityScore - a.popularityScore);

            console.log(`✅ Top 500 final: ${top500.length} juegos`);
            console.log(`🏆 Top 5:`, top500.slice(0, 5).map((j, idx) => ({
                rank: idx + 1,
                name: j.name,
                popularityScore: j.popularityScore.toFixed(6),
                platforms: j.platforms?.slice(0, 3).map(p => p.name)
            })));
            
            return top500;
        } catch (error) {
            console.error("❌ Error obteniendo Top 100:", error.message);
            console.error("Error detallado:", error.response?.data || error);
            throw new Error(`Error en Top 100: ${error.message}`);
        }
    }

    async obtenerPorCategoria(nombreGenero) {

        const todosLosJuegos = await this.obtenerTop500();

            if (!nombreGenero || nombreGenero === 'todos') {
                console.log('✅ Retornando todos los juegos');
                return todosLosJuegos;
            }
            
            const datosFiltrados = todosLosJuegos.filter(juego => {
                const tieneGenero = juego.genres?.some(genre => 
                    genre.name.toLowerCase().includes(nombreGenero.toLowerCase())
                );
                return tieneGenero;
            });
        return datosFiltrados;
        
    }
}
