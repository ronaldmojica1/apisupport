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
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,    
  } from '@nestjs/swagger';
  import { CasosService } from '@/services/casos.service';
  import { CreateCasoDto } from '@/dto/create-caso.dto';  
  import { UpdateCasoDto } from '@/dto/update-caso.dto';
  import { QueryCasosDto } from '@/dto/query-casos.dto';
  import { UpdateEstadoCasoDto } from '@/dto/update-estado-caso.dto';
  import { CreateComentarioDto } from '@/dto/create-comentario.dto';  
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
    async findAll(@Query(ValidationPipe) query: QueryCasosDto) {
      return this.casosService.findAll(query);
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
    ) {
      return this.casosService.updateEstado(id, updateEstadoDto);
    }
  
    @Post(':id/comentarios')
    @ApiOperation({ summary: 'Agregar comentario al caso' })
    @ApiResponse({ status: 201, description: 'Comentario agregado exitosamente' })
    @ApiResponse({ status: 404, description: 'Caso no encontrado' })
    async addComentario(
      @Param('id', ParseIntPipe) id: number,
      @Body(ValidationPipe) createComentarioDto: CreateComentarioDto,
    ) {
      return this.casosService.addComentario(id, createComentarioDto);
    }
  }