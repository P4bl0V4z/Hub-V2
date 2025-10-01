import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas -> /api
  app.setGlobalPrefix('api');

  // MIDDLEWARE TEMPORAL DE AUTH - agregar antes de CORS
  app.use((req, res, next) => {
    req.user = { id: 1 }; // simulación para pruebas
    next();
  });

  app.enableCors({
    origin: ['http://localhost:8080', 'https://plataforma.beloop.io'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3001, '0.0.0.0');
  console.log(`🚀 API corriendo en http://localhost:${process.env.PORT || 3001}/api`);
}
bootstrap();