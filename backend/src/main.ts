import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS for local development and live Vercel deployments
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      /https:\/\/.*\.vercel\.app$/, // Allows all Vercel preview & production deployments
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 3. Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setDescription('The official API documentation for the TaskFlow application. Includes Auth, Tasks, and Weather integrations.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 4. Dynamic Port Allocation and '0.0.0.0' Host Binding for Render
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();