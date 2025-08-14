import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api';
  const apiVersion = configService.get<string>('API_VERSION') || 'v1';

  // Configurar CORS
  app.enableCors({
    origin: true, // En producción, especificar orígenes permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Configurar Helmet para seguridad
  app.use(helmet());

  // Configurar archivos estáticos
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configurar prefijo global
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Case Management API')
    .setDescription('API para gestión de casos con NestJS, TypeORM y MySQL')
    .setVersion('1.0.0')
    .addTag('Autenticación', 'Endpoints para login y registro')
    .addTag('Casos', 'CRUD de casos y funcionalidades relacionadas')
    .addTag('Usuarios', 'Gestión de usuarios')
    .addTag('Catálogos', 'Catálogos de datos maestros')
    .addTag('Health Check', 'Endpoints de salud de la API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
    )
    .addServer(`http://localhost:${port}`, 'Desarrollo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(port);

  console.log('🚀 Case Management API Iniciada!');
  console.log(`📍 Servidor: http://localhost:${port}`);
  console.log(`📚 API Base: http://localhost:${port}/${apiPrefix}/${apiVersion}`);
  console.log(`📖 Documentación: http://localhost:${port}/api-docs`);
  console.log(`🔍 Health Check: http://localhost:${port}/${apiPrefix}/${apiVersion}`);
  console.log(`🌍 Entorno: ${configService.get<string>('NODE_ENV')}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
