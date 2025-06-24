import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getWifiIpv4Address } from './tools/network';

async function bootstrap() {
  const APP_PORT = 3000;
  const APP_HOST = '0.0.0.0';
  const APP_WS_PORT = 3001;
  const APP_IPV4_ADDRESS = getWifiIpv4Address();

  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  const config = new DocumentBuilder().setTitle('Api Documentation').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(APP_PORT, APP_HOST);

  logger.log(
    `NestJS application is running on: http://${APP_HOST}:${APP_PORT} - http://${APP_IPV4_ADDRESS}:${APP_PORT}`,
  );
  logger.log(
    `Swagger API documentation is available at: http://${APP_HOST}:${APP_PORT}/api - http://${APP_IPV4_ADDRESS}:${APP_PORT}/api`,
  );
  logger.log(
    `WebSocket server is running on: ws://${APP_HOST}:${APP_WS_PORT} - ws://${APP_IPV4_ADDRESS}:${APP_WS_PORT}`,
  );
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error("Erreur lors du démarrage de l'application:", error);
  process.exit(1);
});
