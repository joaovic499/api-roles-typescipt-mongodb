import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm"

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    username: string;

    @Column()
    password: string

    @Column()
    role: 'admin' | 'user';
}