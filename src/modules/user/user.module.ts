import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { RedirectRouteMiddleware } from 'src/redirect-route/redirect-route.middleware';
import { DashboardModule } from '../dashboard/dashboard.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RedirectRouteMiddleware).forRoutes(UserController);
  }
}
