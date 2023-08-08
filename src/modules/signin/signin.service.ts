import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthLoginDto } from './dto/authlogin.dto';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

@Injectable()
export class SigninService {
  constructor(
    private prismService: PrismaService,
    private jwtService: JwtService,
  ) {}

  /* signin */
  async signIn(
    authsignindto: AuthLoginDto,
    req: any,
    res: Response,
  ): Promise<any> {
    const { email, password } = authsignindto;
    console.log(email, password);

    try {
      const user = await this.prismService.user.findUnique({
        where: {
          email: email,
        },
      });

      /* check user exists or not */
      if (user == null) {
        return new UnauthorizedException();
      } else {
        const hashedpassword = user.password;

        /* match password */
        const ismatch = await bcrypt.compare(password, hashedpassword);
        console.log('matches', ismatch);

        if (ismatch == false) {
          return new BadRequestException();
        }
        const token = await this.addToken({
          name: user.name,
          email: user.email,
          roles: user.rolesId,
          userId: Number(user.id),
        });
        return { token: token, roles: user.rolesId };
      }
    } catch (error) {
      console.log(error.message);
      return error;
    }
  }

  async addToken(args: {
    name: string;
    email: string;
    roles: number;
    userId: number;
  }) {
    const payload = args;
    /* store token  */
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '2d',
      secret: process.env.JWT_SECRET_USER,
    });
    return token;
  }

  /* google token  */
  async googleLogin(@Req() req, @Res() res) {
    console.log('google', req);

    if (!req.user.email) {
      return 'No user from google';
    }
    const datainserted = await prisma.user.upsert({
      where: {
        email: req.user.email,
      },
      update: {},
      create: {
        name: req.user.firstName,
        email: req.user.email,
        password: '',
        googleId: req.user.id,
      },
    });

    const tokendata = await this.addToken({
      name: req.user.firstName,
      email: req.user.email,
      roles: 2,
      userId: Number(datainserted.id),
    });

    const token = {
      token: tokendata,
    };
    res.cookie('JWT_TOKEN', token, { httpOnly: true });
    return {
      message: 'User Info from Google',
      user: req.user,
      token: tokendata,
    };
  }
}
