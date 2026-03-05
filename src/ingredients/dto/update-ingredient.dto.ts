import { PartialType } from '@nestjs/swagger';
import { CreateIngredientDto } from './create-ingredient.dto';

// PartialType robi wszystkie pola opcjonalnymi – idealne do PATCH/PUT
export class UpdateIngredientDto extends PartialType(CreateIngredientDto) { }
