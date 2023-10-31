import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // 아무것도 넣지 않는다면 /와 같은 의미
  getHello(){
    return 'Hello World';
  }
}
