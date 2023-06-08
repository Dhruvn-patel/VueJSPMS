import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
@Injectable()
export class ForgetemailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendMaildata(email: any) {
    const Email = email.email;
    const Name = email.email;
    const token = generateOTP();

    try {
      await this.mailerService
        .sendMail({
          to: `${Email}`,
          from: 'esparkdhruv@gmail.com',
          subject: 'Forgot Password Change',
          text: 'OTP for Reset Password',
          html: `<b> ${token} <b>`,
        })
     
    } catch (error) {
      console.log(error);
    }

    console.log('token', token, Email);
    return { token, Email };
  }
  async checkOtp(Opt: any, userEnterOtp: any) {
    try {
      console.log('fhisude', Opt, Number(userEnterOtp.OTP));

      if (Opt == Number(userEnterOtp.OTP)) {
        return {
          status: 200,
        };
      }
      return new BadRequestException();
    } catch (error) {
      return new BadRequestException();
    }
  }

  async forgotPassword(data: any) {
    const email = data.email;
    const userEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        email: true,
      },
    });
    if (!userEmail) {
      return new BadRequestException();
    } else {
      return userEmail;
    }
  }
  async ChangePassword(Data, email) {
    try {
      const hashedpassword = await bcrypt.hash(Data.password, 10);
      const ChangedPassword = await prisma.user.update({
        data: {
          password: hashedpassword,
        },
        where: {
          email: email,
        },
      });

      return ChangedPassword;
    } catch (error) {
      return new BadRequestException();
    }
  }
}

function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
