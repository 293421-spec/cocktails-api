import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard który wymaga zalogowania (JWT tokena)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }