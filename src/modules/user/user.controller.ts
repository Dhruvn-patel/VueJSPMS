import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Res,
  Req,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../../guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/addUser')
  async create(@Body() createUserDto: CreateUserDto, @Req() req, @Res() res) {
    const data = await this.userService.create(
      createUserDto,
      createUserDto.rolesId,
    );
    return res.status(200).json({
      data: data,
      errmsg: '',
      status: 200,
    });
  }

  @UseGuards(AuthGuard)
  @Get('')
  @Render('user')
  AllUsers() {
    return;
  }

  @Get('getUsers')
  async findAll(@Query() params: any, @Req() req, @Res() res) {
    const { page, pageSize } = params;
    const { data, totaldata } = await this.userService.findAll(
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

  @Get('search')
  async searchUsers(@Query() params: any, @Req() req, @Res() res) {
    const { categories, totalData } = await this.userService.searchCategories(
      params.value,
      Number(params.page),
      Number(params.pageSize),
    );
    console.log(categories, totalData);
    return res.status(200).json({
      data: categories,
      errmsg: '',
      status: 200,
      totaldata: totalData,
    });
  }
  @Patch('update/:id')
  async update(
    @Param('id') id: number,
    @Body() updatedata,
    @Req() req,
    @Res() res,
  ) {
    const { token } = req.cookies['JWT_TOKEN'];
    const dataget = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_USER,
    });
    const { email, name, userId } = dataget;
    console.log('updateemail', email);

    const data = await this.userService.update(id, updatedata);

    console.log('data email', data.email, email);

    if (data.email == email) {
      req.session.destroy((err) => {
        console.log('session is destoryed');
      });
      res.clearCookie('JWT_TOKEN');
      return res.json({
        errmsg: '',
        status: 203,
        data: null,
      });
    } else if (data.statusCode === 200) {
      return res.json({
        errmsg: '',
        status: 200,
        data: null,
      });
    }
  }
  @Delete('remove/:id')
  async remove(
    @Param('id', new ValidationPipe()) id: number,
    @Req() req,
    @Res() res,
  ) {
    const data = await this.userService.remove(id);
    if (data.statusCode === 403) {
      return res.json({
        errmsg: 'admin account only one user',
        status: 403,
        data: null,
      });
    } else if (data.statusCode === 200) {
      return res.json({
        errmsg: '',
        status: 200,
        data: null,
      });
    }
  }

  @Get('datatable')
  async datatableUser(@Req() req, @Res() res) {
    const data = await this.userService.usersDataListing(req);

    let editBtn;
    let deleteBtn;
    let role;
    for (let i = 0; i < data.user.length; i++) {
      if (data.user[i].rolesId == 1) {
        role = `<p>Admin</p>`;
      } else {
        role = `<p>User</p>`;
      }

      editBtn = `<input
        type="button"
        value="Edit"
        class="btn btn-primary"
        id="${data.user[i].id}"
        onclick="updateData(this);showModal();"
        />`;
      deleteBtn = `<input
        type="button"
        value="Delete"
        class="btn btn-danger"
        id="${data.user[i].id}"
        onclick="deleteData(this)"
        />`;
      data.user[i]['role'] = role;
      data.user[i]['edit'] = editBtn;
      data.user[i]['delete'] = deleteBtn;
    }
    res.json({
      data: data.user,
      recordsTotal: data.user.length,
      recordsFiltered: data.count.length,
    });
  }
}
