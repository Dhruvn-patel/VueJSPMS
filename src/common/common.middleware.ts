import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class CommonMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      console.log(token);
      try {
        this.jwtService
          .verifyAsync(token, {
            secret: process.env.JWT_SECRET_USER,
          })
          .then((data) => {
            next();
          });
      } catch (error) {
        console.log('asdasasadasasdas ereeer', error);

        return res.status(401).json({
          data: 'Token is not Valid !',
        });
        // if (
        //     [JsonWebTokenError, TokenExpiredError].some((el) => error instanceof el)
        // ) {
        //     return res
        //         .status(401)
        //         .json({ message: "token expires please generate new one !!" });
        // }
      }
    } else {
      return res.sendStatus(401);
    }
  }
}
