import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsInt,
    Min,
    MinLength,
    MaxLength,
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  export class CreateCasoDto {
    @ApiProperty({ example: 'Error en el sistema de login' })
    @IsString({ message: 'El título debe ser una cadena' })
    @IsNotEmpty({ message: 'El título es requerido' })
    @MinLength(5, { message: 'El título debe tener al menos 5 caracteres' })
    titulo: string;
  
    @ApiPropertyOptional({
      example: 'Los usuarios no pueden iniciar sesión correctamente',
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena' })
    @MaxLength(1000, {
      message: 'La descripción no puede exceder 1000 caracteres',
    })
    descripcion?: string;
  
    @ApiProperty({ example: 1 })
    @IsInt({ message: 'El ID de categoría debe ser un número entero' })
    @Min(1, { message: 'Debe seleccionar una categoría válida' })
    categoriaId: number;
  
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt({ message: 'El ID de herramienta debe ser un número entero' })
    @Min(1, { message: 'Debe seleccionar una herramienta válida' })
    herramientaId?: number;
  
    @ApiProperty({ example: 3 })
    @IsInt({ message: 'El ID de prioridad debe ser un número entero' })
    @Min(1, { message: 'Debe seleccionar una prioridad válida' })
    prioridadId: number;
  
    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsInt({ message: 'El ID del colaborador debe ser un número entero' })
    @Min(1, { message: 'Debe seleccionar un colaborador válido' })
    asignadoA?: number;

    @ApiProperty({ example: 1 })
    @IsOptional()
    @IsInt({ message: 'El ID de estado debe ser un número entero' })
    @Min(1, { message: 'Debe seleccionar un estado válido' })
    estadoId: number;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsInt({ message: 'El ID del Usuario que esta creando, (solo para rol soporte)' })
    @Min(1, { message: 'Debe seleccionar un usuario válido' })
    creadoPor?: number;
  }