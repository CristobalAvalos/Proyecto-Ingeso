import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController, HolaMundoController } from './app.controller';
import { AppService, HolaMundoService } from './app.service';
import { CatalogoModule } from './catalogo/catalogo.module';
import { BoletasModule } from './boletas/boletas.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    CatalogoModule,
    BoletasModule,
    UsuariosModule
  ],
  controllers: [AppController, HolaMundoController],
  providers: [AppService, HolaMundoService],
})
export class AppModule {}
