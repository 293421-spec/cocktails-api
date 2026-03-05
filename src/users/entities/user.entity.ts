import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Cocktail } from '../../cocktails/entities/cocktail.entity';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string; // będzie zahashowane!

    @Column({ default: UserRole.USER })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    // Jeden user może mieć wiele koktajli
    @OneToMany(() => Cocktail, (cocktail) => cocktail.author)
    cocktails: Cocktail[];
}
