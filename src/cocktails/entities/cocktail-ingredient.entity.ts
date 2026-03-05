import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Cocktail } from './cocktail.entity';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';

// Tabela łącząca koktajl ze składnikiem + ilość
@Entity('cocktail_ingredients')
export class CocktailIngredient {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cocktail, (cocktail) => cocktail.cocktailIngredients, { onDelete: 'CASCADE' })
    cocktail: Cocktail;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient.cocktailIngredients)
    ingredient: Ingredient;

    @Column()
    amount: string; // np. "50ml", "2 łyżki"
}

