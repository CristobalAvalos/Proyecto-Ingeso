import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'; // 👈 Importar TypeORM
import { AppController, HolaMundoController } from './app.controller';
import { AppService, HolaMundoService } from './app.service';
import { CatalogoModule } from './catalogoModule/catalogo.module';

@Module({
  imports: [
    // 1. Módulo de Configuración (Ya está correcto)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Módulo de Base de Datos (Nuevo)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // 👈 Usamos la URL completa de Neon
      autoLoadEntities: true, // Carga automáticamente las entidades (bueno para empezar)
      synchronize: true,     // Sincroniza el esquema automáticamente (¡Solo para desarrollo!)
      ssl: {
        rejectUnauthorized: false, // Requerido a veces para conexiones Cloud (Neon)
      },
    }),

    // 3. Tus Módulos de Negocio
    CatalogoModule,
  ],
  controllers: [AppController, HolaMundoController],
  providers: [AppService, HolaMundoService],
})
export class AppModule {}