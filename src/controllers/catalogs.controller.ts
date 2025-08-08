import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CatalogsService } from '@/services/catalogs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Catálogos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los catálogos' })
  @ApiResponse({ status: 200, description: 'Catálogos obtenidos exitosamente' })
  async getAllCatalogs() {
    return this.catalogsService.getAllCatalogs();
  }

  @Get('empresas')
  @ApiOperation({ summary: 'Obtener todas las empresas' })
  @ApiResponse({ status: 200, description: 'Empresas obtenidas exitosamente' })
  async getEmpresas() {
    return this.catalogsService.getEmpresas();
  }

  @Get('colaboradores')
  @ApiOperation({ summary: 'Obtener todos los colaboradores' })
  @ApiResponse({ status: 200, description: 'Colaboradores obtenidos exitosamente' })
  async getColaboradores() {
    return this.catalogsService.getColaboradores();
  }

  @Get('categorias')
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Categorías obtenidas exitosamente' })
  async getCategorias() {
    return this.catalogsService.getCategorias();
  }

  @Get('prioridades')
  @ApiOperation({ summary: 'Obtener todas las prioridades' })
  @ApiResponse({ status: 200, description: 'Prioridades obtenidas exitosamente' })
  async getPrioridades() {
    return this.catalogsService.getPrioridades();
  }

  @Get('estados')
  @ApiOperation({ summary: 'Obtener todos los estados' })
  @ApiResponse({ status: 200, description: 'Estados obtenidos exitosamente' })
  async getEstados() {
    return this.catalogsService.getEstados();
  }

  @Get('herramientas')
  @ApiOperation({ summary: 'Obtener todas las herramientas' })
  @ApiResponse({ status: 200, description: 'Herramientas obtenidas exitosamente' })
  async getHerramientas() {
    return this.catalogsService.getHerramientas();
  }
}