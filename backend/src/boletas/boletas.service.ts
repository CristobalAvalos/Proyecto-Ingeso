import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleta } from './entities/boleta.entity';
import { DetalleBoleta } from './entities/detalle-boleta.entity';
import { Videojuego } from '../catalogo/entities/videojuego.entity';

@Injectable()
export class BoletasService {
    constructor(
        @InjectRepository(Boleta)
        private boletasRepository: Repository<Boleta>,
        
        @InjectRepository(DetalleBoleta)
        private detallesRepository: Repository<DetalleBoleta>,
        
        @InjectRepository(Videojuego)
        private videojuegosRepository: Repository<Videojuego>,
    ) {}

    // Crear una nueva boleta a partir del carrito
    async crearBoleta(usuarioId: number, items: any[]) {
        // Validar que haya items
        if (!items || items.length === 0) {
            throw new Error('El carrito está vacío');
        }

        // Crear la boleta
        const boleta = this.boletasRepository.create({
            usuario_id: usuarioId,
            total: 0,
            estado: 'pendiente',
        });

        const boletaGuardada = await this.boletasRepository.save(boleta);

        // Crear los detalles
        let total = 0;
        const detalles: DetalleBoleta[] = [];

        for (const item of items) {
            const videojuego = await this.videojuegosRepository.findOne({ 
                where: { igdb_id: item.id } 
            });

            const precio = item.price || 0;
            const cantidad = item.quantity || 1;
            const subtotal = precio * cantidad;

            const detalle = new DetalleBoleta();
            detalle.boleta = boletaGuardada;
            detalle.videojuego_id = videojuego?.id || null;
            detalle.nombre_producto = item.name;
            detalle.precio_unitario = precio;
            detalle.cantidad = cantidad;
            detalle.subtotal = subtotal;

            detalles.push(detalle);
            total += subtotal;
        }

        await this.detallesRepository.save(detalles);

        // Actualizar el total de la boleta
        boletaGuardada.total = total;
        await this.boletasRepository.save(boletaGuardada);

        // Retornar la boleta completa con detalles
        return this.obtenerBoletaPorId(boletaGuardada.id);
    }

    // Obtener una boleta por ID
    async obtenerBoletaPorId(boletaId: number) {
        const boleta = await this.boletasRepository.findOne({
            where: { id: boletaId },
            relations: ['detalles', 'usuario'],
        });

        if (!boleta) {
            throw new NotFoundException(`Boleta con ID ${boletaId} no encontrada`);
        }

        return boleta;
    }

    // Obtener todas las boletas de un usuario
    async obtenerBoletasPorUsuario(usuarioId: number) {
        return this.boletasRepository.find({
            where: { usuario_id: usuarioId },
            relations: ['detalles'],
            order: { fecha_creacion: 'DESC' },
        });
    }

    // Marcar boleta como pagada
    async marcarComoPagada(boletaId: number, metodoPago: string) {
        const boleta = await this.obtenerBoletaPorId(boletaId);
        
        boleta.estado = 'pagada';
        boleta.fecha_pago = new Date();
        boleta.metodo_pago = metodoPago;

        return this.boletasRepository.save(boleta);
    }

    // Cancelar boleta
    async cancelarBoleta(boletaId: number) {
        const boleta = await this.obtenerBoletaPorId(boletaId);
        
        boleta.estado = 'cancelada';
        return this.boletasRepository.save(boleta);
    }

    // Obtener todas las boletas (para admin)
    async obtenerTodasLasBoletas() {
        return this.boletasRepository.find({
            relations: ['detalles', 'usuario'],
            order: { fecha_creacion: 'DESC' },
        });
    }

    // Obtener estadísticas para el dashboard de admin
    async obtenerEstadisticas() {
        const boletas = await this.boletasRepository.find({
            relations: ['detalles'],
            where: { estado: 'pagada' }
        });

        // Total de ventas
        const totalVentas = boletas.reduce((sum, boleta) => sum + Number(boleta.total), 0);

        // Ventas por juego
        const ventasPorJuego = {};
        boletas.forEach(boleta => {
            boleta.detalles.forEach(detalle => {
                const nombre = detalle.nombre_producto;
                if (!ventasPorJuego[nombre]) {
                    ventasPorJuego[nombre] = {
                        nombre,
                        cantidad: 0,
                        ingresos: 0
                    };
                }
                ventasPorJuego[nombre].cantidad += detalle.cantidad;
                ventasPorJuego[nombre].ingresos += Number(detalle.subtotal);
            });
        });

        // Ventas por mes (últimos 6 meses)
        const ventasPorMes = {};
        const hoy = new Date();
        for (let i = 5; i >= 0; i--) {
            const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
            const mes = fecha.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
            ventasPorMes[mes] = 0;
        }

        boletas.forEach(boleta => {
            const fecha = new Date(boleta.fecha_creacion);
            const mes = fecha.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
            if (ventasPorMes[mes] !== undefined) {
                ventasPorMes[mes] += Number(boleta.total);
            }
        });

        // Top 5 juegos más vendidos
        const topJuegos = Object.values(ventasPorJuego)
            .sort((a: any, b: any) => b.cantidad - a.cantidad)
            .slice(0, 5);

        return {
            totalVentas,
            cantidadBoletas: boletas.length,
            ventasPorMes: Object.entries(ventasPorMes).map(([mes, total]) => ({ mes, total })),
            topJuegos
        };
    }
}
