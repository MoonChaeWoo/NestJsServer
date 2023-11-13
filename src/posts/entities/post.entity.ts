import { BaseModel } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UsersModel } from "../../users/entities/user.entity";

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