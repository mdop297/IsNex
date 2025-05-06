/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { JwtAuthGuard } from './app/auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  //do JwtAuthGuard có constructor cần reflector nên cần truyền refector vào
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  // to validate input data before run into controller base on dto
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
console.log('this is from local host. Updated');
bootstrap();
