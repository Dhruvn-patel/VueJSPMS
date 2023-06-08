/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class CartService {
  async AddItemsCart(userId: number, productId: number) {
    try {
      const checkIfExists = await prisma.cart.findFirst({
        where: {
          userId: Number(userId),
          productId: Number(productId),
        },
      });

      if (checkIfExists) {
        return {
          errmsg: 'Product already added ! ',
          status: 403,
        };
      }
      const findProduct = await prisma.product.findUnique({
        where: {
          id: Number(productId),
        },
        select: {
          quantity: true,
          price: true,
        },
      });

      const Quantity = findProduct.quantity;
      const CreateCart = await prisma.cart.create({
        data: {
          userId: userId,
          Quantity: Number(Quantity),
          productId: Number(productId),
          total: findProduct.price,
        },
      });

      return CreateCart;
    } catch (error) {
      return error;
    }
  }
  async quantityCart(UserID: number, productId: number, quantity: number) {
    return await prisma.cart.update({
      where: {
        userId_productId: {
          userId: Number(UserID),
          productId: Number(productId),
        },
      },
      data: {
        Quantity: Number(quantity),
      },
    });
  }
  async getCartItems(UserID: number, type: string): Promise<any> {
    try {
      let getUserCartItems: any;

      if (type == 'cart') {
        getUserCartItems = await prisma.cart.findMany({
          where: {
            userId: UserID,
            deleted: false,
          },
        });
      } else {
        getUserCartItems = await prisma.cart.findMany({
          where: {
            userId: UserID,
            deleted: true,
          },
        });
      }

      const ProductArr = [];
      const QuantityArr = [];

      for (let i = 0; i < getUserCartItems.length; i++) {
        ProductArr.push(getUserCartItems[i].productId);
        QuantityArr.push(getUserCartItems[i].Quantity);
      }
      if (getUserCartItems) {
        const findProductDetails = await prisma.product.findMany({
          where: {
            id: {
              in: ProductArr,
            },
          },
        });
        return { findProductDetails, QuantityArr };
      }
    } catch (error) {
      return new BadRequestException();
    }
  }

  async DeleteItemsInCart(UserID: number, ProductId: number): Promise<any> {
    try {
      const findProductFromCart = await prisma.cart.findMany({
        where: {
          productId: Number(ProductId),
          userId: Number(UserID),
        },
      });

      if (findProductFromCart) {
        const DeleteProducTFromCart = await prisma.cart.delete({
          where: {
            id: findProductFromCart[0].id,
          },
        });

        return DeleteProducTFromCart;
      } else {
        return new BadRequestException();
      }
    } catch (error) {
      return new ForbiddenException();
    }
  }

  async getQuantityById(id: number, UserID: number): Promise<any> {
    const data = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: Number(UserID),
          productId: Number(id),
        },
      },
    });
    return data;
  }

  async deleteSoftValues(UserID: Number) {
    const data = await prisma.cart.updateMany({
      where: {
        userId: Number(UserID),
      },
      data: {
        deleted: true,
      },
    });
    return data;
  }
  /* order  */
  async OrderProduct(UserID: number): Promise<any> {
    try {
      const findProductFromCart = await prisma.cart.findMany({
        where: {
          userId: Number(UserID),
        },
      });
      const objectData: any = findProductFromCart;
      var totalAmount: number = 0;
      var totalQuantity: number = 0;
      const ProductArr = [];

      objectData.map((product: any) => {
        ProductArr.push({
          productId: product.productId,
          userId: Number(UserID),
          quantity: Number(product.Quantity),
        });
        totalAmount += Number(product.total) * Number(product.Quantity);
        totalQuantity += Number(product.Quantity);
      });

      await this.deleteCartData(UserID);

      const placeOrder = await prisma.order.create({
        data: {
          totalPrice: Number(totalAmount),
          userId: Number(UserID),
          OrderProduct: {
            createMany: {
              data: ProductArr,
            },
          },
        },
      });
      return placeOrder;
    } catch (error) {
      console.log(error);
      return new ForbiddenException();
    }
  }

  async deleteCartData(UserID: number) {
    try {
      await prisma.cart.deleteMany({
        where: {
          userId: Number(UserID),
        },
      });
    } catch (error) {}
  }

  async allOrderProduct(UserID: number) {
    const listOderedProducts = await prisma.order.findMany({
      where: {
        userId: Number(UserID),
        isOrdered: false,
      },
      include: {
        OrderProduct: true,
      },
    });

    const ProductArr = [];
    const price = [];
    const quantity = [];
    for (let j = 0; j < listOderedProducts.length; j++) {
      for (let i = 0; i < listOderedProducts[j].OrderProduct.length; i++) {
        quantity.push(listOderedProducts[j].OrderProduct[i].quantity);
        ProductArr.push(listOderedProducts[j].OrderProduct[i].productId);
        price.push(listOderedProducts[j].totalPrice);
      }
    }
    const findProduct = await prisma.product.findMany({
      where: {
        id: {
          in: ProductArr,
        },
      },
    });
    return { findProduct, price, quantity };
  }

  async allhistoryData(UserID: number) {
    const listOderedProducts = await prisma.order.findMany({
      where: {
        userId: Number(UserID),
      },
      include: {
        OrderProduct: true,
      },
    });

    const orderIds = [];
    for (let i = 0; i < listOderedProducts.length; i++) {
      orderIds.push(listOderedProducts[i].id);
    }
    const listOdered = await prisma.orderProduct.findMany({
      where: {
        orderId: { in: orderIds },
      },
      include: {
        Product: true,
      },
    });

    return { listOderedProducts, listOdered };
  }

  async updateOrder(UserID: number) {
    try {
      const data = await this.orderDisplay();
      const listOderedProducts = await prisma.order.updateMany({
        where: {
          userId: UserID,
        },
        data: {
          isOrdered: true,
        },
      });
    } catch (error) {
      return new ForbiddenException();
    }
  }
  async orderDisplay() {
    const data = await prisma.order.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        totalPrice: true,
      },
    });

    return data[0];
  }
}
