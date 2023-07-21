import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
const prisma = new PrismaClient();
@Injectable()
export class CategoryService {
  constructor(private prismService: PrismaService) {}

  async addCategory(categoryRes: CreateCategoryDto): Promise<any> {
    const categoryname = categoryRes.name;

    try {
      const ischeckalready = await this.prismService.categories.findFirst({
        where: {
          name: categoryname,
        },
      });

      if (ischeckalready) {
        return { ischeckalready, status: 403 };
      }
      const data = await this.prismService.categories.create({
        data: {
          name: categoryname,
        },
      });
      return {
        data,
        status: 200,
      };
    } catch (error) {
      return error;
    }
  }
  async getAllCategories(): Promise<any> {
    const data = await this.prismService.categories.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return data;
  }

  async getAllCategory() {
    const totaldata = await this.prismService.categories.count({});

    const data = await this.prismService.categories.findMany({
      select: {
        id: true,
        name: true,
      },

    });
    return {
      data,
      totaldata,
    };
  }
  async updateData(updateRes: CreateCategoryDto, id: number): Promise<any> {
    const { name } = updateRes;
    try {
      const ischeckalready = await this.prismService.categories.findFirst({
        where: {
          name: name,
        },
      });

      if (ischeckalready) {
        return { ischeckalready, status: 403 };
      }

      const updateData = await prisma.categories.update({
        where: {
          id: id,
        },
        data: {
          name: name,
        },
      });
      return {
        updateData,
        status: 200,
      };
    } catch (error) {
      return error;
    }
  }
  async deleteData(id: number): Promise<any> {
    try {
      /* delete before in junction table */
      const isExitData = await this.prismService.productCategory.findFirst({
        where: { categoriesId: id },
      });

      if (isExitData) {
        const deleteDataOnJunction =
          await this.prismService.productCategory.deleteMany({
            where: {
              categoriesId: id,
            },
          });
      }
      const deleteData = await this.prismService.categories.delete({
        where: {
          id: id,
        },
      });
      return deleteData;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findAllCategoriesPaginated(
    page: number,
    pageSize: number,
  ): Promise<any> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const categories = await this.prismService.categories.findMany({
      skip,
      take,
    });

    return categories;
  }

  async findAllSortedCategories(
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
  ): Promise<any> {
    const validColumns = ['id', 'name'];

    if (!validColumns.includes(sortBy)) {
      throw new Error(
        `Invalid column for sorting. Valid columns: ${validColumns.join(', ')}`,
      );
    }

    const categories = await this.prismService.categories.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return categories;
  }
  async searchCategories(
    query: string,
    page: number,
    pageSize: number,
  ): Promise<any> {
    try {
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      const totalData = await this.prismService.categories.count({
        where: {
          name: {
            startsWith: query,
          },
        },
      });
      const categories = await this.prismService.categories.findMany({
        where: {
          name: {
            startsWith: query,
          },
        },
        select: {
          id: true,
          name: true,
        },
        skip,
        take,
      });

      return {
        categories,
        totalData,
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  async categoryListing(req: any) {
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


    let data;
    if (isNaN(search.value)) {
      data = {
        name: {
          contains: search.value,
        },
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
            id: {
              equals: Number(search.value),
            },
          },
        ],
        deletedAt: null,
      };
    }

    let user = await prisma.categories.findMany({
      where: data,
      skip: Number(start),
      take: Number(length),
      orderBy: [{ [`${columnName}`]: dir }],
    });

    let count = await prisma.categories.findMany({
      // where: data,
    });

    return { user, count };
  }
}
