import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEstadoCasoDto {
  @ApiProperty({ example: 2 })
  @IsInt({ message: 'El ID del estado debe ser un número entero' })
  @Min(1, { message: 'Debe seleccionar un estado válido' })
  estadoId: number;
}