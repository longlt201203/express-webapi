import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class UserModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;
}