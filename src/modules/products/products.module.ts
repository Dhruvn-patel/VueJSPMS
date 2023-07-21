/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryService } from '../category/category.service';
import { CategoryModule } from '../category/category.module';
import { JwtService } from '@nestjs/jwt';
import { CommonMiddleware } from 'src/common/common.middleware';

@Module({
  imports: [CategoryModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, CategoryService, JwtService],
  exports: [ProductsService],
})
export class ProductsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CommonMiddleware).forRoutes(ProductsController);
  }
}
