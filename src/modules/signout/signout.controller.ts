import { Controller, Get, Request, Response, Session } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignoutService } from './signout.service';

@Controller('signout')
export class SignoutController {
  constructor(
    private readonly signoutService: SignoutService,
    private readonly jwtService: JwtService,
  ) {}
  @Get()
  signOut(
    @Request() req,
    @Response({ passthrough: true }) res,
    @Session() session: Record<string, any>,
  ) {
    console.log('sdfssdfs', req.session.roles);
    req.session.destroy((err) => {
      console.log('session is destoryed');
    });
    res.clearCookie('JWT_TOKEN');
    res.redirect('/signin');
  }
}
