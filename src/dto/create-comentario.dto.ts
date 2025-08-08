import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComentarioDto {
  @ApiProperty({ example: 'Se ha solucionado el problema' })
  @IsString({ message: 'El comentario debe ser una cadena' })
  @IsNotEmpty({ message: 'El comentario es requerido' })
  comentario: string;
}