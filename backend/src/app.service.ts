import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class HolaMundoService {
  getHolaMundo(): { message: string } {
    return { message: 'Chino chupalo kdjakjdkasjdk y AAAAaaa asadfadsfa' };
  }
}
