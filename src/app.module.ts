/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SignupModule } from './modules/signup/signup.module';
import { PrismaService } from './prisma/prisma.service';
import { SigninModule } from './modules/signin/signin.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SignoutModule } from './modules/signout/signout.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HomeModule } from './modules/home/home.module';
import { ForgetemailModule } from './modules/forgetemail/forgetemail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { ProductsModule } from './modules/products/products.module';
import { CategoryModule } from './modules/category/category.module';
import { CartModule } from './modules/cart/cart.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './modules/mail/mail.module';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    SignupModule,
    SigninModule,
    SignoutModule,
    DashboardModule,
    HomeModule,
    ForgetemailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    CategoryModule,
    CartModule,
    UserModule,
    MailModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 25,
        // secure: false,
        auth: {
          user: 'esparkdhruv@gmail.com',
          pass: 'bxsgfmgdormiyzqg',
        },
        tls: {
          // do not fail on invalid certs
          // rejectUnauthorized: false,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    JwtStrategy,
    GoogleStrategy,
    JwtService,
  ],
})
export class AppModule {}
