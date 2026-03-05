import { IsOptional, IsBoolean, IsString, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryIngredientDto {
    @ApiPropertyOptional({ example: 1 })
    @IsInt() @Min(1) @Type(() => Number) @IsOptional()
    page?: number = 1;

    @ApiPropertyOptional({ example: 10 })
    @IsInt() @Min(1) @Type(() => Number) @IsOptional()
    limit?: number = 10;

    @ApiPropertyOptional({ example: 'Wódka' })
    @IsString() @IsOptional()
    search?: string;

    @ApiPropertyOptional({ example: true })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean() @IsOptional()
    isAlcoholic?: boolean;
}
