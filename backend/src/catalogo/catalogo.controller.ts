import { Controller, Get, HttpException, HttpStatus, Param} from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { get } from 'axios';

//son los que reciben los fetch del front pa despues llamar al services
@Controller('catalogo')
export class CatalogoController {
    constructor(private readonly catalogoService: CatalogoService) {}

    @Get()
    async getCatalogo() {
        return this.catalogoService.obtenerCatalogo();
    }

    @Get('top500')
    async getTop500() {
        return this.catalogoService.obtenerTop500();
    }

    @Get('genero/:genero')
    async obtenerPorGenero(@Param('genero') genero: string) {

        try {

            const juegos = await this.catalogoService.obtenerPorCategoria(genero);
            return juegos;
        }catch (error: any){
            console.error("Error en controlador:", error.message)
            throw new HttpException(
                {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: `Error al obtener juegos de género ${genero}`,
                error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('detalles/:id')
    async obtenerDetalles(@Param('id') id: string) {
        try {
            const gameId = parseInt(id, 10);
            if (isNaN(gameId)) {
                throw new HttpException(
                    'ID de juego inválido',
                    HttpStatus.BAD_REQUEST
                );
            }
            
            const detalles = await this.catalogoService.obtenerDetallesJuego(gameId);
            
            if (!detalles) {
                throw new HttpException(
                    'Juego no encontrado',
                    HttpStatus.NOT_FOUND
                );
            }
            
            return detalles;
        } catch (error: any) {
            console.error("Error obteniendo detalles:", error.message);
            throw new HttpException(
                {
                    statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                    message: `Error al obtener detalles del juego`,
                    error: error.message,
                },
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

}
