import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

async function checkDatabaseConnection() {
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection OK');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function bootstrap() {
  await checkDatabaseConnection();

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth-svc',
        brokers: ['broker:29092'],
      },
      consumer: {
        groupId: 'auth-service-consumer',
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    },
  });

  app.use(cookieParser());
  // app.enableCors({
  //   origin: ['http://localhost:5000'],
  //   credentials: true,
  // });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const reflector = app.get(Reflector);
  //do JwtAuthGuard có constructor cần reflector nên cần truyền refector vào
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
