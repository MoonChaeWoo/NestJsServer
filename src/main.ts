import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// 서버를 시작하는 곳
// yarn start:dev = 개발할 때 실행
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
