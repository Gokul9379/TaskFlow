import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // <-- 1. Import Swagger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so your React frontend can talk to it
  app.enableCors();
  
  // Enable global validation
  app.useGlobalPipes(new ValidationPipe());

  // --- 2. SWAGGER CONFIGURATION ---
  const config = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setDescription('The official API documentation for the TaskFlow application. Includes Auth, Tasks, and Weather integrations.')
    .setVersion('1.0')
    .addBearerAuth() // Allows you to test protected routes right from the docs!
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  // This hosts the docs at http://localhost:3000/api
  SwaggerModule.setup('api', app, document); 
  // --------------------------------

  await app.listen(3000);
}
bootstrap();