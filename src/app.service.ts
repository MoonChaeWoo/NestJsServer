import { Injectable } from '@nestjs/common';

// 기능을 구현하는 곳
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
