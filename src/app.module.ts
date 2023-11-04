import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './posts/entities/post.entities';

// 의존성을 관리하는 곳
@Module({
  imports: [PostsModule,
            TypeOrmModule.forRoot({
              type: 'postgres',
              host: 'localhost',
              port: 31115,
              username: 'postgres',
              password: '1q2w3e4r!',
              database: 'NestJs_DataBase',
              entities: [
                PostModel, // entities의 class를 주입
              ], // 생성할 모델들이 들어가는 곳
              synchronize: true, // 개발 시 true, 배포 시 false
            })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
