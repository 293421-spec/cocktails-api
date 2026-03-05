import { IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCocktailDto {
    @ApiPropertyOptional() @IsInt() @Min(1) @Type(() => Number) @IsOptional()
    page?: number = 1;

    @ApiPropertyOptional() @IsInt() @Min(1) @Type(() => Number) @IsOptional()
    limit?: number = 10;

    @ApiPropertyOptional({ example: 'Mojito' })
    @IsString() @IsOptional()
    search?: string;

    @ApiPropertyOptional({ example: 'Klasyczny' })
    @IsString() @IsOptional()
    category?: string;

    @ApiPropertyOptional({ description: 'Filtruj po ID składnika' })
    @IsInt() @Type(() => Number) @IsOptional()
    ingredientId?: number;

    @ApiPropertyOptional({ description: 'Tylko bezalkoholowe?' })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean() @IsOptional()
    nonAlcoholic?: boolean;

    @ApiPropertyOptional({ enum: ['name', 'createdAt'] })
    @IsString() @IsOptional()
    sortBy?: string = 'createdAt';

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
    @IsString() @IsOptional()
    sortOrder?: 'ASC' | 'DESC' = 'DESC';

    @ApiPropertyOptional({ description: 'Filtruj po ID autora' })
    @IsInt() @Type(() => Number) @IsOptional()
    authorId?: number;
}

