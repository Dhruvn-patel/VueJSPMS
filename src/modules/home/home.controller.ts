/* eslint-disable prettier/prettier */
import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { ProductsService } from '../products/products.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../../guards/jwt.guard';

@Controller('home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly productsService: ProductsService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async listAllProduct(@Req() req, @Res() res) {
    const productdata = await this.productsService.getAllProductsWithCategory();
    // if (req.session.roles != 2) {
    //   return res.redirect('/dashboard');
    // }
    return res.render('home', { productdata });
  }
}
