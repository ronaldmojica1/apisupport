import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHealth() {
    return {
      message: 'Case Management API funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: this.configService.get<string>('NODE_ENV'),
    };
  }

  getInfo() {
    return {
      name: 'Case Management API',
      version: '1.0.0',
      description: 'API para gestión de casos con NestJS y TypeORM',
      author: 'Tu Nombre',
      endpoints: {
        auth: '/auth',
        casos: '/casos',
        usuarios: '/usuarios',
        catalogs: '/catalogs',
      },
      documentation: '/api-docs',
    };
  }
}