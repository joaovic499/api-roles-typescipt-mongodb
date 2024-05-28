import { Entity, Column, PrimaryGeneratedColumn, ObjectIdColumn } from "typeorm"

@Entity()
export class Photo {
    @ObjectIdColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string

    @Column()
    role: 'admin' | 'user';
}