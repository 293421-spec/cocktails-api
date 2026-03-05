import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Globalna walidacja – sprawdza każdy request przez DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger – dokumentacja dostępna pod /api
  const config = new DocumentBuilder()
    .setTitle('Cocktails API')
    .setDescription('REST API do zarządzania koktajlami')
    .setVersion('1.0')
    .addBearerAuth() // dodaje możliwość wpisania JWT tokena w Swagger UI
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('🍹 API działa na http://localhost:3000');
  console.log('📖 Swagger: http://localhost:3000/api');
}
bootstrap();

