/// <reference types="multer" />
import { productDto } from './dto/product.dto';
import { ProductsService } from './products.service';
import { CategoryService } from '../category/category.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly categoryService;
    constructor(productsService: ProductsService, categoryService: CategoryService);
    getProducts(): void;
    addProduct(product: productDto): Promise<any>;
    addProductwithFile(file: Express.Multer.File, name: string, description: string, price: number, quantity: number, categoryIds: string, req: any, res: any): Promise<any>;
    updateProduct(file: Express.Multer.File, name: string, description: string, price: number, quantity: number, categoryIds: string, Id: number, req: any, res: any): Promise<any>;
    deleteProduct(id: number, req: any, res: any): Promise<any>;
    findAllProducts(params: any, req: any, res: any): Promise<any>;
    AllProducts(req: any, res: any, params: any): Promise<any>;
    getProductByCategoryId(params: any, req: any, res: any): Promise<any>;
    getProduct(params: any): Promise<any>;
    updateQuantity(params: any, req: any, res: any): Promise<any>;
    checkProduct(product: any): void;
    getUsers(req: any, res: any): Promise<any>;
    searchData(params: any, req: any, res: any): Promise<any>;
}
