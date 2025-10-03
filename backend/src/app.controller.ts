import { Controller, Get } from '@nestjs/common';
import { AppService, HolaMundoService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

@Controller('holamundo')
export class HolaMundoController {
  constructor(private readonly holaMundoService: HolaMundoService) {}

  @Get('holamundo') 
  getHolaMundo(): any[] {
    return this.holaMundoService.getHolaMundo();
  }
}

