import { ApiProperty } from '@nestjs/swagger';

export class UploadArchivoDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  archivo: any;
}