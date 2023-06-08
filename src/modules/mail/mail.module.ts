import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';

console.log('MailModulesdfsfsfgsd');

@Module({
  imports: [
  
  ],
})
export class MailModule {}

// MailerModule.forRootAsync({
//   useFactory: async (config: ConfigService) => ({
//     transport: {
//       // host: 'smtp.gmail.com',
//       // port: 465,
//       // secure: false,
//       // ignoreTLS: true,
//       // auth: {
//       //   user: 'esparkdhruv@gmail.com',
//       //   pass: process.env.SMTP_PASSWORD,
//       // },
//       debug: true,
//       // tls: {
//       //   rejectUnauthorized: false,
//       // },
//     },
//     // template: {
//     //   dir: join(__dirname, '../../../../', 'views'),
//     //   adapter: new EjsAdapter(),
//     //   options: {
//     //     strict: true,
//     //   },
//     // },
//   }),
//   inject: [ConfigService],
// }),
