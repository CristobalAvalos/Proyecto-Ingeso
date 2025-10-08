import { Controller, Get, HttpException, HttpStatus, Param} from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { get } from 'axios';


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

}
