import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'correo',
      passwordField: 'clave',
    });
  }

  async validate(correo: string, clave: string): Promise<any> {
    const usuario = await this.authService.validateUser(correo, clave);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return usuario;
  }
}
