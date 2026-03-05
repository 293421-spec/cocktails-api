import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CocktailIngredient } from '../../cocktails/entities/cocktail-ingredient.entity';

@Entity('ingredients')
export class Ingredient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: false })
    isAlcoholic: boolean;

    @Column({ nullable: true })
    imageUrl: string;

    // Jeden składnik może być w wielu koktajlach
    @OneToMany(() => CocktailIngredient, (ci) => ci.ingredient)
    cocktailIngredients: CocktailIngredient[];
}

