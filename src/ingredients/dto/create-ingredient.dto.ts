
import { IsString, IsBoolean, IsOptional, IsUrl, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIngredientDto {
    @ApiProperty({ example: 'Wódka' })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiPropertyOptional({ example: 'Klasyczny destylat zbożowy' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    isAlcoholic: boolean;

    @ApiPropertyOptional({ example: 'https://example.com/vodka.jpg' })
    @IsUrl()
    @IsOptional()
    imageUrl?: string;
}

