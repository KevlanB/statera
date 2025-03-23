import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:3001", // Permite requisições do front-end
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos permitidos
    allowedHeaders: "Content-Type, Authorization", // Headers permitidos
    credentials: true, // Se for usar cookies ou autenticação com credenciais
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
