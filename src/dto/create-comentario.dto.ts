import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComentarioDto {
  @ApiProperty({ example: 'Se ha solucionado el problema' })
  @IsString({ message: 'El comentario debe ser una cadena' })
  @IsNotEmpty({ message: 'El comentario es requerido' })
  comentario: string;

  @ApiProperty({ type: [Number], required: false, example: [1, 2, 3] })
  @IsArray()
  @IsOptional()
  archivosIds?: number[];
}