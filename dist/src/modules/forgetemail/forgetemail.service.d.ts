import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class ForgetemailService {
    private readonly configService;
    private readonly mailerService;
    constructor(configService: ConfigService, mailerService: MailerService);
    sendMaildata(email: any): Promise<{
        token: string;
        Email: any;
    }>;
    checkOtp(Opt: any, userEnterOtp: any): Promise<BadRequestException | {
        status: number;
    }>;
    forgotPassword(data: any): Promise<BadRequestException | {
        email: string;
    }>;
    ChangePassword(Data: any, email: any): Promise<import(".prisma/client").User | BadRequestException>;
}
