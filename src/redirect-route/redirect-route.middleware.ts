import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RedirectRouteMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: any, res: any, next: () => void) {
    // const { token } = req.cookies['JWT_TOKEN'];
    // const dataget = await this.jwtService.verifyAsync(token, {
    //   secret: process.env.JWT_SECRET_USER,
    // });
    // const { email, name, userId, roles } = dataget;

    // console.log(email, name, userId, roles);
    // if (roles != 2) {
    //   res.redirect('/home');
    // }
    next();
  }
}
