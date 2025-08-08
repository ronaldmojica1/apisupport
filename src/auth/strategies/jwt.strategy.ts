import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'App.2025.01.2023',
    });
  }

  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      correo: payload.correo,
      nombre: payload.nombre,
    };
  }
}

interface JwtPayload {
  sub: number;
  correo: string;
  nombre: string;
}