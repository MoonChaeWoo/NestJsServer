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

@Entity()
export class UsersModel{
  @PrimaryGeneratedColumn()
  id : number;

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

  @CreateDateColumn({
    type : Date,
    name : 'create_at'
  })
  createAt : Date;

  @UpdateDateColumn({
    type : Date,
    name : 'update_at'
  })
  updateAt : Date;

  @VersionColumn()
  updateCount : number;

  @OneToMany(() => PostModel, (posts) => posts.author, {
    eager : true
  })
  posts : PostModel[];

}