import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import { Context, Handler } from 'aws-lambda';
import express from 'express';
import cookieParser from 'cookie-parser';
import { initialize, session } from 'passport';
import ExpressSession from 'express-session';
import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerDocument } from './main';
import { AppModule } from './app.module';
import MongoStore from 'connect-mongo';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    nestApp.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    // nestApp.useGlobalInterceptors(new DbConnectionInterceptor(connection));
    nestApp.setGlobalPrefix('api');
    nestApp.enableCors();
    const configService = nestApp.get(ConfigService);
    nestApp.use(cookieParser());
    nestApp.use(
      ExpressSession({
        secret: configService.get<string>('session.secret'),
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: configService.get<string>('database.mongouri'),
        }),
      }),
    );
    nestApp.use(initialize());
    nestApp.use(session());

    const document = getSwaggerDocument(nestApp);
    SwaggerModule.setup('docs', nestApp, document);
    await nestApp.init();
    cachedServer = serverlessExpress({
      app: expressApp,
    });
  }

  return cachedServer;
}

export const handler = async (event: any, context: Context, callback: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (event.path === '/docs') {
    event.path = '/docs/';
  }
  if (event.path) {
    event.path = event.path.includes('swagger-ui')
      ? `/docs${event.path}`
      : event.path;
  }
  const server = await bootstrap();
  return server(event, context, callback);
};
