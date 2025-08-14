import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UploadArchivoComentarioDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty({ message: 'El archivo es requerido' })
  archivo: any;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  comentarioId?: number;
}