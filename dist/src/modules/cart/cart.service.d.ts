import { ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class CartService {
    private prismService;
    constructor(prismService: PrismaService);
    AddItemsCart(userId: number, productId: number): Promise<any>;
    addIntoCart(userId: number, data: any, type: boolean): Promise<any>;
    getCartData(userId: number): Promise<{
        listCartData: any[];
        totalRestoreCart: number;
    }>;
    getCartItems(UserID: number, type: string): Promise<any>;
    DeleteItemsInCart(UserID: number, ProductId: number): Promise<any>;
    deleteSoftValues(UserID: Number): Promise<Prisma.BatchPayload>;
    OrderProduct(UserID: number): Promise<any>;
    orderAdd(userId: number): Promise<any>;
    deleteCartData(UserID: number): Promise<void>;
    allOrderProduct(UserID: number): Promise<{
        findProduct: import(".prisma/client").Product[];
        price: any[];
        quantity: any[];
    }>;
    allhistoryData(UserID: number): Promise<{
        listOderedProducts: (import(".prisma/client").Order & {
            OrderProduct: import(".prisma/client").OrderProduct[];
        })[];
        listOdered: (import(".prisma/client").OrderProduct & {
            Product: import(".prisma/client").Product;
        })[];
    }>;
    updateOrder(UserID: number): Promise<ForbiddenException>;
    orderDisplay(): Promise<{
        id: number;
        totalPrice: number;
    }>;
}
