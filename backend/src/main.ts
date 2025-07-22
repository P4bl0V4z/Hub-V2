import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Usa FRONTEND_URL desde variables de entorno
  const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:8080';

  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3001;
  await app.setGlobalPrefix('api');
  await app.listen(port, '0.0.0.0'); // IMPORTANTE para Docker
  console.log(`Backend running on port ${port}`);
}
bootstrap();
