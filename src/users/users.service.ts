import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(dto: CreateUserDto): Promise<User> {
        // Sprawdź czy email już istnieje
        const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Email już jest zajęty');

        // Zahashuj hasło przed zapisem
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.usersRepository.create({ ...dto, password: hashedPassword });
        return this.usersRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }
}
