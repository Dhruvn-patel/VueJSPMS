import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';
import * as session from 'express-session';
require('dotenv').config({ path: `../.env` });
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Product Management')
    .setDescription(
      'This documentation contains all the information about product management Api',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useStaticAssets(join(__dirname, '../../', 'public'));
  app.setBaseViewsDir(join(__dirname, '../../', 'views'));
  app.enableCors({
    // origin: true,
    credentials: true,
    // exposedHeaders: ['set-cookie'],
    origin: ['http://localhost:3030', 'http://localhost:8080'],
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: false,

      cookie: {
        maxAge: 500000,
        domain: 'localhost',
        // secure: true,
        // sameSite: 'none',
      },
    }),
  );
  app.useBodyParser('json', { limit: '200mb' });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.setViewEngine('ejs');
  await app.listen(3030);
}
bootstrap();
