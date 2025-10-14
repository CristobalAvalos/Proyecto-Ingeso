import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { CatalogoService } from './catalogo.service';
import { CatalogoController } from './catalogo.controller';
import { Videojuego } from './entities/videojuego.entity'; 

@Module({
    imports: [
        HttpModule,
        //aqui creamos la entidad de la tabla videojuego, para depues poder inyectarla en el servicio.
        //lo hacemos importando la clase Videojuego que creamos en el videojuego.entity.ts y pasandola al for feature
        TypeOrmModule.forFeature([Videojuego]), 
    ],
    controllers: [CatalogoController],
    providers: [CatalogoService],
    
})
export class CatalogoModule {}