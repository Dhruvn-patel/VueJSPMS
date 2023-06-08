import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { AuthSignUpDto } from './dto/authsignup.dto';
import { SignupService } from './signup.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('signup')
export class SignupController {
  constructor(
    private readonly signupService: SignupService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @Render('signup')
  async root(@Req() req, @Res() res) {
    const isCheck = req.cookies['JWT_TOKEN'] == null;
    if (isCheck) {
      res.render('signup');
    } else {
      const { token } = req.cookies['JWT_TOKEN'];
      const dataget = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_USER,
      });
      const { email, name, userId, roles } = dataget;
      console.log('roles', roles);
      if (roles == 2) res.redirect('/home');
      else res.redirect('/dashboard');
    }
    return;
  }
  @Post()
  async signUp(
    @Body(new ValidationPipe()) authsignup: AuthSignUpDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const resdata = await this.signupService.signUp(
        authsignup,
        authsignup.googleId,
      );
      console.log('resdata', resdata);

      if (resdata.errorCode == 409) {
        return res.status(409).json({
          errmsg: 'Email is already registered',
          data: null,
          status: 409,
        });
      } else if (resdata.errorCode === 200) {
        return res.status(200).json({
          errmsg: '',
          data: resdata,
          status: 200,
        });
      }
    } catch (error) {
      console.log(error.message);
      return error;
    }
  }
}
