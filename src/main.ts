import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import ExpressSession from 'express-session';
import { initialize, session } from 'passport';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import MongoStore from 'connect-mongo';

export const getSwaggerDocument = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Unigamer Service')
    .setDescription('REST API  Documentation for unigamer service')
    .setVersion('1.0')
    .addCookieAuth()
    .build();
  return SwaggerModule.createDocument(app, options);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  app.use(
    ExpressSession({
      secret: configService.get<string>('session.secret'),
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: configService.get<string>('database.mongouri'),
      }),
    }),
  );
  app.use(initialize());
  app.use(session());

  const document = getSwaggerDocument(app);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
