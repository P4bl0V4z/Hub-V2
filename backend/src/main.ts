import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas -> /api
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://localhost:8080',      // frontend local
      'https://plataforma.beloop.io' // producción
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
