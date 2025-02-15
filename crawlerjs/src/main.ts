import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  await app.listen(3001, () => {
    logger.log('Dantri Crawler service is running on port 3001');
  });
}
bootstrap();
