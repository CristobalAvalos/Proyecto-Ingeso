import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CatalogoService } from './catalogo.service';
import { CatalogoController } from './catalogo.controller';


@Module({

    imports: [HttpModule],
    controllers: [CatalogoController],
    providers: [CatalogoService],
})

export  class CatalogoModule {}
