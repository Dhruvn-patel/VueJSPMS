import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendUserWelcome(token: string, toMail: string, name: string) {
    const confirmation_url = token;

    
    try {
      console.log("mailservice",token,toMail,name);
      await this.mailerService.sendMail({
        to: toMail,
        subject: 'Forgot Password',
        template: './email', 
        context: {
          name: name,
          confirmation_url,
        },
      })
    } catch (error) {
        console.log({error});
        
    }
  }
}
