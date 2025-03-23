import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config'; // Importe o ConfigService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o token do cabeçalho Authorization
      ignoreExpiration: false, // Não ignora a expiração do token
      secretOrKey: configService.get<string>('JWT_SECRET'), // Use a variável de ambiente JWT_SECRET
    });
  }

  async validate(payload: any) {
    // console.log('Payload do Token:', payload);
    const user = await this.usersService.findOne(payload.username);
    if (!payload) {
      // console.error('Payload do Token está vazio ou inválido.');
      throw new UnauthorizedException('Token inválido');
    }
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return user; // O usuário será anexado ao objeto `req.user` na requisição
  }
}