import { ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
export declare class CartService {
    AddItemsCart(userId: number, productId: number): Promise<any>;
    quantityCart(UserID: number, productId: number, quantity: number): Promise<import(".prisma/client").Cart>;
    getCartItems(UserID: number, type: string): Promise<any>;
    DeleteItemsInCart(UserID: number, ProductId: number): Promise<any>;
    getQuantityById(id: number, UserID: number): Promise<any>;
    deleteSoftValues(UserID: Number): Promise<Prisma.BatchPayload>;
    OrderProduct(UserID: number): Promise<any>;
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
