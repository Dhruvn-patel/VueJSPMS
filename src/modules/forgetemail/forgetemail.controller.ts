import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Render,
  Req,
  Request,
  Res,
  Response,
  Session,
} from '@nestjs/common';
import { ForgetemailService } from './forgetemail.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
let otpGlobal = { otp: 0, email: '' };
@Controller('forgetemail')
export class ForgetemailController {
  constructor(
    private readonly forgetemailService: ForgetemailService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  @Get('forgot-password')
  getForgotPassword(@Request() req, @Response() res) {
    res.render('forgetpassword');
  }
  @Get('changepassword')
  getchangePassword(@Request() req, @Response() res) {
    res.render('passwordchange');
  }

  @Get('otp')
  @Render('otp')
  roota(
    @Req()
    req: any,
    @Res()
    res: any,
  ) {
    return;
    // const Otp = req.session.data;
    // if (Otp) {
    //   return;
    // } else {
    //   res.redirect('/forgetemail/  -password');
    // }
  }

  @Post('forgot-password')
  public async getAddCategory(
    @Req()
    req: any,
    @Res()
    res: any,
    @Body() Dto: string,
    @Session() session: Record<number, any>,
  ): Promise<any> {
    const result: any = await this.forgetemailService.forgotPassword(Dto);
    if (result.status == 400) {
      return res.status(400).json({
        status: 400,
        data: result,
        message: `Invalid email address`,
      });
    } else {
      const SendEmailandThrowOpt = await this.forgetemailService.sendMaildata(
        Dto,
      );
      req.session.data = SendEmailandThrowOpt.token;
      req.session.email = SendEmailandThrowOpt.Email;
      // otpGlobal = Number(SendEmailandThrowOpt.token);
      otpGlobal.otp = Number(SendEmailandThrowOpt.token);
      otpGlobal.email = SendEmailandThrowOpt.Email;
      return res.status(200).json({
        status: 200,
        data: result,
        message: `Enter OTP`,
      });
    }
  }

  @Post('changePassword')
  public async getChangePassword(
    @Req()
    req: any,
    @Res()
    res: any,
    @Body() Data: string,
    @Session() session: Record<number, any>,
  ): Promise<any> {
    // const Otp = req.session.data;
    // const email = req.session.email;
    // const otpIsValid = req.session.otpIsValid;

    const Otp = otpGlobal.otp;
    const email = otpGlobal.email;
    console.log('otpGlobal', otpGlobal);
    if (email) {
      const result: any = await this.forgetemailService.ChangePassword(
        Data,
        email,
      );
      console.log('result', result);
      if (result.status == 400) {
        return res.status(400).json({
          status: 400,
          data: 'Otp not match',
        });
      } else {
        req.session.destroy();
        delete otpGlobal.otp;
        delete otpGlobal.email;
        return res.status(200).json({
          status: 200,
          data: result,
        });
      }
    }
  }

  @Post('otp')
  public async getcheckOtp(
    @Req()
    req: any,
    @Res()
    res: any,
    @Body() Dto: string,
    @Body() userEnterOtp: string,
    @Session() session: Record<number, any>,
  ): Promise<any> {
    try {
      const Otp = otpGlobal.otp;
      console.log(userEnterOtp, Otp);

      if (Otp) {
        const result: any = await this.forgetemailService.checkOtp(
          Otp,
          userEnterOtp,
        );

        if (result.status == 200) {
          req.session.otpIsValid = true;
          return res.status(200).json({
            status: 200,
            data: result,
          });
        } else {
          return res.status(400).json({
            status: 400,
            data: '',
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 400,
        data: '',
      });
    }
  }
}
