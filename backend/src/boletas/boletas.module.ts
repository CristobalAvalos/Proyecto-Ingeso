import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletasController } from './boletas.controller';
import { BoletasService } from './boletas.service';
import { Boleta } from './entities/boleta.entity';
import { DetalleBoleta } from './entities/detalle-boleta.entity';
import { Videojuego } from '../catalogo/entities/videojuego.entity';
import { Usuario } from '../usuarios/entities/usuarios.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Boleta, DetalleBoleta, Videojuego, Usuario])
    ],
    controllers: [BoletasController],
    providers: [BoletasService],
    exports: [BoletasService],
})
export class BoletasModule {}
