import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cocktail } from './entities/cocktail.entity';
import { CocktailIngredient } from './entities/cocktail-ingredient.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { QueryCocktailDto } from './dto/query-cocktail.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class CocktailsService {
    constructor(
        @InjectRepository(Cocktail)
        private cocktailRepo: Repository<Cocktail>,
        @InjectRepository(CocktailIngredient)
        private ciRepo: Repository<CocktailIngredient>,
        @InjectRepository(Ingredient)
        private ingredientRepo: Repository<Ingredient>,
    ) { }

    async create(dto: CreateCocktailDto, userId: number): Promise<Cocktail> {
        const cocktail = this.cocktailRepo.create({
            name: dto.name,
            category: dto.category,
            instructions: dto.instructions,
            author: { id: userId },
        });
        const saved = await this.cocktailRepo.save(cocktail);

        // Dodaj składniki
        for (const item of dto.ingredients) {
            const ingredient = await this.ingredientRepo.findOne({ where: { id: item.ingredientId } });
            if (!ingredient) throw new NotFoundException(`Składnik #${item.ingredientId} nie istnieje`);
            const ci = this.ciRepo.create({ cocktail: saved, ingredient, amount: item.amount });
            await this.ciRepo.save(ci);
        }

        return this.findOne(saved.id);
    }

    async findAll(query: QueryCocktailDto) {
        const { page = 1, limit = 10, search, category, ingredientId, nonAlcoholic, sortBy = 'createdAt', sortOrder = 'DESC', authorId } = query;

        const qb = this.cocktailRepo.createQueryBuilder('cocktail')
            .leftJoinAndSelect('cocktail.author', 'author')
            .leftJoinAndSelect('cocktail.cocktailIngredients', 'ci')
            .leftJoinAndSelect('ci.ingredient', 'ingredient');

        if (search) {
            qb.andWhere('cocktail.name ILIKE :search', { search: `%${search}%` });
        }
        if (category) {
            qb.andWhere('cocktail.category = :category', { category });
        }
        if (authorId) {
            qb.andWhere('author.id = :authorId', { authorId });
        }
        if (ingredientId) {
            qb.andWhere('ingredient.id = :ingredientId', { ingredientId });
        }
        if (nonAlcoholic) {
            // Koktajle bez żadnego alkoholowego składnika
            qb.andWhere('cocktail.id NOT IN (SELECT ci2.cocktailId FROM cocktail_ingredients ci2 LEFT JOIN ingredients i2 ON ci2.ingredientId = i2.id WHERE i2.isAlcoholic = true)');
        }

        const allowedSort = ['name', 'createdAt'];
        const safeSort = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
        qb.orderBy(`cocktail.${safeSort}`, sortOrder);

        const total = await qb.getCount();
        const data = await qb.skip((page - 1) * limit).take(limit).getMany();

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async findOne(id: number): Promise<Cocktail> {
        const cocktail = await this.cocktailRepo.findOne({
            where: { id },
            relations: ['author', 'cocktailIngredients', 'cocktailIngredients.ingredient'],
        });
        if (!cocktail) throw new NotFoundException(`Koktajl #${id} nie istnieje`);
        return cocktail;
    }

    async update(id: number, dto: UpdateCocktailDto, user: any): Promise<Cocktail> {
        const cocktail = await this.findOne(id);

        // Tylko autor lub admin może edytować
        if (cocktail.author?.id !== user.id && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Nie masz uprawnień do edycji tego koktajlu');
        }

        if (dto.name) cocktail.name = dto.name;
        if (dto.category) cocktail.category = dto.category;
        if (dto.instructions) cocktail.instructions = dto.instructions;

        await this.cocktailRepo.save(cocktail);

        // Zaktualizuj składniki jeśli podano
        if (dto.ingredients) {
            await this.ciRepo.delete({ cocktail: { id } });
            for (const item of dto.ingredients) {
                const ingredient = await this.ingredientRepo.findOne({ where: { id: item.ingredientId } });
                if (!ingredient) throw new NotFoundException(`Składnik #${item.ingredientId} nie istnieje`);
                const ci = this.ciRepo.create({ cocktail, ingredient, amount: item.amount });
                await this.ciRepo.save(ci);
            }
        }

        return this.findOne(id);
    }

    async remove(id: number, user: any): Promise<void> {
        const cocktail = await this.findOne(id);
        if (cocktail.author?.id !== user.id && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Nie masz uprawnień do usunięcia tego koktajlu');
        }
        await this.cocktailRepo.remove(cocktail);
    }
}

