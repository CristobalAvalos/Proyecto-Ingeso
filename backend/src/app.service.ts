import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class HolaMundoService {
  getHolaMundo(): any[] {
    return [
      { id: 1, name: 'yuliano perdialbb', email: 'usuario1@example.com' },
      { id: 2, name: 'Usuario 2', email: 'usuario2@example.com' },
      { id: 3, name: 'Usuario 3', email: 'usuario3@example.com' },
    ]
  }
}
