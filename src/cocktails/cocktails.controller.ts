import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CocktailsService } from './cocktails.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { QueryCocktailDto } from './dto/query-cocktail.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('cocktails')
@Controller('cocktails')
export class CocktailsController {
    constructor(private readonly service: CocktailsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Dodaj koktajl (wymagane logowanie)' })
    create(@Body() dto: CreateCocktailDto, @CurrentUser() user: any) {
        return this.service.create(dto, user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Lista koktajli z paginacją i filtrami' })
    findAll(@Query() query: QueryCocktailDto) {
        return this.service.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Pobierz koktajl po ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Edytuj koktajl (autor lub admin)' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCocktailDto, @CurrentUser() user: any) {
        return this.service.update(id, dto, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Usuń koktajl (autor lub admin)' })
    remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
        return this.service.remove(id, user);
    }
}
