import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  Usuario,
  Empresa,
  Colaborador,
  Categoria,
  Prioridad,
  Estado,
  Herramienta,
  Caso,
  UsuarioCaso,
  EstadoCaso,
  Comentario,
} from '../entities';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [
    Usuario,
    Empresa,
    Colaborador,
    Categoria,
    Prioridad,
    Estado,
    Herramienta,
    Caso,
    UsuarioCaso,
    EstadoCaso,
    Comentario,
  ],
  //synchronize: configService.get<string>('NODE_ENV') === 'development',
  //dropSchema: configService.get<string>('NODE_ENV') === 'development',
  logging: configService.get<string>('NODE_ENV') === 'development',
  migrations: ['src/database/migrations/*.ts'],
});