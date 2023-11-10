import { BadRequestException, Injectable } from '@nestjs/common';
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

  async createUser(user : Pick<UsersModel, 'nickname' | 'email' | 'password'>) : Promise<UsersModel>{

    // 1) nickname 중복이 없는지 확인
    // 2) exist() -> 만약 조건에 해당되는 값이 있으면 true 반환
    const nicknameExists = await this.usersRepository.exist({
      where : {
        nickname : user.nickname
      }
    });

    if(nicknameExists) throw new BadRequestException('이미 존재하는 닉네임 입니다.');

    const emailExists = await this.usersRepository.exist({
      where : {
        email : user.email
      }
    })

    if(emailExists) throw new BadRequestException('이미 존재하는 이메일 입니다.');

    const userObject : UsersModel = this.usersRepository.create(user);
    const newUser : UsersModel = await this.usersRepository.save(userObject);

    return newUser;
  };

  async getUserByEmail(email : string){
    return this.usersRepository.findOne({
      where : {
        email
      }
    });
  };

}
