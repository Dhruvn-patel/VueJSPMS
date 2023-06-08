import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService,
  ) {}
  @Get()
  async getHello(@Req() req, @Res() res): Promise<string> {
    if (req.cookies['JWT_TOKEN'] != null) {
      const { token } = req.cookies['JWT_TOKEN'];
      const dataget = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_USER,
      });
      const { email, name, userId, roles } = dataget;
      if (userId) {
        return res.redirect('/signin');
      }
    } else {
      const data = this.appService.getHello();
      return res.redirect('/signup');
    }
  }

  @Get('notFound')
  async notFound(@Req() req, @Res() res) {
    return res.render('notfound');
  }
}
