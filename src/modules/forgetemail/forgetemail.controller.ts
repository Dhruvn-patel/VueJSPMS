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
    // const Opt = req.session.data;
    // if (Opt) {
    //   return;
    // } else {
    //   res.redirect('/forgetemail/forgot-password');
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

      console.log('SendEmailandThrowOpt', SendEmailandThrowOpt);

      req.session.data = SendEmailandThrowOpt.token;
      req.session.email = SendEmailandThrowOpt.Email;
      return res.status(200).json({
        status: 200,
        data: result,
        message: `Enter OTP`,
        otp: SendEmailandThrowOpt.token,
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
    @Session() session,
  ): Promise<any> {
    const Opt = req.session.data;
    const email = req.session.email;
    const otpIsValid = req.session.otpIsValid;

    if (email) {
      const result: any = await this.forgetemailService.ChangePassword(
        Data,
        email,
      );
      console.log('result', result);

      if (result.status == 400) {
        return res.status(400).json({
          status: 400,
          data: '',
        });
      } else {
        req.session.destroy();
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
    @Session() session,
  ): Promise<any> {
    console.log(userEnterOtp);
    const Opt = req.session.data;
    if (Opt) {
      const result: any = await this.forgetemailService.checkOtp(
        Opt,
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
  }
}
