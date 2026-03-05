import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { QueryIngredientDto } from './dto/query-ingredient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('ingredients')
@Controller('ingredients')
export class IngredientsController {
    constructor(private readonly service: IngredientsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Dodaj składnik (tylko admin)' })
    create(@Body() dto: CreateIngredientDto) {
        return this.service.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista składników z paginacją i filtrami' })
    findAll(@Query() query: QueryIngredientDto) {
        return this.service.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Pobierz składnik po ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Edytuj składnik (tylko admin)' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIngredientDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Usuń składnik (tylko admin)' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
