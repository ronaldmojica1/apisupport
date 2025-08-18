import {
    Controller,
    Get,
    Patch,
    Param,
    Delete,
    Body,
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
  import { UsuariosService } from '@/services/usuarios.service';
  import { UpdateUsuarioDto } from '@/dto/update-usuario.dto';  
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @ApiTags('Usuarios')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('usuarios')
  export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}
  
    @Get()
    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente' })
    async findAll() {
      return this.usuariosService.findAll();
    }
  
    @Get('colaboradores')
    @ApiOperation({ summary: 'Obtener todos los colaboradores (usuarios con rol soporte)' })
    @ApiResponse({ status: 200, description: 'Lista de colaboradores obtenida exitosamente' })
    async getColaboradores() {
      return this.usuariosService.getColaboradores();
    }

    @Get('profile')
    @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
    @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente' })
    async getProfile(@Request() req) {
      return this.usuariosService.getProfile(req.user.id as number);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Obtener usuario por ID' })
    @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
      return this.usuariosService.findOne(id);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar usuario' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body(ValidationPipe) updateUsuarioDto: UpdateUsuarioDto,
    ) {
      return this.usuariosService.update(id, updateUsuarioDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar usuario' })
    @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async remove(@Param('id', ParseIntPipe) id: number) {
      return this.usuariosService.remove(id);
    }
  }  
  