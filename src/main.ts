import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });
  app.use(compression());
  app.use(helmet({
    crossOriginResourcePolicy: false
  }));
  // Apply global pipes, interceptors, and filters
  app.setGlobalPrefix('/api');
  app.enableVersioning();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // 🧼 Strips properties that don't have decorators
      forbidNonWhitelisted: true, // 🚫 Throws error if extra fields are sent
      transform: true,        // 🔄 Automatically transforms payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // 🔁 Allows primitive type conversion (e.g. string to number)
      },
    }),
  );

  const createConfig = (title: string, description: string) => {
    return new DocumentBuilder()
      .setOpenAPIVersion('3.1.0')
      .addBearerAuth()
      .setTitle(title)
      .setDescription(description)
      .setVersion('1.0')
      .addServer(configService.getOrThrow('BACKEND_URL'))
      .build();
  };

  const configAdmin = createConfig(
    'Master API',
    'The Master API. <br><br> API endpoints for Tenant application API. <br> <a  href="/apidoc/tenant"> Tenant application API-Doc </a>',
  );
  const configApi = createConfig(
    'Tenant API',
    'The Tenant API. <br><br> API endpoints for Master application API. <br> <a  href="/apidoc"> Master application API-Doc </a>',
  );

  const documentAdmin = SwaggerModule.createDocument(app, configAdmin);
  const documentApi = SwaggerModule.createDocument(app, configApi);

  // Master APIDoc URL
  SwaggerModule.setup(
    'apidoc',
    app,
    {
      ...documentAdmin,
      paths: Object.fromEntries(
        Object.entries(documentAdmin.paths).filter(([key]) => key.includes('master')),
      ),
    },
    {
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
      },
    },
  );
  // User APIDoc URL
  SwaggerModule.setup(
    'apidoc/tenant',
    app,
    {
      ...documentApi,
      paths: Object.fromEntries(
        Object.entries(documentApi.paths).filter(([key]) => key.includes('tenant') && !key.includes('master')),
      ),
    },
    {
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
      },
    },
  );

  app.use('/', (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/' || req.path.indexOf('apidoc') !== -1) {
      return res.redirect('/apidoc');
    }
    next(); // Continue processing other API routes
  });

  //app.use(new TenantMiddleware().use);

  await app.listen(configService.getOrThrow('PORT'), () => {
    logger.debug(`[${configService.getOrThrow('PROJECT_NAME')} | ${configService.getOrThrow('NODE_ENV')}] is running: http://127.0.0.1:${configService.getOrThrow('PORT')}/apidoc`)
  });
}
bootstrap();
