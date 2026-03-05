import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CocktailIngredient } from './cocktail-ingredient.entity';
import { User } from '../../users/entities/user.entity';

@Entity('cocktails')
export class Cocktail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    category: string;

    @Column('text')
    instructions: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Autor koktajlu
    @ManyToOne(() => User, (user) => user.cocktails, { nullable: true })
    author: User;

    // Składniki koktajlu
    @OneToMany(() => CocktailIngredient, (ci) => ci.cocktail, { cascade: true })
    cocktailIngredients: CocktailIngredient[];
}
