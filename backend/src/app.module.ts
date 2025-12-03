import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController, HolaMundoController } from './app.controller';
import { AppService, HolaMundoService } from './app.service';
import { CatalogoModule } from './catalogo/catalogo.module';
import { UsuariosModule } from './usuarios/usuarios.module'; // 👈 1. Importar el archivo

@Module({
  imports: [
    // 1. Configuración
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Base de Datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    // 3. Módulos de Negocio
    CatalogoModule,
    UsuariosModule, // 👈 2. Agregar al array de imports
  ],
  controllers: [AppController, HolaMundoController],
  providers: [AppService, HolaMundoService],
})
export class AppModule {}