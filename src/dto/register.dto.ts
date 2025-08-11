import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsInt,
    Min,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class RegisterDto {
    @ApiProperty({ example: 'Juan Pérez' })
    @IsString({ message: 'El nombre debe ser una cadena' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    nombre: string;
  
    @ApiProperty({ example: 'juan@example.com' })
    @IsEmail({}, { message: 'Debe ser un correo válido' })
    @IsNotEmpty({ message: 'El correo es requerido' })
    correo: string;
  
    @ApiProperty({ example: 'password123' })
    @IsString({ message: 'La contraseña debe ser una cadena' })
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    clave: string;
  
    @ApiProperty({ example: 1 })
    @IsInt({ message: 'El ID de empresa debe ser un número entero' })
    @Min(1, { message: 'Debe seleccionar una empresa válida' })
    empresaId: number;

    @ApiProperty({ example: 'usuario', enum: ['soporte', 'usuario'] })
    @IsString({ message: 'El rol debe ser una cadena' })
    @IsNotEmpty({ message: 'El rol es requerido' })
    rol: string;
  }