import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { UsersModel } from "./entities/user.entity";
import { Repository } from "typeorm";
import { RolesEnum } from "./const/roles.const";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository : Repository<UsersModel>
  ) {}

  async readUsers(id ?: number, nickname ?: string, email ?: string){
    return await this.usersRepository.find();
  };

  async createUser(nickname : string, email : string, password : string, role ?: RolesEnum) : Promise<UsersModel>{
    let user : UsersModel = this.usersRepository.create({
      nickname,
      email,
      password
    });

    if(role) user = {...user, role};
    const newUser : UsersModel = await this.usersRepository.save(user);

    return newUser;
  };

}
