import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasosService } from '@/services/casos.service';
import { CasosController } from '@/controllers/casos.controller';
import { Caso, EstadoCaso, Comentario, Estado } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Caso, EstadoCaso, Comentario, Estado])],
  controllers: [CasosController],
  providers: [CasosService],
  exports: [CasosService],
})
export class CasosModule {}