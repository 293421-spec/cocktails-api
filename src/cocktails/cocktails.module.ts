import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cocktail } from './entities/cocktail.entity';
import { CocktailIngredient } from './entities/cocktail-ingredient.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { CocktailsService } from './cocktails.service';
import { CocktailsController } from './cocktails.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Cocktail, CocktailIngredient, Ingredient])],
    providers: [CocktailsService],
    controllers: [CocktailsController],
})
export class CocktailsModule { }
