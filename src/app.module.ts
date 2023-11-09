import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './posts/entities/post.entity';
import { UsersModule } from './users/users.module';
import { UsersModel } from "./users/entities/user.entity";
import { AuthModule } from './auth/auth.module';

// 의존성을 관리하는 곳
@Module({
  imports: [TypeOrmModule.forRoot({
              type: 'postgres',
              host: 'localhost',
              port: 5435,
              username: 'postgres',
              password: 'postgres',
              database: 'nestjs_server',
              entities: [
                PostModel, // entities의 class를 주입
                UsersModel
              ], // 생성할 모델들이 들어가는 곳
              synchronize: true, // 개발 시 true, 배포 시 false
            }),
            AuthModule,
            PostsModule,
            UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
