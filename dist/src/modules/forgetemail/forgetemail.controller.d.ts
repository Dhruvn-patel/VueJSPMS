import { ForgetemailService } from './forgetemail.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
export declare class ForgetemailController {
    private readonly forgetemailService;
    private readonly jwtService;
    private readonly mailerService;
    constructor(forgetemailService: ForgetemailService, jwtService: JwtService, mailerService: MailerService);
    getForgotPassword(req: any, res: any): void;
    getchangePassword(req: any, res: any): void;
    roota(req: any, res: any): void;
    getAddCategory(req: any, res: any, Dto: string, session: Record<number, any>): Promise<any>;
    getChangePassword(req: any, res: any, Data: string, session: any): Promise<any>;
    getcheckOtp(req: any, res: any, Dto: string, userEnterOtp: string, session: any): Promise<any>;
}
