import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const APP_PORT = 3000;
  const APP_HOST = '0.0.0.0';
  const APP_WS_PORT = 3001;

  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('Api Documentation').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(APP_PORT, APP_HOST, () => {
    logger.log(
      `NestJS application is running on: http://${APP_HOST}:${APP_PORT}`,
    );
    logger.log(
      `WebSocket server is running on: ws://${APP_HOST}:${APP_WS_PORT}`,
    );
    logger.log(
      `Swagger API documentation is available at: http://${APP_HOST}:${APP_PORT}/api`,
    );
  });
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error("Erreur lors du démarrage de l'application:", error);
  process.exit(1);
});
