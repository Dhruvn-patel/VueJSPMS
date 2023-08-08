/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Redirect,
  Render,
  Req,
  Res,
  Session,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/authlogin.dto';
import { SigninService } from './signin.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
@Controller('signin')
export class SigninController {
  constructor(
    private readonly signinService: SigninService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  async showLogin(@Req() req, @Res() res) {
    const isCheck = req.cookies['JWT_TOKEN'] == null;
    if (isCheck) {
      res.render('signin');
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
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('/insert')
  async signIn(
    @Body(new ValidationPipe()) authsignin: AuthLoginDto,
    @Req() req: Request,
    @Res() res,
    @Session() session: Record<string, any>,
  ): Promise<any> {
    try {
      const responseToken = await this.signinService.signIn(
        authsignin,
        req,
        res,
      );
      console.log('response service', responseToken);

      if (responseToken.status == 401) {
        console.log('401');
        try {
          res.status(401).json({
            errmsg: 'email is not registered',
            data: null,
            status: 401,
          });
        } catch (error) {
          return error;
        }
      } else if (responseToken.status == 400) {
        console.log('400');
        try {
          res.status(400).json({
            errmsg: 'password is not correct',
            data: null,
            status: 400,
          });
        } catch (error) {
          return error;
        }
      } else {
        res.cookie('JWT_TOKEN', responseToken, { httpOnly: true });
        session.roles = responseToken.roles;
        res.status(200).json({
          errmsg: 'Successfully login',
          data: responseToken.token,
          roles: responseToken.roles,
          status: 200,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req, @Res() res) {
    return res.redirect('/signin/redirect');
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<any> {
    const googleres = await this.signinService.googleLogin(req, res);
    console.log('googleres', googleres);
    return res.redirect('/home');
  }

  // @Get('redirect')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(
  //   @Req() req,
  //   @Res({ passthrough: true }) res,
  // ): Promise<any> {
  //   console.log('req', req);

  //   const googleres = await this.signinService.googleLogin(req, res);
  //   console.log('googleres', googleres);
  //   return res.send('htl');
  // }
}
