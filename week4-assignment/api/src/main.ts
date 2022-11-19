import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions = {
    origin: "*", 
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE', 
    preflightContinue: false, 
    optionsSucessStatus: 204, 
    credentials: true, 
    allowedHeaders: 'Content-Type, Accept, Authorization'
  }
  app.enableCors(corsOptions)
  const config = new DocumentBuilder()
    .setTitle('API EXAMPLE')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();