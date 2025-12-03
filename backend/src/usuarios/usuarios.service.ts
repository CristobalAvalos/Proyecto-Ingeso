import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuarios.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async validarLogin(email: string, pass: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });

    if (usuario && usuario.password === pass) {
      // Retornamos los datos del usuario SIN la contraseña
      const { password, ...result } = usuario;
      return result;
    }
    return null;
  }
}