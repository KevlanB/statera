import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // console.log('JwtAuthGuard: Verificando autenticação...');
    const request = context.switchToHttp().getRequest();
    // console.log('Cabeçalhos da Requisição:', request.headers); 
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // console.log('Resultado da Autenticação:', { err, user, info }); 
    if (err || !user) {
      throw err || new UnauthorizedException('Não autorizado');
    }
    return user;
  }
}