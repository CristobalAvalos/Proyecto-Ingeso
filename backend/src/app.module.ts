import { Module } from '@nestjs/common';
import { AppController, HolaMundoController } from './app.controller';
import { AppService, HolaMundoService } from './app.service';
import { CatalogoModule } from './catalogoModule/catalogo.module';

@Module({
  imports: [ CatalogoModule],
  controllers: [AppController, HolaMundoController],
  providers: [AppService, HolaMundoService],
})
export class AppModule {}
