import { Module } from '@nestjs/common';
import { ForgetemailService } from './forgetemail.service';
import { ForgetemailController } from './forgetemail.controller';
import { JwtService } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailService } from '../mail/mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [MailerModule],
  controllers: [ForgetemailController],
  providers: [ForgetemailService, JwtService, MailService],
})
export class ForgetemailModule {}
