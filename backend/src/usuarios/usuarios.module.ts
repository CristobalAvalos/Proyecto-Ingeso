import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuarios.entity';

@Module({
  imports: [
    // Importante: Aquí registramos la entidad para que el Repository funcione
    TypeOrmModule.forFeature([Usuario]), 
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService] // Exportamos el servicio por si otro módulo lo necesita en el futuro
})
export class UsuariosModule {}