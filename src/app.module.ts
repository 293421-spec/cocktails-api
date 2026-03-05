import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CocktailsModule } from './cocktails/cocktails.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Ładuje zmienne z pliku .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Połączenie z bazą danych
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true, // automatycznie wykrywa nasze Entity
        synchronize: true,      // automatycznie tworzy tabele (TYLKO w dev!)
      }),
      inject: [ConfigService],
    }),

    CocktailsModule,
    IngredientsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule { }
