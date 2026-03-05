import { IsString, IsArray, ValidateNested, IsInt, MinLength, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class IngredientItemDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    ingredientId: number;

    @ApiProperty({ example: '50ml' })
    @IsString()
    amount: string;
}

export class CreateCocktailDto {
    @ApiProperty({ example: 'Mojito' })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty({ example: 'Klasyczny' })
    @IsString()
    category: string;

    @ApiProperty({ example: 'Wymieszaj rum z miętą i limonką...' })
    @IsString()
    @MinLength(10)
    instructions: string;

    @ApiProperty({ type: [IngredientItemDto] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => IngredientItemDto)
    ingredients: IngredientItemDto[];
}

