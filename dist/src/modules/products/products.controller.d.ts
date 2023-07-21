/// <reference types="multer" />
import { ProductsService } from './products.service';
import { CategoryService } from '../category/category.service';
import { JwtService } from '@nestjs/jwt';
export declare class ProductsController {
    private readonly productsService;
    private readonly categoryService;
    private readonly jwtService;
    constructor(productsService: ProductsService, categoryService: CategoryService, jwtService: JwtService);
    getProducts(): void;
    addProductwithFile(file: Express.Multer.File, name: string, description: string, price: number, quantity: number, categoryIds: string, req: any, res: any): Promise<any>;
    updateProduct(file: Express.Multer.File, name: string, description: string, price: number, quantity: number, categoryIds: string, Id: number, req: any, res: any): Promise<any>;
    newProductWithImg(name: string, description: string, price: number, quantity: number, categoryIds: string, file: string, req: any, res: any): Promise<any>;
    updateProductWithimg(name: string, description: string, price: number, quantity: number, categoryIds: string, file: string, Id: number, req: any, res: any): Promise<any>;
    deleteProduct(id: number, req: any, res: any): Promise<any>;
    findAllProducts(params: any, req: any, res: any): Promise<any>;
    AllProducts(req: any, res: any, params: any): Promise<any>;
    getProductByCategoryId(params: any, req: any, res: any): Promise<any>;
    getProduct(params: any): Promise<any>;
    updateQuantity(params: any, req: any, res: any): Promise<any>;
    getUsers(req: any, res: any): Promise<any>;
    searchData(params: any, req: any, res: any): Promise<any>;
}
