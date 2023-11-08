import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UsersService } from './users.service';
import { UsersModel } from "./entities/user.entity";
import { RolesEnum } from "./const/roles.const";

type userModelParam = Partial<UsersModel>;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('searchAll')
  readUsers(){
    return this.usersService.readUsers();
  };

  @Post('create')
  createUser(@Body('nickname') nickname : string,
             @Body('email') email : string,
             @Body('password') password : string,
             @Body('role') role ?: RolesEnum){
    return this.usersService.createUser(nickname, email, password, role);
  }
}
