import { CartService } from './cart.service';
import { JwtService } from '@nestjs/jwt';
export declare class CartController {
    private readonly cartService;
    private readonly jwtService;
    constructor(cartService: CartService, jwtService: JwtService);
    displayOrder(req: any, res: any): Promise<any>;
    displayCart(req: any, res: any): Promise<any>;
    displayOrderHistory(req: any, res: any): Promise<any>;
    getQuantityById(params: any, req: any, res: any): Promise<void>;
    getAddInCart(req: any, res: any, data: any): Promise<any>;
    updateQuantity(params: any, req: any, res: any): Promise<void>;
    getCartData(req: any, res: any): Promise<any>;
    deleteSoft(req: any, res: any): Promise<any>;
    getDeleteItemsInCart(params: any, req: any, res: any): Promise<any>;
    addOrder(req: any, res: any, data: any): Promise<any>;
    getRestoreCartData(req: any, res: any): Promise<any>;
    getAllOrder(req: any, res: any, data: any): Promise<any>;
    updateOrders(req: any, res: any): Promise<any>;
    lastData(req: any, res: any): Promise<any>;
}
