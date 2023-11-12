import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersModel } from "../../users/entities/user.entity";
import { BaseModel } from "src/common/entity/base.entity";

@Entity()
export class PostModel extends BaseModel{
    @ManyToOne(() => UsersModel, (author) => author.posts, {
        nullable : false
    })
    @JoinColumn({name : 'author_id'})
    author : UsersModel;

    @Column()
    title : string;

    @Column()
    content : string;

    @Column()
    likeCount : number;

    @Column()
    commentCount : number;
}; 