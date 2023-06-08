/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Render,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../../guards/jwt.guard';
import { log } from 'console';
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('order')
  async displayOrder(@Req() req, @Res() res) {
    const { token } = req.cookies['JWT_TOKEN'];
    const dataget = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_USER,
    });
    const { email, name, userId } = dataget;

    const result = await this.cartService.allOrderProduct(userId);

    const products: any = result.findProduct;

    return res.render('order', {
      products,
      totalprice: result.price,
      quantity: result.quantity,
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  async displayCart(@Req() req, @Res() res) {
    const { token } = req.cookies['JWT_TOKEN'];

    let tokendata;
    if (token == undefined) {
      tokendata;
    }
    const dataget = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_USER,
    });
    const { email, name, userId } = dataget;

    const result = await this.cartService.getCartItems(Number(userId), 'cart');
    const products = result.findProductDetails;
    const QuantityCart = result.QuantityArr;

    let i = 0;
    products.map((product: any) => {
      product.quantity = QuantityCart[i];
      i++;
    });

    return res.render('cart', { products });
  }

  @UseGuards(AuthGuard)
  @Get('history')
  async displayOrderHistory(@Req() req, @Res() res) {
    const { token } = req.cookies['JWT_TOKEN'];
    const dataget = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_USER,
    });
    const { email, name, userId } = dataget;
    const historydata = await this.cartService.allhistoryData(userId);
    const data = historydata.listOderedProducts;

    return res.render('orderhistory', {
      data,
      productdeatils: historydata.listOdered,
    });
  }

  @Get('/updateQuantity/:id')
  async getQuantityById(@Param() params: any, @Req() req, @Res() res) {
    const { token } = req.cookies['JWT_TOKEN'];
    const dataget = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_USER,
    });
    const { email, name, userId } = dataget;
    const { id } = params;
    const data = await this.cartService.getQuantityById(id, userId);
    return res.json({ data });
  }

  @Post('addIntoCart')
  async getAddInCart(@Req() req, @Res() res, @Body() data): Promise<any> {
    const { token } = req.cookies['JWT_TOKEN'];
    const dataget = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_USER,
    });
    const { email, name, userId } = dataget;
    const productId = data.productId;
    const result = await this.cartService.AddItemsCart(userId, productId);

    if (result.userId) {
      return res.status(200).json({
        status: 200,
        data: result,
        message: `Product Added to Cart`,
      });
    } else if (result.status == 403) {
      return res.json({
        status: 403,
        data: '',
        message: `${result.errmsg}`,
      });
    }
  }

  @Get('/updateQuantity')
  async updateQuantity(@Query() params: any, @Req() req, @Res() res) {
    const { productId, quantity } = params;
    const { token } = req.cookies['JWT_TOKEN'];
    const dataget = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_USER,
    });
    const { email, name, userId } = dataget;
    const data = await this.cartService.quantityCart(
      userId,
      productId,
      quantity,
    );
    return res.json({ data });
  }

  @Get('getData')
  async getCartData(@Req() req, @Res() res): Promise<any> {
    const result = await this.cartService.getCartItems(4, 'cart');
    const products = result.findProductDetails;
    const Quantity = result.Quantity;

    if (result.findProductDetails.length) {
      return res.status(200).json({
        status: HttpStatus.OK,
        data: { products, Quantity },
        message: `List of Products`,
      });
    }
  }

  @Get('deletesoft')
  async deleteSoft(@Req() req, @Res() res) {
    const { token } = req.cookies['JWT_TOKEN'];
    const dataget = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_USER,
    });
    const { email, name, userId } = dataget;
    const result = await this.cartService.deleteSoftValues(userId);

    return res.json({ result });
  }

  @Delete('deleteData/:id')
  async getDeleteItemsInCart(
    @Param() params,
    @Req() req,
    @Res() res,
  ): Promise<any> {
    const { token } = req.cookies['JWT_TOKEN'];
    const dataget = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_USER,
    });
    const { email, name, userId } = dataget;

    const result = await this.cartService.DeleteItemsInCart(userId, params.id);

    return res.status(200).json({
      status: 200,
      data: result,
      message: `Product Deleted !`,
    });
  }

  @Post('OrderAdd')
  async addOrder(@Req() req, @Res() res, @Body() data): Promise<any> {
    const { token } = req.cookies['JWT_TOKEN'];
    const dataget = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_USER,
    });
    const { email, name, userId } = dataget;
    const result = await this.cartService.OrderProduct(userId);

    if (result.status == 400) {
      return res.status(400).json({
        status: 400,
        data: result,
        message: `Something went false !`,
      });
    } else if (result.status == 409) {
      return res.status(409).json({
        status: 409,
        data: result,
        message: `Product is already Ordered !`,
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: result,
        message: `Product Ordered !`,
      });
    }
  }

  @Get('getAllOrders')
  async getAllOrder(@Req() req, @Res() res, @Body() data): Promise<any> {
    const { token } = req.cookies['JWT_TOKEN'];
    const dataget = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_USER,
    });
    const { email, name, userId } = dataget;
    const result = await this.cartService.allOrderProduct(userId);
    return res.status(200).json({
      status: 200,
      data: result,
      message: `Product All !`,
    });
  }

  @Get('orderUpdate')
  async updateOrders(@Req() req, @Res() res) {
    const { token } = req.cookies['JWT_TOKEN'];
    const dataget = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_USER,
    });
    const { email, name, userId } = dataget;
    const result = await this.cartService.updateOrder(userId);
    return res.status(200).json({
      status: 200,
      data: result,
      message: `order update  !`,
    });
  }

  @Get('/lastInsert')
  async lastData(@Req() req, @Res() res) {
    const data = await this.cartService.orderDisplay();
    return res.json(data);
  }
}
