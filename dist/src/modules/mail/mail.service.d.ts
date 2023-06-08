import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendUserWelcome(token: string, toMail: string, name: string): Promise<void>;
}
