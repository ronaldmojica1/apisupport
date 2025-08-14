import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Request,
    ValidationPipe,
    ParseIntPipe,
    UseInterceptors,
    UploadedFile,
    Res,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
  } from '@nestjs/swagger';
  import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '@/config/multer.config';
import { CasosService } from '@/services/casos.service';
import { CreateCasoDto } from '@/dto/create-caso.dto';  
import { UpdateCasoDto } from '@/dto/update-caso.dto';
import { QueryCasosDto } from '@/dto/query-casos.dto';
import { UpdateEstadoCasoDto } from '@/dto/update-estado-caso.dto';
import { CreateComentarioDto } from '@/dto/create-comentario.dto';
import { UploadArchivoDto } from '@/dto/upload-archivo.dto';
import { UploadArchivoComentarioDto } from '@/dto/upload-archivo-comentario.dto';
  import * as path from 'path';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @ApiTags('Casos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('casos')
  export class CasosController {
    constructor(private readonly casosService: CasosService) {}
  
    @Get()
    @ApiOperation({ summary: 'Obtener todos los casos con filtros y paginación' })
    @ApiResponse({ status: 200, description: 'Lista de casos obtenida exitosamente' })
    async findAll(@Request() req, @Query(ValidationPipe) query: QueryCasosDto) {
      if (req.user.rol === 'soporte') {
        return this.casosService.findAll(query);
      }
      return this.casosService.findAllByUserId(req.user.id as number, query);
    }   

    @Get('casos-empresa')
    @ApiOperation({ summary: 'Obtener casos de la empresa del usuario autenticado' })
    @ApiResponse({ status: 200, description: 'Lista de casos obtenida exitosamente' })
    async findCasesByCompany(@Request() req, @Query(ValidationPipe) query: QueryCasosDto) {
      return this.casosService.findAllByEmpresaId(req.user.empresaId as number, query);
    }

    @Get('estadisticas')
    @ApiOperation({ summary: 'Obtener estadísticas de casos' })
    @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
    async getEstadisticas() {
      return this.casosService.getEstadisticas();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Obtener caso por ID' })
    @ApiResponse({ status: 200, description: 'Caso obtenido exitosamente' })
    @ApiResponse({ status: 404, description: 'Caso no encontrado' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
      return this.casosService.findOne(id);
    }
  
    @Post()
    @ApiOperation({ summary: 'Crear nuevo caso' })
    @ApiResponse({ status: 201, description: 'Caso creado exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async create(
      @Body(ValidationPipe) createCasoDto: CreateCasoDto,
      @Request() req,
    ) {      
      return this.casosService.create(createCasoDto, req.user.id as number);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar caso' })
    @ApiResponse({ status: 200, description: 'Caso actualizado exitosamente' })
    @ApiResponse({ status: 404, description: 'Caso no encontrado' })
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body(ValidationPipe) updateCasoDto: UpdateCasoDto,
    ) {
      return this.casosService.update(id, updateCasoDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar caso' })
    @ApiResponse({ status: 200, description: 'Caso eliminado exitosamente' })
    @ApiResponse({ status: 404, description: 'Caso no encontrado' })
    async remove(@Param('id', ParseIntPipe) id: number) {
      return this.casosService.remove(id);
    }
  
    @Patch(':id/estado')
    @ApiOperation({ summary: 'Actualizar estado del caso' })
    @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente' })
    @ApiResponse({ status: 404, description: 'Caso no encontrado' })
    async updateEstado(
      @Param('id', ParseIntPipe) id: number,
      @Body(ValidationPipe) updateEstadoDto: UpdateEstadoCasoDto,
      @Request() req,
    ) {
      return this.casosService.updateEstado(id, updateEstadoDto, req.user.id as number);
    }
  
    @Post(':id/comentarios')
  @ApiOperation({ summary: 'Agregar comentario al caso' })
  @ApiResponse({ status: 201, description: 'Comentario agregado exitosamente' })
  @ApiResponse({ status: 404, description: 'Caso no encontrado' })
  async addComentario(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) createComentarioDto: CreateComentarioDto,
    @Request() req
  ) {
    return this.casosService.addComentario(id, createComentarioDto, req.user.id as number);
  }

  @Post(':id/comentarios/:comentarioId/archivos')
  @ApiOperation({ summary: 'Subir archivo vinculado a un comentario' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadArchivoComentarioDto })
  @ApiResponse({ status: 201, description: 'Archivo subido exitosamente' })
  @ApiResponse({ status: 404, description: 'Caso o comentario no encontrado' })
  @UseInterceptors(FileInterceptor('archivo', multerConfig))
  async uploadArchivoComentario(
    @Param('id', ParseIntPipe) id: number,
    @Param('comentarioId', ParseIntPipe) comentarioId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.casosService.uploadArchivo(id, file, comentarioId);
  }

    @Post(':id/archivos')
    @ApiOperation({ summary: 'Subir archivo al caso' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadArchivoDto })
    @ApiResponse({ status: 201, description: 'Archivo subido exitosamente' })
    @ApiResponse({ status: 404, description: 'Caso no encontrado' })
    @UseInterceptors(FileInterceptor('archivo', multerConfig))
    async uploadArchivo(
      @Param('id', ParseIntPipe) id: number,
      @UploadedFile() file: Express.Multer.File,
    ) {
      return this.casosService.uploadArchivo(id, file);
    }

    @Get(':id/archivos')
  @ApiOperation({ summary: 'Obtener archivos del caso' })
  @ApiResponse({ status: 200, description: 'Lista de archivos obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Caso no encontrado' })
  async getArchivos(@Param('id', ParseIntPipe) id: number) {
    return this.casosService.getArchivos(id);
  }

  @Get(':id/comentarios/:comentarioId/archivos')
  @ApiOperation({ summary: 'Obtener archivos vinculados a un comentario' })
  @ApiResponse({ status: 200, description: 'Lista de archivos obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Caso o comentario no encontrado' })
  async getArchivosComentario(
    @Param('id', ParseIntPipe) id: number,
    @Param('comentarioId', ParseIntPipe) comentarioId: number,
  ) {
    return this.casosService.getArchivos(id, comentarioId);
  }

    @Get('archivos/:id')
    @ApiOperation({ summary: 'Obtener información de un archivo' })
    @ApiResponse({ status: 200, description: 'Archivo obtenido exitosamente' })
    @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
    async getArchivo(@Param('id', ParseIntPipe) id: number) {
      return this.casosService.getArchivo(id);
    }

    @Get('archivos/:id/download')
    @ApiOperation({ summary: 'Descargar un archivo' })
    @ApiResponse({ status: 200, description: 'Archivo descargado exitosamente' })
    @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
    async downloadArchivo(
      @Param('id', ParseIntPipe) id: number,
      @Res() res,
    ) {
      const archivo = await this.casosService.getArchivo(id);
      const filePath = path.join(process.cwd(), 'uploads', archivo.ruta);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return res.download(filePath, archivo?.nombre);
    }

    @Delete('archivos/:id')
    @ApiOperation({ summary: 'Eliminar un archivo' })
    @ApiResponse({ status: 200, description: 'Archivo eliminado exitosamente' })
    @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
    async deleteArchivo(@Param('id', ParseIntPipe) id: number) {
      return this.casosService.deleteArchivo(id);
    }
  }