import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(dto: CreateUserDto) {
        const user = await this.usersService.create(dto);
        // Nie zwracaj hasła!
        const { password, ...result } = user;
        return result;
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Nieprawidłowe dane logowania');

        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch) throw new UnauthorizedException('Nieprawidłowe dane logowania');

        // Tworzymy JWT token z danymi użytkownika
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email, role: user.role },
        };
    }
}
