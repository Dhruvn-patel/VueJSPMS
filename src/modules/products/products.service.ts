/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient, ProductCategory } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { productDto } from './dto/product.dto';
const prisma = new PrismaClient();
@Injectable()
export class ProductsService {
  constructor(private prismService: PrismaService) {}
  async addProduct(product: productDto, categoryId: number, userId: number) {
    const { ProductName, description, price, image, quantity } = product;
    try {
      const productdata = await this.prismService.product.create({
        data: {
          ProductName: ProductName,
          description: description,
          price: price,
          image: image,

          quantity: 1,
          ProductCategory: {
            create: {
              Categories: {
                connect: {},
              },
            },
          },
        },
        include: { ProductCategory: true },
      });
      return productdata;
    } catch (error) {
      return error;
    }
  }
  async updateProduct(
    product: productDto,
    id: number,
    catgoryId: number,
  ): Promise<any> {
    const { ProductName, description, price, image } = product;
    const updateProduct = await prisma.product.update({
      where: { id: id },
      data: {
        ProductName: ProductName,
        description: description,
        price: price,
        image: image,
        ProductCategory: {},
      },
    });
  }

  async deleteProduct(id: number): Promise<any> {
    try {
      const isExitData = await this.prismService.productCategory.findFirst({
        where: { productId: id },
      });
      if (isExitData) {
        const deleteDataOnJunction =
          await this.prismService.productCategory.deleteMany({
            where: {
              productId: id,
            },
          });
      }
      const deleteData = await this.prismService.product.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /* Img multer with addProduct */
  async uploadSingleFile(
    file: Express.Multer.File,
    ProductName: string,
    description: string,
    price: number,
    quantity: number,
    categoryIds: string,
  ) {
    const categoryIdArray: number[] = categoryIds
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((categoryId) => !isNaN(categoryId));

    const categories = categoryIdArray.map((categoryId) => ({
      id: Number(categoryId),
    }));
    // const categories = categoryIdArray.map((category) => ({
    //     Categories: { connect: { id: category } },
    // }));

    try {
      const data = await this.prismService.product.create({
        data: {
          ProductName: ProductName,
          description,
          price: Number(price),
          quantity: Number(quantity),
          image: file.filename,
          ProductCategory: {
            create: categories.map((category) => ({
              Categories: {
                connect: category,
              },
            })),
          },
        },
        include: { ProductCategory: true },
      });
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }

  async addProductWithImg(
    file: string,
    ProductName: string,
    description: string,
    price: number,
    quantity: number,
    categoryIds: string,
  ): Promise<any> {
    const categoryIdArray: number[] = categoryIds
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((categoryId) => !isNaN(categoryId));

    const categories = categoryIdArray.map((categoryId) => ({
      id: Number(categoryId),
    }));

    try {
      const data = await this.prismService.product.create({
        data: {
          ProductName: ProductName,
          description,
          price: Number(price),
          quantity: Number(quantity),
          image: file,
          ProductCategory: {
            create: categories.map((category) => ({
              Categories: {
                connect: category,
              },
            })),
          },
        },
        include: { ProductCategory: true },
      });
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }

  async productUpdateById(
    file: Express.Multer.File,
    ProductName: string,
    description: string,
    price: number,
    quantity: number,
    categoryIds: string,
    productId: number,
  ) {
    const categoryIdArray: number[] = categoryIds
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((categoryId) => !isNaN(categoryId));

    const categories = categoryIdArray.map((categoryId) => ({
      id: Number(categoryId),
    }));

    //delete categories
    console.log(file);
    const isExists = await this.deleteCategory(productId);
    console.log(categories);
    try {
      if (file == undefined) {
        const data = await this.prismService.product.update({
          data: {
            ProductName: ProductName,
            description,
            price: Number(price),
            quantity: Number(quantity),

            ProductCategory: {
              create: categories.map((category) => ({
                Categories: {
                  connect: category,
                },
              })),
            },
          },
          where: { id: Number(productId) },
          include: { ProductCategory: true },
        });
        return data;
      }

      const data = await this.prismService.product.update({
        data: {
          ProductName: ProductName,
          description,
          price: Number(price),
          quantity: Number(quantity),
          image: file.filename,
          ProductCategory: {
            create: categories.map((category) => ({
              Categories: {
                connect: category,
              },
            })),
          },
        },
        where: { id: Number(productId) },
        include: { ProductCategory: true },
      });
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateProductById(
    file: string,
    ProductName: string,
    description: string,
    price: number,
    quantity: number,
    categoryIds: string,
    productId: number,
  ) {
    const categoryIdArray: number[] = categoryIds
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((categoryId) => !isNaN(categoryId));
    const categories = categoryIdArray.map((categoryId) => ({
      id: Number(categoryId),
    }));

    //delete categories
    const isExists = await this.deleteCategory(productId);
    try {
      const data = await this.prismService.product.update({
        data: {
          ProductName: ProductName,
          description,
          price: Number(price),
          quantity: Number(quantity),
          image: file,
          ProductCategory: {
            create: categories.map((category) => ({
              Categories: {
                connect: category,
              },
            })),
          },
        },
        where: { id: Number(productId) },
        include: { ProductCategory: true },
      });
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }

  async imageById(productId: number) {
    return await this.prismService.product.findFirst({
      where: { id: Number(productId) },
      select: {
        image: true,
      },
    });
  }
  async deleteCategory(id: number) {
    return await this.prismService.productCategory.deleteMany({
      where: {
        productId: Number(id),
      },
    });
  }
  async getAllProductsWithCategory(): Promise<any> {
    try {
      const productsData = await this.prismService.product.findMany({
        include: {
          ProductCategory: {
            include: {
              Categories: true,
            },
          },
        },
      });

      const productsWithCategory = productsData.map((product) => {
        const categoryNames = product.ProductCategory.map(
          (productCategory) => productCategory.Categories.name,
        );

        return {
          id: product.id,
          ProductName: product.ProductName,
          description: product.description,
          image: product.image,
          price: product.price,
          quantity: product.quantity,
          categoryNames: categoryNames,
        };
      });

      return productsWithCategory;
    } catch (error) {
      throw new Error('Failed to fetch product data');
    }
  }

  async getAllProductsWithCategoryById(id: number): Promise<any> {
    console.log(id);

    try {
      const product = await this.prismService.product.findUnique({
        where: {
          id: id,
        },
      });
      console.log(product);

      return {
        id: product.id,
        ProductName: product.ProductName,
        description: product.description,
        image: product.image,
        price: product.price,
        quantity: product.quantity,
      };
    } catch (error) {
      throw new Error('Failed to fetch product data');
    }
  }
  /* pagination */
  async findAllProducts(page: number, pageSize: number) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const totalData = await this.prismService.product.count({});
    const take = totalData;
    try {
      const productsData = await this.prismService.product.findMany({
        include: {
          ProductCategory: {
            include: {
              Categories: {
                select: { id: true, name: true },
              },
            },
          },
        },

        skip,
        take,
      });

      /* old  */
      // const productsWithCategory = productsData.map((product) => {
      //   const categoryNames = product.ProductCategory.map(
      //     (productCategory) => productCategory.Categories.name,
      //   );

      const productsWithCategory = productsData.map((product) => {
        const categoryNames = product.ProductCategory.map(
          (productCategory) => productCategory.Categories,
        );
        return {
          id: product.id,
          ProductName: product.ProductName,
          description: product.description,
          image: product.image,
          price: product.price,
          quantity: product.quantity,
          categoryNames: categoryNames,
        };
      });

      return { totalData, productsWithCategory };
    } catch (error) {
      throw new Error('Failed to fetch product data');
    }
  }

  async AllProducts(sortType: any) {
    try {
      const productsData = await this.prismService.product.findMany({
        orderBy: {
          price: sortType,
        },
        include: {
          ProductCategory: {
            include: {
              Categories: true,
            },
          },
        },
      });

      const productsWithCategory = productsData.map((product) => {
        const categoryNames = product.ProductCategory.map(
          (productCategory) => productCategory.Categories.name,
        );

        return {
          id: product.id,
          ProductName: product.ProductName,
          description: product.description,
          image: product.image,
          price: product.price,
          quantity: product.quantity,
          categoryNames: categoryNames,
        };
      });

      return { productsWithCategory };
    } catch (error) {
      throw new Error('Failed to fetch product data');
    }
  }

  async searchProducts(query: string, page: number, pageSize: number) {
    try {
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      const productsData = await this.prismService.product.findMany({
        where: {
          OR: [
            {
              ProductName: {
                startsWith: query,
              },
            },
            {
              description: {
                startsWith: query,
              },
            },
          ],
        },
        orderBy: {
          price: 'asc',
        },
        include: {
          ProductCategory: {
            include: {
              Categories: true,
            },
          },
        },
        skip,
        take,
      });
      const productsWithCategory = productsData.map((product) => {
        const categoryNames = product.ProductCategory.map(
          (productCategory) => productCategory.Categories.name,
        );
        return {
          id: product.id,
          ProductName: product.ProductName,
          description: product.description,
          image: product.image,
          price: product.price,
          quantity: product.quantity,
          categoryNames: categoryNames,
        };
      });

      return {
        products: productsWithCategory,
        totalData: 10,
      };
    } catch (error) {
      console.error('Error occurred while searching products:', error);
      throw new Error('Failed to search products');
    }
  }
  /* AllDataSearch  */
  async allDataSearch(query: any, sortType: any, id: number) {
    let productIds: any;
    if (!isNaN(id)) {
      productIds = await prisma.productCategory.findMany({
        where: {
          categoriesId: Number(id),
        },
        select: {
          productId: true,
        },
      });
    } else {
      productIds = [];
    }
    let data: any;
    if (query && id > 0) {
      data = {
        OR: [
          {
            ProductName: {
              startsWith: query,
            },
          },
          {
            description: {
              startsWith: query,
            },
          },
        ],
        id: {
          in: productIds.map((product) => product.productId),
        },
      };
    } else if (!query && id > 0) {
      data = {
        id: {
          in: productIds.map((product) => product.productId),
        },
      };
    } else if (query) {
      data = {
        OR: [
          {
            ProductName: {
              startsWith: query,
            },
          },
          {
            description: {
              startsWith: query,
            },
          },
        ],
      };
    } else {
      data: {
      }
    }

    try {
      const productsData = await this.prismService.product.findMany({
        where: data,
        orderBy: {
          price: sortType,
        },
        include: {
          ProductCategory: {
            include: {
              Categories: true,
            },
          },
        },
      });

      const productsWithCategory = productsData.map((product) => {
        const categoryNames = product.ProductCategory.map(
          (productCategory) => productCategory.Categories.name,
        );

        return {
          id: product.id,
          ProductName: product.ProductName,
          description: product.description,
          image: product.image,
          price: product.price,
          quantity: product.quantity,
          categoryNames: categoryNames,
        };
      });

      return {
        products: productsWithCategory,
      };
    } catch (error) {
      console.error('Error occurred while searching products:', error);
      throw new Error('Failed to search products');
    }
  }

  async updateQuantity(id: number, quantity: number): Promise<any> {
    const data = await this.prismService.product.update({
      where: { id: Number(id) },
      data: {
        quantity: Number(quantity),
      },
    });
  }

  async categorywiseProduct(id: number) {
    if (id) {
      const productIds = await prisma.productCategory.findMany({
        where: {
          categoriesId: Number(id),
        },
        select: {
          productId: true,
        },
      });
      // console.log("productIds", productIds);

      const productDetails = await prisma.product.findMany({
        where: {
          id: {
            in: productIds.map((product) => product.productId),
          },
        },
        include: {
          ProductCategory: {
            include: {
              Categories: true,
            },
          },
        },
      });

      const productsWithCategory = productDetails.map((product) => {
        const categoryNames = product.ProductCategory.map(
          (productCategory) => productCategory.Categories.name,
        );

        return {
          id: product.id,
          ProductName: product.ProductName,
          description: product.description,
          image: product.image,
          price: product.price,
          quantity: product.quantity,
          categoryNames: categoryNames,
        };
      });

      return productsWithCategory;
    } else {
      const productDetails = await prisma.product.findMany({
        include: {
          ProductCategory: {
            include: {
              Categories: true,
            },
          },
        },
      });

      const productsWithCategory = productDetails.map((product) => {
        const categoryNames = product.ProductCategory.map(
          (productCategory) => productCategory.Categories.name,
        );

        return {
          id: product.id,
          ProductName: product.ProductName,
          description: product.description,
          image: product.image,
          price: product.price,
          quantity: product.quantity,
          categoryNames: categoryNames,
        };
      });

      return productsWithCategory;
    }
  }
}
