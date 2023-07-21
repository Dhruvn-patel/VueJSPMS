/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Render,
  Req,
  Request,
  Res,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { productDto } from './dto/product.dto';
import { ProductsService } from './products.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../category/category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  destination,
  editFileName,
  imageFileFilter,
} from './filesconfig.multer';
import { AuthGuard } from '../../guards/jwt.guard';
import { file } from 'googleapis/build/src/apis/file';
import { JwtService } from '@nestjs/jwt';
@ApiTags('Product Module')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoryService: CategoryService,
    private readonly jwtService: JwtService,
  ) {}

  /* render products */
  @UseGuards(AuthGuard)
  @Get()
  @Render('products')
  getProducts() {
    return;
  }

  // @ApiOperation({ summary: 'insert product data with category' })
  // @Post('/addProduct')
  // addProduct(@Body(new ValidationPipe()) product: productDto) {
  //   return this.productsService.addProduct(product, product.categoryId);
  // }

  /* add product with image  */
  @Post('/newAddProduct')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: destination,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async addProductwithFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('ProductName') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @Body('quantity') quantity: number,
    @Body('catagory') categoryIds: string,
    @Req() req,
    @Res() res,
  ) {
  
    const data = this.productsService.uploadSingleFile(
      file,
      name,
      description,
      price,
      quantity,
      categoryIds,
    
    );
    return res.status(200).json({
      data: data,
      errmsg: '',
      status: 200,
    });
  }

  /* update product with image  */
  @Post('/updateProduct')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: destination,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updateProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body('ProductName') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @Body('quantity') quantity: number,
    @Body('catagory') categoryIds: string,
    @Body('Id') Id: number,
    @Req() req,
    @Res() res,
  ) {
    const data = this.productsService.productUpdateById(
      file,
      name,
      description,
      price,
      quantity,
      categoryIds,
      Id,
    );
    return res.status(200).json({
      data: data,
      errmsg: '',
      status: 200,
    });
  }

  /* base64 img  addproduct */
  @Post('/newproduct')
  async newProductWithImg(
    @Body('ProductName') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @Body('quantity') quantity: number,
    @Body('catagory') categoryIds: string,
    @Body('file') file: string,
    @Req() req,
    @Res() res,
  ) {
  
    const data = this.productsService.addProductWithImg(
      file,
      name,
      description,
      price,
      quantity,
      categoryIds,
 
    );
    return res.status(200).json({
      data: data,
      errmsg: '',
      status: 200,
    });
  }

  /* base64 img updateproduct */

  @Put('/updateproduct/:Id')
  async updateProductWithimg(
    @Body('ProductName') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @Body('quantity') quantity: number,
    @Body('catagory') categoryIds: string,
    @Body('file') file: string,
    @Param('Id') Id: number,
    @Req() req,
    @Res() res,
  ) {
  
    const data = await this.productsService.updateProductById(
      file,
      name,
      description,
      price,
      quantity,
      categoryIds,
      Id,

    );

    return res.status(200).json({
      data: data,
      errmsg: '',
      status: 200,
    });
  }

  /* delete product */
  @ApiOperation({ summary: 'delete product data ' })
  @Delete('/deleteProduct/:id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res() res,
  ) {
  

    const data = await this.productsService.deleteProduct(id);
    return res.status(200).json({
      data: data,
      errmsg: '',
      status: 200,
    });
  }

  /* getAllProducts */
  @Get('allProducts')
  async findAllProducts(@Query() params: any, @Req() req, @Res() res) {
    const { page, pageSize } = params;
    const { totalData, productsWithCategory } =
      await this.productsService.findAllProducts(
        Number(page),
        Number(pageSize),
      );
    return res.status(200).json({
      data: productsWithCategory,
      errmsg: '',
      status: 200,
      totaldata: totalData,
    });
  }

  /* main filter with products
   */
  @Get('listProduct')
  async AllProducts(@Req() req, @Res() res, @Query() params) {
    const { productsWithCategory } = await this.productsService.AllProducts(
      params.sortType,
    );
    // sortType=${data}&searchValue=&id=${0}

    let searchParam = '';
    if (params.searchValue == 'undefined') searchParam = '';
    else searchParam = params.searchValue;
    console.log('params.searchValue', searchParam, params.sortType, params.id);

    const allDataSearch = await this.productsService.allDataSearch(
      searchParam,
      params.sortType,
      params.id,
    );

    return res.status(200).json({
      data: allDataSearch,
      errmsg: '',
      status: 200,
    });
  }

  /* categoryWise product */
  @Get('categoryWise/:id')
  async getProductByCategoryId(@Param() params: any, @Req() req, @Res() res) {
    const result = await this.productsService.categorywiseProduct(
      Number(params.id),
    );
    return res.status(200).json({
      data: result,
      errmsg: '',
      status: 200,
    });
  }

  /* get single product by Id */
  @Get('getProductById/:id')
  async getProduct(@Param() params: any) {
    const data = await this.productsService.getAllProductsWithCategoryById(
      Number(params.id),
    );

    return data;
  }

  /* update Quantity */
  @Get('/updateQuantity')
  async updateQuantity(@Query() params: any, @Req() req, @Res() res) {
    const { id, quantity } = params;
    const data = await this.productsService.updateQuantity(id, quantity);
    return res.json({ data });
  }

  /* GetAllCategories */
  @Get()
  async getUsers(@Request() req, @Response() res) {
    const categories = await this.categoryService.getAllCategory();
    return res.render('products', { categories });
  }

  /* search product */
  @Get('search')
  async searchData(@Query() params: any, @Req() req, @Res() res) {
    const { products, totalData } = await this.productsService.searchProducts(
      params.value,
      Number(params.page),
      Number(params.pageSize),
    );
    return res.status(200).json({
      data: products,
      errmsg: '',
      status: 200,
      totaldata: totalData,
    });
  }
}
