import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModel } from "./entities/user.entity";

@Module({
  imports : [
    TypeOrmModule.forFeature([
      UsersModel
    ])
  ],
  // 다른 모듈에서 현재 이곳의 모듈 중 필요가 있는 것들은
  // exports를 하여야 사용이 가능하다.
  exports : [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
