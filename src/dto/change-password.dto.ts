import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentpassword123' })
  @IsString({ message: 'La contraseña actual debe ser una cadena' })
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  claveActual: string;

  @ApiProperty({ example: 'newpassword123' })
  @IsString({ message: 'La nueva contraseña debe ser una cadena' })
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  claveNueva: string;
}