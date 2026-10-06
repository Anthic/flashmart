import { RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

export function configureApp(app: NestExpressApplication): void {
  const configService = app.get(ConfigService);

  const corsOrigins = configService.getOrThrow<string[]>('CORS_ORIGINS');
  const bodyLimit = configService.getOrThrow<string>('BODY_LIMIT');

  app.use(helmet());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Idempotency-Key',
      'X-Request-Id',
    ],
    exposedHeaders: ['ETag', 'Retry-After', 'X-Request-Id'],
    maxAge: 86_400,
  });

  app.useBodyParser('json', { limit: bodyLimit });
  app.setGlobalPrefix('api/v1', {
    exclude: [
      {
        path: 'health/live',
        method: RequestMethod.GET,
      },
    ],
  });
}
