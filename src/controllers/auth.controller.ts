import {
    Controller,
    Post,
    Body,
    UseGuards,
    ValidationPipe,
    Request,    
    Res,
    Patch
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
  } from '@nestjs/swagger';  
  import { AuthService } from '@/services/auth.service';
  import { LoginDto } from '@/dto/login.dto';
  import { RegisterDto } from '@/dto/register.dto';
  import { ChangePasswordDto } from '@/dto/change-password.dto';  
  import { LocalAuthGuard } from '@/auth/guards/local-auth.guard'; 
  import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';   
  import type { Response } from 'express';
  
  @ApiTags('Autenticación')
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
      status: 200,
      description: 'Login exitoso',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          access_token: { type: 'string' },
          usuario: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              nombre: { type: 'string' },
              correo: { type: 'string' },
              empresa: { type: 'object' },
              rol: { type: 'string' }
            },
          },
        },
      },
    })
    @ApiResponse({
      status: 401,
      description: 'Credenciales inválidas',
    })
    async login(@Body(ValidationPipe) loginDto: LoginDto,@Res({ passthrough: true }) res: Response) {
      const result = await this.authService.login(loginDto);
      res.cookie('accessToken', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 1000 * 60 * 15, // 15 minutos
      });
      return result
    }
  
    @Post('register')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Registrar nuevo usuario' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({
      status: 201,
      description: 'Usuario registrado exitosamente',
    })
    @ApiResponse({
      status: 409,
      description: 'El usuario ya existe',
    })
    async register(@Body(ValidationPipe) registerDto: RegisterDto,@Request() req) {
      return this.authService.register(registerDto,req.user.rol as string);
    }

    @Patch('change-password')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Cambiar contraseña del usuario' })
    @ApiBody({ type: ChangePasswordDto })
    @ApiResponse({
      status: 200,
      description: 'Contraseña cambiada exitosamente',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    })
    @ApiResponse({
      status: 400,
      description: 'La contraseña actual es incorrecta o la nueva contraseña es igual a la actual',
    })
    @ApiResponse({
      status: 401,
      description: 'No autorizado',
    })
    async changePassword(@Body(ValidationPipe) changePasswordDto: ChangePasswordDto, @Request() req) {
      return this.authService.changePassword(req.user.id as number, changePasswordDto);
    }
  }