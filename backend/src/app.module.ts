import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController, HolaMundoController } from './app.controller';
import { AppService, HolaMundoService } from './app.service';
import { CatalogoModule } from './catalogoModule/catalogo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CatalogoModule
  ],
  controllers: [AppController, HolaMundoController],
  providers: [AppService, HolaMundoService],
})
export class AppModule {}
