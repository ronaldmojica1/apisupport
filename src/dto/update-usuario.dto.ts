import { IsString, IsEmail, IsInt, Min, MinLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({ example: 'Juan Pérez Actualizado' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre?: string;

  @ApiPropertyOptional({ example: 'nuevo@email.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  correo?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt({ message: 'El ID de empresa debe ser un número entero' })
  @Min(1, { message: 'Debe seleccionar una empresa válida' })
  empresaId?: number;
}