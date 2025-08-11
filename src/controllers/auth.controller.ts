import {
    Controller,
    Post,
    Body,
    UseGuards,
    ValidationPipe,
    Request
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
  import { LocalAuthGuard } from '@/auth/guards/local-auth.guard'; 
  import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';   
  
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
    async login(@Body(ValidationPipe) loginDto: LoginDto) {
      return this.authService.login(loginDto);
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
  }