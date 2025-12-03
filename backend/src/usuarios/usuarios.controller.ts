import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
// 👇 CAMBIO AQUÍ: Agrega "type" después de import
import type { Response } from 'express'; 

@Controller('auth')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('login')
  async login(@Body() body: any, @Res() res: Response) {
    const user = await this.usuariosService.validarLogin(body.email, body.password);
    
    if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Credenciales incorrectas' });
    }

    return res.status(HttpStatus.OK).json({
        message: 'Login exitoso',
        user: user
    });
  }
}