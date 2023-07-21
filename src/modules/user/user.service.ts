import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto, rolesId: number) {
    try {
      const hashpassword = await bcrypt.hash(createUserDto.password, 10);
      const emailExists = await prisma.user.findUnique({
        where: { email: createUserDto.email },
      });
      console.log('createUserDto.rolesId', createUserDto.rolesId);
      if (emailExists)
        return {
          errorCode: 409,
        };
      const data = await prisma.user.create({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          rolesId: Number(rolesId),
          password: hashpassword,
        },
      });
      return data;
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    try {
      const totaldata = await prisma.user.count({});
      // const skip = (page - 1) * pageSize;
      // const take = pageSize;
      const data = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          rolesId: true,
          googleId: false,
        },

      });
      return {
        data,
        totaldata,
      };
    } catch (error) {
      return error;
    }
  }

  async update(id: number, updatedata: any) {
    const { name, email } = updatedata;
    console.log(name, email);
    const getemaidata = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    const data = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name: name,
        email: email,
      },
    });

    return {
      statusCode: 200,
      email: getemaidata.email,
    };
  }

  async remove(id: number) {
    const checkadmin = await prisma.user.findFirst({
      where: { id: Number(id) },
      select: {
        rolesId: true,
      },
    });
    const countAdmin = await prisma.user.count({
      where: { rolesId: 1 },
    });

    if (checkadmin.rolesId == 1) {
      if (countAdmin <= 1) {
        return {
          statusCode: 403,
          msg: 'not possible to remove admin',
        };
      }
      const deleteData = await prisma.user.delete({
        where: { id: Number(id) },
      });
      return {
        statusCode: 200,
      };
    } else {
      const deleteData = await prisma.user.delete({
        where: { id: Number(id) },
      });
      return {
        statusCode: 200,
      };
    }
  }

  async searchCategories(
    query: string,
    page: number,
    pageSize: number,
  ): Promise<any> {
    try {
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      const totalData = await prisma.user.count({
        where: {
          OR: [
            {
              name: {
                startsWith: query,
              },
            },
            {
              email: {
                startsWith: query,
              },
            },
          ],
        },
      });
      const categories = await prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                startsWith: query,
              },
            },
            {
              email: {
                startsWith: query,
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        skip,
        take,
      });

      console.log('totaldata', totalData);
      console.log('categories', categories);

      return {
        categories,
        totalData,
      };
    } catch (error) {
      return error;
    }
  }

  async usersDataListing(req: any) {
    const { search, order, start, length } = req.query;

    const query = {
      where: {},
      skip: Number(start) || 0,
      take: Number(length) || 10,
      orderBy: [],
    };

    const { column, dir } = order[0];

    let columnName = req.query.columns[column].data;
    query.orderBy.push({ [`${columnName}`]: dir });

    console.log(columnName);

    let data;
    if (isNaN(search.value)) {
      data = {
        OR: [
          {
            name: {
              contains: search.value,
            },
          },
          {
            email: {
              contains: search.value,
            },
          },
        ],
        deletedAt: null,
      };
    } else {
      data = {
        OR: [
          {
            name: {
              contains: search.value,
            },
          },
          {
            email: {
              contains: search.value,
            },
          },
          {
            id: {
              equals: Number(search.value),
            },
          },
        ],
        deletedAt: null,
      };
    }

    let user = await prisma.user.findMany({
      where: data,
      skip: Number(start),
      take: Number(length),
      orderBy: [{ [`${columnName}`]: dir }],
    });

    let count = await prisma.user.findMany({
      where: data,
    });

    console.log('user', user);
    console.log('count', count);

    return { user, count };
  }
}
