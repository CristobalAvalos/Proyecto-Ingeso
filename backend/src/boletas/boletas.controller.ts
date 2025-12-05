import { Controller, Get, Post, Body, Param, Patch, HttpException, HttpStatus } from '@nestjs/common';
import { BoletasService } from './boletas.service';

@Controller('boletas')
export class BoletasController {
    constructor(private readonly boletasService: BoletasService) {}

    // Obtener estadísticas para admin
    @Get('estadisticas')
    async obtenerEstadisticas() {
        try {
            return await this.boletasService.obtenerEstadisticas();
        } catch (error) {
            throw new HttpException(
                'Error al obtener estadísticas',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Crear una nueva boleta
    @Post()
    async crearBoleta(@Body() createBoletaDto: { usuario_id: number; items: any[] }) {
        try {
            return await this.boletasService.crearBoleta(
                createBoletaDto.usuario_id,
                createBoletaDto.items
            );
        } catch (error) {
            throw new HttpException(
                error.message || 'Error al crear la boleta',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    // Obtener una boleta por ID
    @Get(':id')
    async obtenerBoleta(@Param('id') id: string) {
        try {
            return await this.boletasService.obtenerBoletaPorId(parseInt(id));
        } catch (error) {
            throw new HttpException(
                error.message || 'Boleta no encontrada',
                HttpStatus.NOT_FOUND
            );
        }
    }

    // Obtener boletas de un usuario
    @Get('usuario/:usuarioId')
    async obtenerBoletasUsuario(@Param('usuarioId') usuarioId: string) {
        try {
            return await this.boletasService.obtenerBoletasPorUsuario(parseInt(usuarioId));
        } catch (error) {
            throw new HttpException(
                error.message || 'Error al obtener boletas',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Marcar como pagada
    @Patch(':id/pagar')
    async pagarBoleta(
        @Param('id') id: string,
        @Body() pagoDto: { metodo_pago: string }
    ) {
        try {
            return await this.boletasService.marcarComoPagada(
                parseInt(id),
                pagoDto.metodo_pago
            );
        } catch (error) {
            throw new HttpException(
                error.message || 'Error al procesar el pago',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    // Cancelar boleta
    @Patch(':id/cancelar')
    async cancelarBoleta(@Param('id') id: string) {
        try {
            return await this.boletasService.cancelarBoleta(parseInt(id));
        } catch (error) {
            throw new HttpException(
                error.message || 'Error al cancelar la boleta',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    // Obtener todas las boletas (admin)
    @Get()
    async obtenerTodasLasBoletas() {
        try {
            return await this.boletasService.obtenerTodasLasBoletas();
        } catch (error) {
            throw new HttpException(
                'Error al obtener las boletas',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
