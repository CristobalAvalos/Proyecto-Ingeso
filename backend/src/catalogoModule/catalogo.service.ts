import { Injectable, OnModuleInit } from '@nestjs/common' 
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

//imports para la base
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Videojuego } from './entities/videojuego.entity'; 
//


@Injectable()
export class CatalogoService implements OnModuleInit { // Implementa OnModuleInit
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        //aqui inyectamos la entidad que creamos para poder usarla en el servicio
        @InjectRepository(Videojuego) 
        private videojuegosRepository: Repository<Videojuego>, 
    ) {}
    
    //esta funcion es pa llenar la base a penas inicie la wea
    async onModuleInit() {
        console.log('⏳ Módulo del Catálogo inicializado. Iniciando precarga de datos de IGDB...');
        
        // Llamar a la función que obtiene y guarda los juegos
        await this.fetchAndSaveCatalogo();
        
        // Opcional: Mostrar el total de juegos después de la precarga
        try {
            const totalJuegos = await this.videojuegosRepository.count();
            console.log(`📊 PRECARGA FINALIZADA. Total de videojuegos en la DB: ${totalJuegos}`);
        } catch (error) {
            console.error('❌ Error al contar juegos después de la precarga:', error.message);
        }
    }


    private getHeaders() {
        return {
            'Accept': 'application/json',
            'Client-ID': this.configService.get<string>('IGDB_CLIENT_ID'),
            'Authorization': `Bearer ${this.configService.get<string>('IGDB_ACCESS_TOKEN')}`,
        };
    }

    // Método que obtiene los datos de IGDB y los guarda en la DB.
    async fetchAndSaveCatalogo() {
        try {
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

            // PASO CLAVE: INSERCIÓN MASIVA EN LA DB
            if (response.data && response.data.length > 0) {
                await this.saveGamesToDatabase(response.data);
                console.log(`✅ ${response.data.length} juegos de IGDB guardados/actualizados en la base de datos.`);
            }

            return response.data; // Retorna los datos originales de IGDB
        } catch (error) {
            console.error("❌ Error durante la PRECARGA de juegos desde IGDB:");
            console.error("Error detallado:", error.response?.data || error.message); 
            return []; // Devolvemos un array vacío si la precarga falla.
        }
    }


    // Método de utilidad para guardar datos en la DB (ACTUALIZADO para mapear campos requeridos)
    async saveGamesToDatabase(juegosApi: any[]): Promise<Videojuego[]> {
        
        const entities = juegosApi.map(juego => ({
            nombre: juego.name,
            igdb_id: juego.id, 
            descripcion: 'Descripción pendiente de IGDB', // Valor por defecto
            precio: 0.00, // Valor por defecto
        }));

        console.log(`Guardando/Actualizando ${entities.length} juegos en la base de datos...`);
        // Usamos save() para manejar inserción y actualización (si la igdb_id es un índice único)
        return this.videojuegosRepository.save(entities as any); 
    }
    
    // Método de utilidad para leer todos los datos de la DB (para tu futura implementación)
    async findAllFromDatabase(): Promise<Videojuego[]> {
        return this.videojuegosRepository.find();
    }


    async obtenerCatalogo() {
        // Opción 1: Devolver los datos desde la DB (Si la precarga ya se ejecutó, esto es más rápido)
        return this.findAllFromDatabase(); 

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