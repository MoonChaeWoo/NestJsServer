import { BaseModel } from "src/common/entity/base.entity";
import {
  Column,
  Entity,
  OneToMany
} from "typeorm";
import { PostModel } from "../../posts/entities/post.entity";
import { RolesEnum } from "../const/roles.const";

@Entity()
export class UsersModel extends BaseModel{
  @Column({
    unique : true,
    length : 20,
  })
  nickname : string;

  @Column({
    unique : true
  })
  email : string;

  @Column()
  password : string;

  @Column({
    enum : Object.values(RolesEnum),
    type : 'enum',
    default : RolesEnum.USER
  })
  role : RolesEnum;

  @OneToMany(() => PostModel, (posts) => posts.author, {
    eager : true
  })
  posts : PostModel[];

}