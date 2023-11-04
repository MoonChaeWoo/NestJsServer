import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PostModel{
    @PrimaryGeneratedColumn() // 자동으로 id생성
    id : number;

    @Column()
    author : string;

    @Column()
    title : string;

    @Column()
    content : string;

    @Column()
    likeCount : number;

    @Column()
    commentCount : number;
}; 