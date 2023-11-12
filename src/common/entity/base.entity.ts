import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

export abstract class BaseModel{
    @PrimaryGeneratedColumn()
    id : number;

    @CreateDateColumn({
        name : 'create_at'
    })
    createAt : Date;

    @UpdateDateColumn({
        name : 'update_at'
    })
    updateAt : Date;

    @VersionColumn()
    updateCount : number;
}