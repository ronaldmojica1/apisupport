import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogsService } from '@/services/catalogs.service';
import { CatalogsController } from '@/controllers/catalogs.controller';
import {
  Empresa,
  Colaborador,
  Categoria,
  Prioridad,
  Estado,
  Herramienta,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Empresa,
      Colaborador,
      Categoria,
      Prioridad,
      Estado,
      Herramienta,
    ]),
  ],
  controllers: [CatalogsController],
  providers: [CatalogsService],
  exports: [CatalogsService],
})
export class CatalogsModule {}