import { Module } from '@nestjs/common';
import { AppController, HolaMundoController } from './app.controller';
import { AppService, HolaMundoService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, HolaMundoController],
  providers: [AppService, HolaMundoService],
})
export class AppModule {}
