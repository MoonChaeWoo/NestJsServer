import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostModel } from "../../posts/entities/post.entity";
import { BaseModel } from "src/common/entity/base.entity";

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