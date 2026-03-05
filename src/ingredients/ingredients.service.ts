import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { QueryIngredientDto } from './dto/query-ingredient.dto';

@Injectable()
export class IngredientsService {
    constructor(
        @InjectRepository(Ingredient)
        private repo: Repository<Ingredient>,
    ) { }

    async create(dto: CreateIngredientDto): Promise<Ingredient> {
        const ingredient = this.repo.create(dto);
        return this.repo.save(ingredient);
    }

    async findAll(query: QueryIngredientDto) {
        const { page = 1, limit = 10, search, isAlcoholic } = query;

        const qb = this.repo.createQueryBuilder('ingredient');

        if (search) {
            qb.andWhere('ingredient.name ILIKE :search', { search: `%${search}%` });
        }
        if (isAlcoholic !== undefined) {
            qb.andWhere('ingredient.isAlcoholic = :isAlcoholic', { isAlcoholic });
        }

        const total = await qb.getCount();
        const data = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async findOne(id: number): Promise<Ingredient> {
        const ingredient = await this.repo.findOne({ where: { id } });
        if (!ingredient) throw new NotFoundException(`Składnik #${id} nie istnieje`);
        return ingredient;
    }

    async update(id: number, dto: UpdateIngredientDto): Promise<Ingredient> {
        const ingredient = await this.findOne(id);
        Object.assign(ingredient, dto);
        return this.repo.save(ingredient);
    }

    async remove(id: number): Promise<void> {
        const ingredient = await this.findOne(id);
        await this.repo.remove(ingredient);
    }
}
