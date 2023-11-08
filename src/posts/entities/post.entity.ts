import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersModel } from "../../users/entities/user.entity";

@Entity()
export class PostModel{
    @PrimaryGeneratedColumn() // 자동으로 id생성
    id : number;

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