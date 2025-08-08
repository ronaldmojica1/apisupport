import {
    Injectable,
    UnauthorizedException,
    ConflictException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { JwtService } from '@nestjs/jwt';
  import { Usuario } from '../entities/usuario.entity';
  import { LoginDto } from '@/dto/login.dto';
  import { RegisterDto } from '@/dto/register.dto';    
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectRepository(Usuario)
      private usuarioRepository: Repository<Usuario>,
      private jwtService: JwtService,
    ) {}
  
    async validateUser(correo: string, clave: string): Promise<Usuario | null> {
      const usuario = await this.usuarioRepository.findOne({
        where: { correo },
        select: ['id', 'correo', 'nombre', 'clave', 'empresaId'],
        relations: ['empresa'],
      });
  
      if (usuario && (await usuario.validatePassword(clave))) {
        const result  = usuario;
        return result;
      }
      return null;
    }
  
    async login(loginDto: LoginDto) {
      console.log(loginDto)
      const usuario = await this.validateUser(loginDto.correo, loginDto.clave);
      if (!usuario) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
  
      const payload = {
        correo: usuario.correo,
        sub: usuario.id,
        nombre: usuario.nombre,
      };
  
      return {
        message: 'Login exitoso',
        access_token: this.jwtService.sign(payload),
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          empresa: usuario.empresa,
        },
      };
    }
  
    async register(registerDto: RegisterDto) {
      // Verificar si el usuario ya existe
      const existingUser = await this.usuarioRepository.findOne({
        where: { correo: registerDto.correo },
      });
  
      if (existingUser) {
        throw new ConflictException('El usuario ya existe con ese correo');
      }
  
      // Crear nuevo usuario
      const usuario = this.usuarioRepository.create(registerDto);
      const savedUser = await this.usuarioRepository.save(usuario);
  
      // Obtener el usuario con la empresa
      const userWithEmpresa = await this.usuarioRepository.findOne({
        where: { id: savedUser.id },
        relations: ['empresa'],
      });
  
      const payload = {
        correo: userWithEmpresa?.correo,
        sub: userWithEmpresa?.id,
        nombre: userWithEmpresa?.nombre,
      };
  
      return {
        message: 'Usuario registrado exitosamente',
        access_token: this.jwtService.sign(payload),
        usuario: {
          id: userWithEmpresa?.id,
          nombre: userWithEmpresa?.nombre,
          correo: userWithEmpresa?.correo,
          empresa: userWithEmpresa?.empresa,
        },
      };
    }
  }
  