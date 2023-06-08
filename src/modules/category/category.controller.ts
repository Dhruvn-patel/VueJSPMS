import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  Put,
  Render,
  Req,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '../../guards/jwt.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Get()
  @Render('category')
  cartegoryData() {
    return;
  }

  @Get('allCategories')
  async findAllCategory(@Query() params: any, @Req() req, @Res() res) {
    const { page, pageSize } = params;
    const { data, totaldata } = await this.categoryService.getAllCategory(
      Number(page),
      Number(pageSize),
    );
    return res.status(200).json({
      data: data,
      totaldata: totaldata,
      errmsg: '',
      status: 200,
    });
  }

  @Get('getCategory')
  async findCategory(@Req() req, @Res() res) {
    const data = await this.categoryService.getAllCategories();
    return res.status(200).json({
      data: data,
      errmsg: '',
      status: 200,
    });
  }
  @Post('addCategory')
  async addCategory(
    @Body(new ValidationPipe()) categoryRes: CreateCategoryDto,
    @Req() req,
    @Res() res,
  ) {
    const responsedata = await this.categoryService.addCategory(categoryRes);

    if (responsedata.status == 403) {
      return res.status(200).json({
        data: '',
        errmsg: 'already have !',
        status: 403,
      });
    }
    return res.status(200).json({
      data: responsedata.data,
      errmsg: '',
      status: 200,
    });
  }

  @Patch('updateCategory/:id')
  async updatecategory(
    @Body(new ValidationPipe()) updateRes: CreateCategoryDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res() res,
  ) {
    const responsedata = await this.categoryService.updateData(updateRes, id);
    if (responsedata.status == 403) {
      return res.status(200).json({
        data: '',
        errmsg: 'already have !',
        status: 403,
      });
    }
    return res.status(200).json({
      data: responsedata.updateData,
      errmsg: '',
      status: 200,
    });
  }

  @Delete('deleteCategory/:id')
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res() res,
  ) {
    const data = await this.categoryService.deleteData(id);
    return res.status(200).json({
      data: data,
      errmsg: '',
      status: 200,
    });
  }

  @Get('/search')
  async search(@Query() params: any, @Req() req, @Res() res) {
    const { categories, totalData } =
      await this.categoryService.searchCategories(
        params.value,
        Number(params.page),
        Number(params.pageSize),
      );

    return res.status(200).json({
      data: categories,
      errmsg: '',
      status: 200,
      totaldata: totalData,
    });
  }

  @Get('datatable')
  async fetchCategory(@Req() req, @Res() res) {
    const categorydata = await this.categoryService.categoryListing(req);
    console.log(categorydata);

    res.json({
      data: categorydata.user,
      recordsTotal: categorydata.user.length,
      recordsFiltered: categorydata.count.length,
    });
  }
}
