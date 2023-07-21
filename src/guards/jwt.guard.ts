import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.cookies['JWT_TOKEN'] != null) {
      const token = request.cookies['JWT_TOKEN'];
      console.log('token=================>', token);
      if (token === undefined) {
        request.res.redirect('/signin');
        return false;
      }
      let tokendata;
      if (token && token.token) {
        tokendata = token.token;
      } else {
        tokendata = token;
      }

      try {
        const payload = await this.jwtService.verifyAsync(tokendata, {
          secret: process.env.JWT_SECRET_USER,
        });
        console.log('Auth Gurad', request.session.roles, payload.roles);
        request['JWT_HEAD'] = payload;
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    } else {
      request.res.redirect('notFound');
    }
  }

  /* extract token fromm reqest header */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
